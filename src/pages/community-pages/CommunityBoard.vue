<script setup>
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
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

const menuItems = [
  { title: "인기순" },
  { title: "최신순" },
  { title: "작성순" },
];
</script>

<template>
  <div>
    <div
      class="flex justify-between h-[46px] items-start mb-[18px] mx-4 sm:mx-[0px]"
    >
      <h1 class="text-4xl font-semibold">{{ currentBoard.title }}</h1>
      <DropDown :items="menuItems" buttonText="인기순" />
    </div>
    <div class="h-[1px] w-full mb-[27px] bg-hc-blue sm:hidden"></div>
    <div class="flex justify-center mx-4">
      <div class="w-full bg-hc-white h-[45px] rounded-[20px] mb-[35px]"></div>
    </div>

    <ul v-if="currentBoard.posts && currentBoard.posts.length">
      <li v-for="post in currentBoard.posts" :key="post.id">
        <RouterLink :to="`/${route.params.boardType}/${post.id}`" class="mb-7">
          <div class="flex items-center justify-between mx-4 mb-7">
            <div class="flex flex-col xm:mt-0 sm:mt-6 sm:gap-7 xm:gap-6">
              <span class="flex items-center gap-[10px]">
                <img
                  class="aspect-square xm:w-[30px] sm:w-[50px] rounded-full"
                  :src="post.profile_img || imgPlaceholder"
                  alt="User profile image"
                />
                <p class="font-semibold lg:text-xl">
                  {{ post.userName || "@anonymous" }}
                </p>
              </span>
              <span class="flex flex-col">
                <h2 class="font-semibold sm:text-xl lg:text-2xl">
                  {{ post.title }}
                </h2>
                <p class="text-[#757575] xm:text-xs sm:text-base">
                  {{ dateConverter(post.created_at) }}
                </p>
              </span>
            </div>
            <img
              class="sm:w-[180px] sm:h-[180px] w-[100px] h-[100px] rounded-[20px]"
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

  <RouterLink :to="`/${route.params.boardType}/create-post`"
    ><v-fab
      icon="$mdi-plus"
      class="fixed scale-[110%] bottom-0 right-0 z-30 m-[80px]"
    >
      <Icon
        id="weather-icon"
        icon="material-symbols:edit-outline"
        width="1.5rem"
        height="1.5rem"
        style="color: #729ecb"
      /> </v-fab
  ></RouterLink>
</template>

<style scoped></style>
