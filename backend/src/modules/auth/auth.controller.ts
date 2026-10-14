import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /** 注册（SRS F1.1：用户名 + 密码，昵称可选） */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    if (dto.username.trim() !== dto.username) {
      throw new BadRequestException('用户名不能包含首尾空格');
    }
    await this.userService.createUser({
      username: dto.username,
      password: dto.password,
      nickname: dto.nickname,
    });
    return null;
  }

  /** 登录 */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  /** 登出（需登录态） */
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = (req as Request & { user: { id: number } }).user;
    return this.authService.logout(user.id);
  }

  /** 获取当前登录用户信息 */
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async profile(@Req() req: Request) {
    const user = (req as Request & { user: { id: number } }).user;
    return this.authService.getProfile(user.id);
  }

  /** 获取当前用户权限码（M1 阶段返回空数组，权限体系按角色区分） */
  @UseGuards(AuthGuard('jwt'))
  @Get('codes')
  async codes() {
    return [];
  }
}
