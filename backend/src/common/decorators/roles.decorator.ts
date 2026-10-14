import { SetMetadata } from '@nestjs/common';

/** 角色元数据 key */
export const ROLES_KEY = 'roles';

/** 标记接口所需角色，如 @Roles('admin') */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
