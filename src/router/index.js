import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/authStore";
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
          path: "profile/:id",
          name: "profile",
          component: () => import("../pages/my-pages/Profile.vue"),
        },
        {
          path: "profile/edit",
          name: "profileEdit",
          component: () => import("../pages/my-pages/ProfileEdit.vue"),
        },
        {
          path: "username/follow/:id",
          name: "follow",
          component: () => import("../pages/Follow.vue"),
        },
        {
          path: "/diary/:id",
          name: "diaryDetail",
          component: () => import("../pages/diary-pages/DiaryDetails.vue"),
        },
        {
          path: "/diary/:id/update-diary",
          name: "updateDiary",
          component: () => import("../pages/diary-pages/UpdateDiary.vue"),
        },
        {
          path: "/diary",
          name: "diary",
          component: () => import("../pages/diary-pages/Diary.vue"),
        },
        {
          path: "/diary/write",
          name: "diaryWrite",
          component: () => import("../pages/diary-pages/DiaryWrite.vue"),
        },
        {
          path: "/notification",
          name: "notification",
          component: () => import("../pages/Notification.vue"),
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

// 전역 가드 추가
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 세션 복구 (앱 첫 로드 시)
  if (!authStore.isLoggedIn) {
    await authStore.restoreSession();
  }

  // 로그인 상태에서 로그인 또는 회원가입 페이지로 이동 시도 막기
  if (authStore.isLoggedIn && (to.name === "login" || to.name === "join")) {
    return next({ name: "Home" }); // 홈으로 리다이렉트
  }

  next(); // 정상 접근 허용
});
router.afterEach(() => {
  if (window.location.hash) {
    window.history.replaceState(
      null,
      document.title,
      window.location.pathname + window.location.search
    ); // URL에서 해시 제거
  }
});
export default router;
