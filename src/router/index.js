import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../pages/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/record",
      name: "record",
      component: () => import("../pages/Record.vue"),
    },
    {
      path: "/diary",
      name: "diary",
      component: () => import("../pages/Diary.vue"),
    },
  ],
});

export default router;
