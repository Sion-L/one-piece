import { BASE_LAYOUT } from '~/router/constants'

export default {
  path: '/dashboard',
  component: BASE_LAYOUT,
  children: [
    {
      path: '',
      name: 'Dashboard',
      component: () => import('~/pages/dashboard/index.vue'),
      meta: {
        title: '工作台',
        requiresAuth: true,
        cached: true,
      },
    },
  ],
}
