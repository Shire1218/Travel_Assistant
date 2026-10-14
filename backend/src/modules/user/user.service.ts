import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** 按用户名查找 */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  /** 按 ID 查找 */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /** 查询全部用户（管理员用户管理，用户量 < 50 不分页） */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ order: { createdAt: 'ASC' } });
  }

  /** 创建用户（注册 / 管理员后台创建） */
  async createUser(params: {
    nickname?: string;
    password: string;
    role?: 'admin' | 'user';
    username: string;
  }): Promise<User> {
    const exists = await this.findByUsername(params.username);
    if (exists) {
      throw new ConflictException('用户名已存在');
    }
    const user = this.userRepository.create({
      username: params.username,
      passwordHash: bcrypt.hashSync(params.password, 10),
      nickname: params.nickname || params.username,
      role: params.role ?? 'user',
    });
    return this.userRepository.save(user);
  }

  /** 登录校验：用户存在、未禁用、密码正确 */
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const matched = await bcrypt.compare(password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    if (user.status !== 1) {
      throw new UnauthorizedException('账号已被禁用');
    }
    return user;
  }

  /** 修改昵称（个人信息） */
  async updateNickname(userId: number, nickname: string): Promise<void> {
    await this.userRepository.update(userId, { nickname });
  }

  /** 修改密码（需校验旧密码） */
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    const matched = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!matched) {
      throw new BadRequestException('旧密码错误');
    }
    await this.userRepository.update(userId, {
      passwordHash: bcrypt.hashSync(newPassword, 10),
    });
  }

  /** 管理员编辑用户：昵称 / 角色 / 状态 */
  async updateByAdmin(
    userId: number,
    params: { nickname?: string; role?: 'admin' | 'user'; status?: number },
    operatorId: number,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    // 防止管理员禁用/降级自己导致失去管理入口
    if (Number(userId) === Number(operatorId)) {
      if (params.status === 0) {
        throw new BadRequestException('不能禁用自己的账号');
      }
      if (params.role === 'user') {
        throw new BadRequestException('不能修改自己的角色');
      }
    }
    await this.userRepository.update(userId, params);
  }

  /** 管理员重置用户密码 */
  async resetPassword(userId: number, password: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    await this.userRepository.update(userId, {
      passwordHash: bcrypt.hashSync(password, 10),
    });
  }
}
