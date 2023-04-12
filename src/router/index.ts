import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import HomeVue from '@/views/home.vue';
import NotFound from '@/views/404.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeVue,
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: NotFound,
  },
].filter(Boolean) as Array<RouteRecordRaw>;

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_ROUTER_BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
