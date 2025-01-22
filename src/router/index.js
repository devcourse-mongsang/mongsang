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
      ],
    },
    {
      path: "/community",
      component: LayoutCommunity,
      children: [
        {
          path: "/community/:boardType",
          name: "communityBoard",
          component: () =>
            import("../pages/community-pages/CommunityBoard.vue"),
        },
        {
          path: "/:boardType/:postId",
          name: "postDetail",
          component: () => import("../pages/community-pages/PostDetails.vue"),
        },
        {
          path: "/:boardType/:postId/update-post",
          name: "updatePost",
          component: () => import("../pages/community-pages/UpdatePost.vue"),
        },
        {
          path: "/:boardType/create-post",
          name: "createPost",
          component: () => import("../pages/community-pages/CreatePost.vue"),
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
        {
          path: "profile/edit",
          name: "profileEdit",
          component: () => import("../pages/my-pages/ProfileEdit.vue"),
        },
        {
          path: "/username/follow", // 임시 경로
          name: "follow",
          component: () => import("../pages/Follow.vue"),
        },
        {
          path: "/diary",
          name: "diary",
          component: () => import("../pages/diary-pages/Diary.vue"),
        },
        {
          path: "/diary/details", // 임시 경로
          name: "diaryDetail",
          component: () => import("../pages/diary-pages/DiaryDetails.vue"),
        },
        // {
        //   path: "/diary/:postId",
        //   name: "diaryDetail",
        //   component: () => import("../pages/Diary.vue"),
        // },
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
