import type { RouteRecordRaw } from 'vue-router';

/** 计划管理（M1：计划列表；后续里程碑在此模块下扩展计划编辑器页面） */
const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:map',
      order: 0,
      title: '我的计划',
    },
    name: 'Plan',
    path: '/plan',
    children: [
      {
        name: 'PlanList',
        path: 'list',
        component: () => import('#/views/plan/list/index.vue'),
        meta: {
          icon: 'lucide:map',
          title: '计划列表',
        },
      },
    ],
  },
];

export default routes;
