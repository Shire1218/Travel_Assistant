import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemoItem } from './demo.entity';
import { CreateDemoDto } from './dto/create-demo.dto';

@Injectable()
export class DemoService {
  constructor(
    @InjectRepository(DemoItem)
    private readonly demoRepository: Repository<DemoItem>,
  ) {}

  /** 列表 */
  findAll(): Promise<DemoItem[]> {
    return this.demoRepository.find({ order: { id: 'DESC' } });
  }

  /** 新建 */
  async create(dto: CreateDemoDto): Promise<DemoItem> {
    const item = this.demoRepository.create(dto);
    return this.demoRepository.save(item);
  }

  /** 更新 */
  async update(id: number, dto: Partial<CreateDemoDto>): Promise<DemoItem> {
    const item = await this.demoRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('记录不存在');
    }
    Object.assign(item, dto);
    return this.demoRepository.save(item);
  }

  /** 删除 */
  async remove(id: number): Promise<void> {
    const result = await this.demoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('记录不存在');
    }
  }
}
