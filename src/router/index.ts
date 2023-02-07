import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

// console.log(require('@/views/home.vue').default);

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/views/404.vue'),
  },
].filter(Boolean) as Array<RouteRecordRaw>;

const router = createRouter({
  history: createWebHistory(import.meta.env.VUE_APP_ROUTER_BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition)
      return savedPosition;

    else
      return { top: 0 };
  },
});

export default router;
