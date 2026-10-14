import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import {
  AdminCreateUserDto,
  AdminResetPasswordDto,
  AdminUpdateSettingsDto,
  AdminUpdateUserDto,
} from './admin.dto';

/** 管理员接口：用户管理 + 系统设置（SRS 角色：管理员） */
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /** 用户列表 */
  @Get('users')
  async listUsers() {
    return this.adminService.listUsers();
  }

  /** 创建用户 */
  @Post('users')
  async createUser(@Body() dto: AdminCreateUserDto) {
    return this.adminService.createUser(dto);
  }

  /** 编辑用户（昵称 / 角色 / 状态） */
  @Put('users/:id')
  async updateUser(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateUserDto,
  ) {
    const operator = (req as Request & { user: { id: number } }).user;
    return this.adminService.updateUser(id, dto, operator.id);
  }

  /** 重置用户密码 */
  @Put('users/:id/password')
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminResetPasswordDto,
  ) {
    return this.adminService.resetPassword(id, dto.password);
  }

  /** 读取系统设置（高德 key） */
  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  /** 更新系统设置（高德 key） */
  @Put('settings')
  async updateSettings(@Body() dto: AdminUpdateSettingsDto) {
    return this.adminService.updateSettings(dto);
  }
}
