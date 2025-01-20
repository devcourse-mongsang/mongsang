<script setup>
import { ref, watch } from "vue";
import DropDown from "../../components/common/DropDown.vue";
import { useRoute } from "vue-router";
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";
import boardData from "../../mock-db/boardData.json";
import dateConverter from "@/utils/dateConveter";

const route = useRoute();

const currentBoard = ref(
  boardData[route.params.boardType] || {
    title: "게시판 없음",
  }
);

watch(
  () => route.params.boardType,
  (newBoardType) => {
    currentBoard.value = boardData[newBoardType] || {
      title: "게시판 없음",
    };
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div
      class="flex justify-between h-[46px] items-start mb-[18px] mx-4 sm:mx-[0px]"
    >
      <h1 class="text-4xl font-semibold">{{ currentBoard.title }}</h1>
      <DropDown />
    </div>
    <div class="h-[1px] w-full mb-[27px] bg-hc-blue sm:hidden"></div>
    <div class="flex justify-center mx-4">
      <div class="w-full bg-hc-white h-[45px] rounded-[20px] mb-[35px]"></div>
    </div>

    <!-- 게시글 목록 -->
    <ul v-if="currentBoard.posts && currentBoard.posts.length">
      <li v-for="post in currentBoard.posts" :key="post.id">
        <RouterLink :to="`/${route.params.boardType}/${post.id}`" class="mb-7">
          <div class="flex justify-between mx-4 mb-7">
            <div class="flex flex-col mt-6 gap-7">
              <span class="flex items-center gap-[10px]">
                <img
                  class="h-[50px] w-[50px] rounded-full"
                  :src="post.profile_img || imgPlaceholder"
                  alt="User profile image"
                />
                <p class="font-semibold lg:text-xl">{{ post.userName }}</p>
              </span>
              <span class="flex flex-col">
                <h2 class="text-xl font-semibold lg:text-2xl">
                  {{ post.title }}
                </h2>
                <p class="text-[#757575]">
                  {{ dateConverter(post.created_at) }}
                </p>
              </span>
            </div>
            <img
              class="w-[180px] h-[180px] rounded-[20px]"
              :src="post.img_url || imgPlaceholder"
              alt="Post image"
            />
          </div>
          <div class="sm:px-4">
            <div class="h-[1px] w-full mb-[27px] bg-hc-blue"></div>
          </div>
        </RouterLink>
      </li>
    </ul>
    <p v-else>게시글이 없습니다.</p>
  </div>
</template>

<style scoped></style>
