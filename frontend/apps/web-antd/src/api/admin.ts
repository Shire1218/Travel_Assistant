import { requestClient } from '#/api/request';

/** 用户管理条目（管理员视角，不含密码哈希） */
export interface AdminUserItem {
  id: number;
  username: string;
  nickname: string;
  role: 'admin' | 'user';
  status: number;
  createdAt: string;
}

/** 系统设置（高德两个 key） */
export interface SystemSettings {
  amapJsKey: string;
  amapWebServiceKey: string;
}

// ---------- 用户管理 ----------

/** 用户列表 */
export async function getAdminUserListApi() {
  return requestClient.get<AdminUserItem[]>('/admin/users');
}

/** 创建用户 */
export async function createAdminUserApi(data: {
  nickname?: string;
  password: string;
  role?: 'admin' | 'user';
  username: string;
}) {
  return requestClient.post<{ id: number }>('/admin/users', data);
}

/** 编辑用户（昵称 / 角色 / 状态） */
export async function updateAdminUserApi(
  id: number,
  data: { nickname?: string; role?: 'admin' | 'user'; status?: number },
) {
  return requestClient.put<null>(`/admin/users/${id}`, data);
}

/** 重置用户密码 */
export async function resetAdminUserPasswordApi(id: number, password: string) {
  return requestClient.put<null>(`/admin/users/${id}/password`, { password });
}

// ---------- 系统设置 ----------

/** 读取系统设置 */
export async function getSystemSettingsApi() {
  return requestClient.get<SystemSettings>('/admin/settings');
}

/** 更新系统设置 */
export async function updateSystemSettingsApi(data: Partial<SystemSettings>) {
  return requestClient.put<null>('/admin/settings', data);
}
