import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { UserService } from './user.service';

/** 修改昵称 DTO */
class UpdateProfileDto {
  @IsString()
  @MinLength(1, { message: '昵称不能为空' })
  @MaxLength(50)
  nickname: string;
}

/** 修改密码 DTO */
class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: '请输入旧密码' })
  oldPassword: string;

  @IsString()
  @MinLength(6, { message: '新密码至少 6 位' })
  @MaxLength(50)
  newPassword: string;
}

/** 当前登录用户：修改个人信息 / 密码（SRS F1.3） */
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 修改昵称 */
  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const user = (req as Request & { user: { id: number } }).user;
    await this.userService.updateNickname(user.id, dto.nickname.trim());
    return null;
  }

  /** 修改密码 */
  @Put('password')
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const user = (req as Request & { user: { id: number } }).user;
    await this.userService.changePassword(
      user.id,
      dto.oldPassword,
      dto.newPassword,
    );
    return null;
  }
}
