import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from './system-setting.entity';
import { UserService } from '../user/user.service';

/** 设置键与对外字段名的映射 */
const SETTING_KEYS = {
  amapJsKey: 'amap_js_key',
  amapWebServiceKey: 'amap_web_service_key',
} as const;

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(SystemSetting)
    private readonly settingRepository: Repository<SystemSetting>,
  ) {}

  /** 用户列表（脱敏：不返回密码哈希） */
  async listUsers() {
    const users = await this.userService.findAll();
    return users.map((u) => ({
      id: Number(u.id),
      username: u.username,
      nickname: u.nickname,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    }));
  }

  /** 创建用户 */
  async createUser(params: {
    nickname?: string;
    password: string;
    role?: 'admin' | 'user';
    username: string;
  }) {
    const user = await this.userService.createUser(params);
    return { id: Number(user.id) };
  }

  /** 编辑用户：昵称 / 角色 / 状态 */
  async updateUser(
    userId: number,
    params: { nickname?: string; role?: 'admin' | 'user'; status?: number },
    operatorId: number,
  ) {
    await this.userService.updateByAdmin(userId, params, operatorId);
    return null;
  }

  /** 重置用户密码 */
  async resetPassword(userId: number, password: string) {
    await this.userService.resetPassword(userId, password);
    return null;
  }

  /** 读取系统设置（高德两个 key） */
  async getSettings() {
    const rows = await this.settingRepository.find();
    const result: Record<string, string> = {};
    for (const [field, key] of Object.entries(SETTING_KEYS)) {
      const row = rows.find((r) => r.settingKey === key);
      result[field] = row?.settingValue ?? '';
    }
    return result;
  }

  /** 更新系统设置（部分更新，仅更新传入的字段） */
  async updateSettings(dto: {
    amapJsKey?: string;
    amapWebServiceKey?: string;
  }) {
    for (const [field, key] of Object.entries(SETTING_KEYS)) {
      const value = dto[field as keyof typeof dto];
      if (value === undefined) {
        continue;
      }
      const exists = await this.settingRepository.findOne({
        where: { settingKey: key },
      });
      if (exists) {
        await this.settingRepository.update(exists.id, { settingValue: value });
      } else {
        throw new BadRequestException(`设置项 ${key} 不存在`);
      }
    }
    return null;
  }
}
