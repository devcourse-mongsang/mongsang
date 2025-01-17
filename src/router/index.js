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
              path: "자유게시판",
              name: "free-board",
              component: () => import("../pages/community-pages/FreeBoard.vue"),
            },
            {
              path: "초현실몽",
              name: "surreal-dream",
              component: () =>
                import("../pages/community-pages/SurrealDream.vue"),
            },
            {
              path: "예지몽",
              name: "prophetic-dream",
              component: () =>
                import("../pages/community-pages/PropheticDream.vue"),
            },
            {
              path: "반복몽",
              name: "recurrent-dream",
              component: () =>
                import("../pages/community-pages/RecurrentDream.vue"),
            },
            {
              path: "자각몽",
              name: "lucid-dream",
              component: () =>
                import("../pages/community-pages/RucidDream.vue"),
            },
            {
              path: "악몽",
              name: "nightmare",
              component: () => import("../pages/community-pages/Nightmare.vue"),
            },
            {
              path: "길몽",
              name: "good-dream",
              component: () => import("../pages/community-pages/GoodDream.vue"),
            },
            {
              path: "해몽",
              name: "dream-interpretation",
              component: () =>
                import("../pages/community-pages/DreamInterpretation.vue"),
            },
          ],
        },
      ],
    },
  ],
});

export default router;
