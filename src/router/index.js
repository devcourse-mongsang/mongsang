import { createRouter, createWebHistory } from "vue-router";
import LayoutMain from "@/layouts/LayoutMain.vue";
import LayoutCommunity from "@/layouts/LayoutCommunity.vue";
import LayoutMyPage from "@/layouts/LayoutMyPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../pages/NotFound.vue"),
    },
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
    {
      path: "/community",
      component: LayoutCommunity,
      children: [
        {
          path: "/community/:boardType",
          name: "communityBoard",
          component: () => import("../pages/community-pages/CommunityBoard.vue"),
        },
        {
          path: "/:boardType/:postId",
          name: "postDetail",
          component: () => import("../pages/community-pages/PostDetails.vue"),
        },
      ],
    },
    {
      path: "/mypage",
      component: LayoutMyPage,
      children: [
        {
          path: "profile",
          name: "profile",
          component: () => import("../pages/my-pages/Profile.vue"),
        },
      ],
    },
  ],
});

export default router;
