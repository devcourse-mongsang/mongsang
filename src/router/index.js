import { createRouter, createWebHistory } from "vue-router";
import LayoutMain from "@/layouts/LayoutMain.vue";
import LayoutCommunity from "@/layouts/LayoutCommunity.vue";

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
        {
          path: "/community",
          component: LayoutCommunity,
          children: [
            {
              path: "free-board",
              name: "free-board",
              component: () => import("../pages/community-pages/FreeBoard.vue"),
            },
            {
              path: "surreal-dream",
              name: "surreal-dream",
              component: () =>
                import("../pages/community-pages/SurrealDream.vue"),
            },
            {
              path: "prophetic-dream",
              name: "prophetic-dream",
              component: () =>
                import("../pages/community-pages/PropheticDream.vue"),
            },
            {
              path: "recurrent-dream",
              name: "recurrent-dream",
              component: () =>
                import("../pages/community-pages/RecurrentDream.vue"),
            },
            {
              path: "lucid-dream",
              name: "lucid-dream",
              component: () =>
                import("../pages/community-pages/RucidDream.vue"),
            },
            {
              path: "nightmare",
              name: "nightmare",
              component: () => import("../pages/community-pages/Nightmare.vue"),
            },
            {
              path: "good-dream",
              name: "good-dream",
              component: () => import("../pages/community-pages/GoodDream.vue"),
            },
            {
              path: "dream-interpretation",
              name: "dream-interpretation",
              component: () =>
                import("../pages/community-pages/DreamInterpretation.vue"),
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../pages/Login.vue"),
    },
    {
      path: "/join",
      name: "join",
      component: () => import("../pages/Join.vue"),
    },
  ],
});

export default router;
