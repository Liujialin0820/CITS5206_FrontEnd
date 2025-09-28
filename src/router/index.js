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
    {
      path: "/admin-home/question-bank/create",
      name: "create-question",
      component: () =>
        import("@/views/admin_page/question_bank/create_question.vue"),
    },

    // ----------------- 管理员后台页面 -----------------
    {
      path: "/admin-home",
      name: "admin-home",
      component: () => import("@/views/admin_page/home/home.vue"),
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("@/views/admin_page/dashboard/dashboard.vue"),
        },
        {
          path: "question-bank",
          name: "question-bank",
          component: () =>
            import("@/views/admin_page/question_bank/question_bank.vue"),
        },
        {
          path: "test-papers",
          name: "test-papers",
          component: () =>
            import("@/views/admin_page/test_papers/test_papers.vue"),
        },
        {
          path: "students",
          name: "students",
          component: () => import("@/views/admin_page/students/students.vue"),
        },
      ],
    },
  ],
});

export default router;
