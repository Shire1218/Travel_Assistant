import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PlanService } from './plan.service';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';

/** 计划接口：全部按登录用户隔离（SRS 数据归属规则） */
@Controller('plans')
@UseGuards(AuthGuard('jwt'))
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  private getUserId(req: Request): number {
    return (req as Request & { user: { id: number } }).user.id;
  }

  /** 本人计划列表 */
  @Get()
  async list(@Req() req: Request) {
    return this.planService.listByUser(this.getUserId(req));
  }

  /** 创建计划 */
  @Post()
  async create(@Req() req: Request, @Body() dto: CreatePlanDto) {
    return this.planService.create(this.getUserId(req), dto);
  }

  /** 计划详情 */
  @Get(':id')
  async detail(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.planService.findOwned(id, this.getUserId(req));
  }

  /** 更新计划 */
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.planService.update(id, this.getUserId(req), dto);
  }

  /** 删除计划 */
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.planService.remove(id, this.getUserId(req));
  }

  /** 复制计划 */
  @Post(':id/copy')
  async copy(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.planService.copy(id, this.getUserId(req));
  }
}
