<script setup>
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";
import dateConverter from "../../utils/dateConveter";
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";

import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { register } from "swiper/element/bundle";
import { Icon } from "@iconify/vue";
import { deletePost, getPostById } from "@/api/api-community/api";
import { getUserById } from "@/api/api-user/api";
import { useAuthStore } from "@/store/authStore";
import router from "@/router";
import {
  fetchImagesFromSupabase,
  deleteImagesFromFolder,
} from "@/api/api-community/imgsApi";

const authStore = useAuthStore();

// const user = {
//   id: "123e4567-e89b-12d3-a456-426614174001",
//   username: "dreamer02",
//   profile_bio: "마라탕 좋아",
//   profile_url: "",
//   created_at: "2025-01-17T09:00:00Z",
//   updated_at: "2025-01-17T09:30:00Z",
//   time_stamp: "2025-01-17T09:45:00Z",
// };

const comments = [
  {
    id: "1e6e4f6c-9e90-4e54-a3f5-8e0d490e91f1",
    author_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    post_id: "6b8b4567-5f1e-41b1-b3dd-6bfcd045f201",
    content: "첫 번째 댓글입니다.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2a7e1b92-8e10-4b0d-8e8e-ff3d19d001cc",
    author_id: "4e7d03f2-85f4-43c7-b937-62f8c5b84ef9",
    post_id: "8f14e45f-e8b6-44a9-a5c2-2c12d36b5cc5",
    content: "두 번째 댓글입니다.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3b9e6cda-6f81-4e0d-9f3b-d26f5e92c501",
    author_id: "5d8a74d8-86e7-4edb-8ebd-79e8d0be2f8e",
    post_id: "c9f0f895-5aef-472b-938c-0c0d8e22f001",
    content: "세 번째 댓글입니다.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4c0f65e3-7b92-4a8f-9d93-edfc6c97f403",
    author_id: "6f9b03d2-98f3-42e8-b9eb-8e18d4f8c4ed",
    post_id: "45c48cce-4ad1-4f3b-8191-55d151682501",
    content: "네 번째 댓글입니다.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5d1f85f4-8b03-498f-81e3-dfbd5c5ef901",
    author_id: "7g0c21f3-a9f3-4f7b-b9ec-9e19d5f9c5ef",
    post_id: "6512bd43-1f98-491a-a5bc-406aa2eb5023",
    content: "다섯 번째 댓글입니다.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const postId = ref("");
const post = ref(null);
const author = ref(null);
const route = useRoute();
const postImgs = ref({});

const fetchPostItem = async (postId) => {
  if (postId) {
    try {
      const fetchedPost = await getPostById(postId);
      post.value = fetchedPost || {};
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }
};

const fetchAuthor = async (userId) => {
  if (userId) {
    try {
      const fetchedUser = await getUserById(userId);
      author.value = fetchedUser[0] || {};
      console.log(author.value);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
};

const fetchDeletePost = async (postId) => {
  if (postId) {
    try {
      const res = await deletePost(postId);
      await deleteImagesFromFolder(postId);
      console.log("포스트 삭제 성공!", res);
      router.push({ name: "communityBoard" });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
};

const fetchImg = async (postId) => {
  if (postId) {
    try {
      const res = await fetchImagesFromSupabase(postId);
      // Public URL만 추출하여 postImgs에 저장
      postImgs.value = res;
      console.log("Fetched image URLs:", postImgs.value);
    } catch (error) {
      console.error("Error fetching img:", error);
    }
  }
};

postId.value = route.params.postId;

const category = ref(route.params.boardType);

watch(
  () => route.params.postId,
  (newPostId) => {
    postId.value = newPostId;
    fetchPostItem(newPostId);
  }
);

onMounted(async () => {
  postId.value = route.params.postId; // 라우트 파라미터에서 postId 설정
  if (postId.value) {
    try {
      await fetchPostItem(postId.value);
      await fetchImg(postId.value);
      if (post.value.author_id) {
        await fetchAuthor(post.value.author_id);
      }
    } catch (error) {
      console.error("Error during initial data fetch:", error);
    }
  }
});

register();
</script>
<template>
  <div v-if="post">
    <div class="flex items-center justify-between mb-3 xm:px-4 md:px-0">
      <div class="flex items-center gap-[10px]">
        <img
          :src="author.profile_url || imgPlaceholder"
          alt="작성자 프로필 사진입니다."
          class="w-[45px] h-[45px] rounded-full"
        />

        <p class="text-base font-semibold">@{{ author.username }}</p>
      </div>

      <Button
        v-if="author.id !== authStore.profile.id"
        variant="regular"
        size="md"
        class-name="w-[60px] h-[35px] text-xs px-[6px] py-2 md:w-[80px] md:h-[40px] md:text-[14px] lg:w-[128px] lg:h-[45px] lg:text-base"
        >팔로잉</Button
      >

      <div class="flex gap-2" v-if="author.id === authStore.profile.id">
        <RouterLink :to="`/${category}/${post.id}/update-post`">
          <Icon
            icon="material-symbols:edit-square-outline-rounded"
            class="cursor-pointer"
            width="24"
            height="24"
            color="#757575"
          />
        </RouterLink>
        <Icon
          @click="fetchDeletePost(post.id)"
          icon="ic:round-delete"
          class="cursor-pointer"
          width="24"
          height="24"
          color="#ed4848"
        />
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
        <!-- Swiper 슬라이드: 이미지 렌더링 -->
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
            <Icon
              class="cursor-pointer"
              icon="stash:heart-light"
              width="35"
              height="35"
              style="color: #729ecb"
            />
          </div>
          <p>{{ dateConverter(post.created_at) }}</p>
          <p class="hidden pt-6 text-xl sm:flex">{{ post.content }}</p>
        </div>
        <div class="px-4 pt-6 mb-10 sm:hidden">
          {{ post.content }}
        </div>
      </div>

      <div>
        <div class="h-[1px] w-full bg-hc-blue mb-[10px]"></div>
        <!-- 댓글 입력창 -->
        <div class="flex gap-[10px] items-center w-full xm:px-4 sm:px-[0px]">
          <img
            :src="authStore.profile.profile_url || imgPlaceholder"
            alt=""
            class="w-[45px] h-[45px] rounded-full"
          />
          <div class="flex items-center w-full gap-[11px]">
            <div class="w-full">
              <Input
                variant="custom"
                size="md"
                borderRadius="md"
                placeholder="댓글을 입력해주세요."
                class-name="flex w-full"
              />
            </div>
            <Icon icon="material-symbols:send-rounded" width="24" height="24" />
          </div>
        </div>
        <!-- 댓글 목록 -->
        <div class="mt-[29px] xm:mx-4 sm:mx-[0px]">
          <ul class="flex flex-col gap-[26px]">
            <!-- <li
              v-for="comment in comments"
              :key="comment.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-[10px]">
                <img
                  :src="user.profile_url || imgPlaceholder"
                  alt=""
                  class="w-[50px] h-[50px] rounded-full"
                />
                <div>
                  <p class="font-semibold">@{{ user.username }}</p>
                  <p>{{ comment.content }}</p>
                </div>
              </div>
              <p class="right-0 text-hc-gray">
                {{ dateConverter(comment.created_at) }}
              </p>
            </li> -->
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>
<style scoped></style>
