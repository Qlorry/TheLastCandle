import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CallbackPage from "../views/CallbackPage.vue"

import { authGuard } from "@auth0/auth0-vue";
import TestHubVue from '@/components/TestHub.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: "/callback",
      name: "callback",
      component: CallbackPage,
    },
    {
      path: "/board",
      name: "board",
      component: () => import('../views/BoardPage.vue'),
      //beforeEnter: authGuard,
    },
    {
      path: "/test_hub",
      name: "test_hub",
      component: TestHubVue,
    },
  ]
})

export default router
