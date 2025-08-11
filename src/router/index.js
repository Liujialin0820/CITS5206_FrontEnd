import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: () => import("@/views/public_page/login_page/login.vue"),
    },
    {
      path: "/admin-login",
      component: () =>
        import("@/views/public_page/admin_login/admin_login.vue"),
    },
    {
      path: "/",
      component: () => import("@/views/public_page/home_page/home.vue"),
    },
  ],
});

export default router;
