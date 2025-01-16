import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../pages/Home.vue";
import LayoutMain from "@/layouts/LayoutMain.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: LayoutMain,
      children: [
        {
          path: "",
          name: "Home",
          component: () => import("../pages/Home.vue"),
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
    },
  ],
});

export default router;
