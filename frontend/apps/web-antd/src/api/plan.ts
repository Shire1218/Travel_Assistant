import { requestClient } from '#/api/request';

/** 计划元信息（SRS F2.2） */
export interface PlanItem {
  id: number;
  userId: number;
  title: string;
  startDate: string;
  endDate: string;
  companionCount: number;
  coverImage: null | string;
  budgetTotal: null | string;
  remark: null | string;
  createdAt: string;
  updatedAt: string;
}

/** 计划创建/编辑参数 */
export interface PlanParams {
  budgetTotal?: string;
  companionCount?: number;
  coverImage?: string;
  endDate: string;
  remark?: string;
  startDate: string;
  title: string;
}

/** 计划列表（按登录用户隔离） */
export async function getPlanListApi() {
  return requestClient.get<PlanItem[]>('/plans');
}

/** 创建计划 */
export async function createPlanApi(data: PlanParams) {
  return requestClient.post<PlanItem>('/plans', data);
}

/** 计划详情 */
export async function getPlanDetailApi(id: number) {
  return requestClient.get<PlanItem>(`/plans/${id}`);
}

/** 更新计划 */
export async function updatePlanApi(id: number, data: PlanParams) {
  return requestClient.put<PlanItem>(`/plans/${id}`, data);
}

/** 删除计划 */
export async function deletePlanApi(id: number) {
  return requestClient.delete<null>(`/plans/${id}`);
}

/** 复制计划（M1 阶段复制元信息，后续里程碑扩展行程/预算/行李） */
export async function copyPlanApi(id: number) {
  return requestClient.post<PlanItem>(`/plans/${id}/copy`);
}
