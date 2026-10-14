import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

/** 框架自带路由：演示内容已移除，仅保留个人中心入口 */
const routes: RouteRecordRaw[] = [
  {
    name: 'Profile',
    path: '/profile',
    component: () => import('#/views/_core/profile/index.vue'),
    meta: {
      icon: 'lucide:user',
      hideInMenu: true,
      title: $t('page.auth.profile'),
    },
  },
];

export default routes;
