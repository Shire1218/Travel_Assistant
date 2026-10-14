import type { RouteRecordRaw } from 'vue-router';

/** 系统管理（仅管理员可见：meta.authority 与角色匹配过滤） */
const routes: RouteRecordRaw[] = [
  {
    meta: {
      authority: ['admin'],
      icon: 'lucide:settings',
      order: 900,
      title: '系统管理',
    },
    name: 'System',
    path: '/system',
    children: [
      {
        name: 'SystemUsers',
        path: 'users',
        component: () => import('#/views/admin/users/index.vue'),
        meta: {
          authority: ['admin'],
          icon: 'lucide:users',
          title: '用户管理',
        },
      },
      {
        name: 'SystemSettings',
        path: 'settings',
        component: () => import('#/views/admin/settings/index.vue'),
        meta: {
          authority: ['admin'],
          icon: 'lucide:key-round',
          title: '系统设置',
        },
      },
    ],
  },
];

export default routes;
