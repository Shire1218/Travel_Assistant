import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/** 后端 /auth/profile 返回的用户信息结构 */
interface ProfileResult {
  id: number;
  nickname: string;
  role: string;
  username: string;
}

/**
 * 获取用户信息（对接后端 /auth/profile 并映射为 Vben 所需的 UserInfo）
 */
export async function getUserInfoApi(): Promise<UserInfo> {
  const profile = await requestClient.get<ProfileResult>('/auth/profile');
  return {
    avatar: '',
    desc: '',
    homePath: '/plan/list',
    realName: profile.nickname || profile.username,
    roles: [profile.role],
    token: '',
    userId: String(profile.id),
    username: profile.username,
  };
}

/**
 * 修改昵称（SRS F1.3）
 */
export async function updateProfileApi(nickname: string) {
  return requestClient.put<null>('/user/profile', { nickname });
}

/**
 * 修改密码（需旧密码校验）
 */
export async function changePasswordApi(params: {
  newPassword: string;
  oldPassword: string;
}) {
  return requestClient.put<null>('/user/password', params);
}
