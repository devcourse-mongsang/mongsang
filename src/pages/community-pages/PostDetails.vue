<script setup>
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";
import dateConverter from "../../utils/dateConveter";
import Button from "@/components/common/Button.vue";

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
  if (postId) {
    await deletePost(postId);
    await deleteImagesFromFolder(postId);
    router.push({ name: "communityBoard" });
  }
};

const fetchImg = async (postId) => {
  if (postId) {
    const res = await fetchImagesFromSupabase(postId);
    postImgs.value = res;
  }
};

const fetchAllData = async () => {
  if (postId.value) {
    try {
      loadingStore.startLoading();
      await Promise.all([fetchPostItem(postId.value), fetchImg(postId.value)]);
      if (post.value.author_id) {
        await fetchAuthor(post.value.author_id);
      }
    } catch (error) {
      console.error("Error during data fetch:", error);
    } finally {
      loadingStore.stopLoading();
    }
  }
};

const onfollowButtonClick = () => {
  if (!isLoggedIn.value) {
    alert("로그인 후 사용해 주세요")
    router.push({ name: "login" });
  } else {
    console.log("팔로우 기능을 구현해주새요");
  }
};

postId.value = route.params.postId;

watch(
  () => route.params.postId,
  (newPostId) => {
    postId.value = newPostId;
    fetchAllData();
  }
);

onMounted(() => {
  postId.value = route.params.postId;
  category.value = route.params.boardType;
  fetchAllData();
});

const menuItems = computed(() => [
  {
    label: "Edit Post",
    icon: "material-symbols:edit-square-outline-rounded",
    link: `/${category.value}/${post.value.id}/update-post`,
    color: "#757575",
  },
  {
    label: "Delete Post",
    icon: "mdi:delete",
    action: () => fetchDeletePost(post.value.id),
    color: "#ed4848",
  },
]);

register();
</script>

<template>
  <div v-if="!isLoading && post">
    <div class="flex items-center justify-between mb-3 xm:px-4 md:px-0">
      <div class="flex items-center gap-[10px]">
        <img
          :src="author?.profile_url || imgPlaceholder"
          alt="작성자 프로필 사진입니다."
          class="w-[40px] h-[40px] rounded-full"
        />
        <p class="font-bold text-[#18375B]">{{ author?.username }}</p>
      </div>
      <div v-if="isLoggedIn">
        <Button
          v-if="author?.id !== authStore.profile.id"
          variant="regular"
          size="md"
          class-name="w-[60px] h-[35px] text-xs px-[6px] py-2 md:w-[80px] md:h-[40px] md:text-[14px] lg:w-[128px] lg:h-[45px] lg:text-base"
          @click="onfollowButtonClick"
        >
          팔로잉
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
        class="mySwiper"
        initial-slide="0"
        pagination="true"
        centered-slides="true"
        slides-per-view="1"
        speed="450"
      >
        <swiper-slide
          v-for="(postImg, index) in postImgs"
          :key="index"
          class="bg-hc-white/50"
        >
          <div class="flex items-center aspect-square">
            <img
              class="object-contain w-full aspect-square"
              :src="postImg"
              alt="Post Image"
            />
          </div>
        </swiper-slide>
      </swiper-container>
      <div class="mb-6">
        <div class="mt-[45px] xm:px-4 sm:px-[0px]">
          <div class="flex items-center justify-between">
            <h1 class="font-semibold xm:text-xl sm:text-2xl">
              {{ post.title }}
            </h1>
            <LikesCounter :postId="postId || null" />
          </div>
          <p>{{ dateConverter(post.created_at) }}</p>
          <p class="hidden pt-6 text-xl sm:flex">{{ post.content }}</p>
        </div>
        <div class="px-4 pt-6 mb-10 sm:hidden">
          {{ post.content }}
        </div>
      </div>
      <div class="h-[1px] w-full bg-hc-blue mb-[10px]"></div>

      <div class="flex flex-col">
        <Comment :postId="postId" />
      </div>
    </div>
  </div>
</template>
