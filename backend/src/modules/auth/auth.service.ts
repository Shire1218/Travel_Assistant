import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /** 登录：校验通过后签发 JWT */
  async login(username: string, password: string) {
    const user: User = await this.userService.validateUser(username, password);
    const payload: JwtPayload = {
      sub: Number(user.id),
      username: user.username,
      role: user.role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: Number(user.id),
        username: user.username,
        nickname: user.nickname,
        role: user.role,
      },
    };
  }

  /** 获取当前用户详情（供前端用户信息展示） */
  async getProfile(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return {
      id: Number(user.id),
      username: user.username,
      nickname: user.nickname,
      role: user.role,
    };
  }

  /** 登出：无状态 JWT，前端清除 token 即可，此处仅做登录态校验 */
  async logout(userId: number) {
    if (!userId) {
      throw new UnauthorizedException('未登录');
    }
    return null;
  }
}
