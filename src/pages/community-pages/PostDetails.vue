<script setup>
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";
import dateConverter from "../../utils/dateConveter";
import Button from "@/components/common/Button.vue";
import { Icon } from "@iconify/vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { register } from "swiper/element/bundle";
import { deletePost, getPostById } from "@/api/api-community/api";
import { getUserById } from "@/api/api-user/api";
import { useAuthStore } from "@/store/authStore";
import router from "@/router";

import {
  fetchImagesFromSupabase,
  deleteImagesFromFolder,
} from "@/api/api-community/imgsApi";
import MeatballsMenu from "@/components/common/MeatballsMenu.vue";
import { useLoadingStore } from "@/store/loadingStore";
import Comment from "./Comment.vue";
import LikesCounter from "@/components/common/LikesCounter.vue";
import { useModalStore } from "@/store/modalStore";
import { useFollowStore } from "@/store/followStore";
import ScrollTopButton from "@/components/common/ScrollTopButton.vue";

const modalStore = useModalStore();
const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const route = useRoute();

const postId = ref("");
const post = ref(null);
const author = ref(null);
const postImgs = ref({});
const category = ref("");

const loadingStore = useLoadingStore();
const isLoading = computed(() => loadingStore.isLoading); // 로딩 상태 참조

const followStore = useFollowStore();

const fetchPostItem = async (postId) => {
  if (postId) {
    const fetchedPost = await getPostById(postId);
    post.value = fetchedPost || {};
  }
};

const fetchAuthor = async (userId) => {
  if (!userId) return;
  const fetchedUser = await getUserById(userId);
  author.value = fetchedUser[0] || {};
};

const fetchDeletePost = async (postId) => {
  modalStore.addModal({
    title: "알림",
    content: "정말 게시물을 삭제하시겠습니까?",
    btnText: "삭제",
    isOneBtn: false,
    onClick: async () => {
      modalStore.modals = [];
      if (postId) {
        await deletePost(postId);
        await deleteImagesFromFolder(postId);
        router.push({ name: "communityBoard" });
      }
    },
  });
};

const fetchImg = async (postId) => {
  if (postId) {
    const res = await fetchImagesFromSupabase(postId);
    postImgs.value = res;
  }
};

const fetchAllData = async () => {
  if (!postId.value) return;

  try {
    loadingStore.startLoading();

    // post 데이터를 먼저 가져옴
    await fetchPostItem(postId.value);

    // post.value가 갱신될 때까지 기다린 후 확인
    if (post.value?.author_id) {
      await fetchAuthor(post.value.author_id);
    }

    await Promise.all([
      fetchImg(postId.value),
      followStore.fetchLoggedInUserFollowing(authStore.profile?.id),
    ]);
  } catch (error) {
    console.error("❌ Error during data fetch:", error);
  } finally {
    loadingStore.stopLoading();
  }
};

const onfollowButtonClick = async (followed_user) => {
  if (!isLoggedIn.value) {
    modalStore.addModal({
      title: "",
      content: "로그인 후 이용해주세요.",
      btnText: "로그인",
      isOneBtn: false,
      onClick: () => {
        modalStore.modals = []; // 모든 모달 닫기
        router.push({ name: "login" });
      },
    });
  } else {
    await followStore.toggleFollow(authStore.profile.id, followed_user);
  }
};

const onRedirectButtonClick = () => {
  router.push({ name: "communityBoard" });
};

postId.value = route.params.postId;

watch(
  () => route.params.postId,
  (newPostId) => {
    postId.value = newPostId;
    fetchAllData();
  }
);
const shareKakao = () => {
  if (!window.Kakao) {
    return;
  }

  const shareUrl = `${import.meta.env.VITE_PUBLIC_URL}/${
    route.params.boardType
  }/${route.params.postId}`;

  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: post.value.title,
      description: post.value.content.substring(0, 50) + "...", // 미리보기 내용 50자 제한
      imageUrl: postImgs.value[0] || imgPlaceholder,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    buttons: [
      {
        title: "게시글 보기",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  });
};
onMounted(() => {
  postId.value = route.params.postId;
  category.value = route.params.boardType;
  fetchAllData();
});
onMounted(() => {
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
  }
});
const menuItems = computed(() => [
  {
    label: "게시글 수정",
    icon: "material-symbols:edit-square-outline-rounded",
    link: `/${category.value}/${post.value.id}/update-post`,
    color: "#757575",
  },
  {
    label: "게시글 삭제",
    icon: "mdi:delete",
    action: () => fetchDeletePost(post.value.id),
    color: "#ed4848",
  },
]);

register();
</script>

<template>
  <div v-if="!isLoading && post">
    <div class="flex items-center justify-between px-4 mb-3 md:px-0">
      <RouterLink :to="`/mypage/profile/${author?.id}`">
        <div class="flex items-center gap-[10px]">
          <img
            :src="author?.profile_url || imgPlaceholder"
            alt="작성자 프로필 사진입니다."
            class="w-[40px] h-[40px] rounded-full object-cover"
          />
          <p class="font-bold text-hc-dark-blue">{{ author?.username }}</p>
        </div>
      </RouterLink>
      <div v-if="isLoggedIn">
        <Button
          v-if="author?.id !== authStore.profile.id"
          class-name="w-[80px] h-[35px] text-xs px-[6px] py-2 md:w-[100px] md:h-[40px] md:text-[14px] lg:w-[128px] lg:h-[45px] lg:text-base rounded-[20px]"
          @click="onfollowButtonClick(author)"
          :variant="
            followStore.isUserFollowed(author?.id) ? 'regular' : 'filled'
          "
        >
          {{ followStore.isUserFollowed(author?.id) ? "팔로잉" : "팔로우" }}
        </Button>
        <div v-if="author?.id === authStore.profile.id">
          <MeatballsMenu :menuItems="menuItems" />
        </div>
      </div>

      <div v-if="!isLoggedIn">
        <Button
          variant="regular"
          size="md"
          class-name="w-[60px] h-[35px] text-xs px-[6px] py-2 md:w-[80px] md:h-[40px] md:text-[14px] lg:w-[128px] lg:h-[45px] lg:text-base"
          @click="onfollowButtonClick"
        >
          팔로잉
        </Button>
      </div>
    </div>

    <div>
      <swiper-container
        navigation="true"
        initial-slide="0"
        pagination="true"
        centered-slides="true"
        slides-per-view="1"
        speed="450"
      >
        <swiper-slide
          v-for="(postImg, index) in postImgs"
          :key="index"
          class="md:rounded-[20px] bg-hc-white/50 overflow-hidden"
        >
          <div
            class="flex items-center justify-center w-full h-full aspect-square"
          >
            <img
              class="object-contain max-w-full max-h-full w-full h-full rounded-[20px]"
              :src="postImg"
              alt="Post Image"
            />
          </div>
        </swiper-slide>
      </swiper-container>
      <div class="mb-6">
        <div
          class="mt-[30px] px-4 sm:px-0 dark:text-hc-white transition-colors duration-300"
        >
          <div class="flex items-center">
            <h1 class="w-11/12 font-semibold xm:text-xl sm:text-2xl sm:px-3">
              {{ post.title }}
            </h1>
            <div class="flex justify-end w-1/12 px-0">
              <LikesCounter
                :postId="postId || null"
                :authorId="post.author_id"
              />
            </div>
          </div>

          <div class="flex items-start mt-2">
            <p
              class="w-11/12 text-lg break-words whitespace-pre-line sm:text-xl sm:px-3"
            >
              {{ post.content }}
            </p>
            <div class="flex justify-end w-1/12 px-0">
              <Icon
                class="transition-colors duration-300 cursor-pointer text-hc-blue dark:text-hc-dark-blue"
                icon="mdi:share-variant"
                width="35"
                height="35"
                @click="shareKakao"
              />
            </div>
          </div>

          <p class="mt-2 text-sm text-gray-500 sm:px-3">
            {{ dateConverter(post.created_at) }}
          </p>
        </div>
      </div>

      <div
        class="h-[1px] border-b-[1px] w-full border-hc-blue dark:border-hc-blue"
      ></div>

      <div class="flex flex-col">
        <Comment :postId="postId" :authorId="post.author_id" />
      </div>
    </div>
    <div class="flex justify-end pt-5">
      <Button
        variant="regular"
        class-name="w-[100px] h-[30px] rounded-[20px]"
        @click="onRedirectButtonClick"
      >
        목록으로
      </Button>
    </div>
    <ScrollTopButton bottom="-20px" />
  </div>
</template>

<style scoped>
.object-cover {
  object-fit: cover;
}
</style>
