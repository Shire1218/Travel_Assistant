import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './plan.entity';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  /** DTO → 实体字段（公共转换，创建/更新共用） */
  private toEntityFields(dto: CreatePlanDto | UpdatePlanDto) {
    const fields: Record<string, unknown> = {};
    if (dto.title !== undefined) fields.title = dto.title;
    if (dto.startDate !== undefined) fields.startDate = dto.startDate;
    if (dto.endDate !== undefined) fields.endDate = dto.endDate;
    if (dto.companionCount !== undefined) {
      fields.companionCount = dto.companionCount;
    }
    if (dto.coverImage !== undefined) fields.coverImage = dto.coverImage;
    if (dto.remark !== undefined) fields.remark = dto.remark;
    if (dto.budgetTotal !== undefined) {
      const n = Number(dto.budgetTotal);
      if (Number.isNaN(n) || n < 0) {
        throw new BadRequestException('总预算必须是不小于 0 的数字');
      }
      fields.budgetTotal = dto.budgetTotal === '' ? null : dto.budgetTotal;
    }
    return fields;
  }

  /** 日期范围校验：结束不早于开始 */
  private validateDateRange(startDate?: string, endDate?: string) {
    if (startDate && endDate && endDate < startDate) {
      throw new BadRequestException('出行结束日期不能早于开始日期');
    }
  }

  /** 本人计划列表（按更新时间倒序） */
  async listByUser(userId: number): Promise<Plan[]> {
    return this.planRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  /** 创建计划 */
  async create(userId: number, dto: CreatePlanDto): Promise<Plan> {
    this.validateDateRange(dto.startDate, dto.endDate);
    const plan = this.planRepository.create({
      ...this.toEntityFields(dto),
      userId,
    } as Partial<Plan>);
    return this.planRepository.save(plan);
  }

  /** 查询本人计划（数据隔离：仅允许访问自己的计划） */
  async findOwned(id: number, userId: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('计划不存在');
    }
    if (Number(plan.userId) !== Number(userId)) {
      throw new ForbiddenException('无权访问该计划');
    }
    return plan;
  }

  /** 更新计划 */
  async update(id: number, userId: number, dto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOwned(id, userId);
    this.validateDateRange(
      dto.startDate ?? plan.startDate,
      dto.endDate ?? plan.endDate,
    );
    const fields = this.toEntityFields(dto);
    await this.planRepository.update(plan.id, fields);
    return this.findOwned(id, userId);
  }

  /** 删除计划（列表页二次确认由前端负责） */
  async remove(id: number, userId: number): Promise<void> {
    const plan = await this.findOwned(id, userId);
    await this.planRepository.delete(plan.id);
  }

  /**
   * 复制计划（SRS F2.3）
   * M1 阶段复制计划元信息；行程/预算/行李清单数据结构在 M3/M6/M7 落地后，
   * 在此方法中同步扩展复制逻辑。
   */
  async copy(id: number, userId: number): Promise<Plan> {
    const plan = await this.findOwned(id, userId);
    const copy = this.planRepository.create({
      userId,
      title: `${plan.title}（副本）`,
      startDate: plan.startDate,
      endDate: plan.endDate,
      companionCount: plan.companionCount,
      coverImage: plan.coverImage,
      budgetTotal: plan.budgetTotal,
      remark: plan.remark,
    });
    return this.planRepository.save(copy);
  }
}
