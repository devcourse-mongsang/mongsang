<script setup>
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";
import { getPostByCategory } from "@/api/api-community/api";
import DropDown from "../../components/common/DropDown.vue";
import dateConverter from "@/utils/dateConveter";

import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";

import supabase from "@/config/supabase";

// 라우트 정보 및 상태 관리 변수
const route = useRoute();
const selectedCategory = ref(route.params.boardType);

const boards = {
  "free-board": { title: "자유게시판" },
  "surreal-dream": { title: "초현실몽" },
  "prophetic-dream": { title: "예지몽" },
  "recurrent-dream": { title: "반복몽" },
  "lucid-dream": { title: "자각몽" },
  nightmare: { title: "악몽" },
  "good-dream": { title: "길몽" },
  "dream-interpretation": { title: "해몽" },
};

const currentBoard = ref(boards[selectedCategory.value] || { title: "게시판 없음" });
const posts = ref([]);
const isLoading = ref(false); // 로딩 상태 변수
const menuItems = [
  { title: "인기순" },
  { title: "최신순" },
  { title: "작성순" },
];

// 게시글 데이터를 가져오는 함수
const fetchPosts = async () => {
  isLoading.value = true; // 로딩 시작
  try {
    const fetchedPosts = await getPostByCategory(selectedCategory.value, supabase);
    posts.value = fetchedPosts || [];
  } catch (error) {
    console.error("게시글을 불러오는 중 오류가 발생했습니다:", error);
    posts.value = [];
  } finally {
    isLoading.value = false; // 로딩 종료
  }
};

// 라우트 변경 감지 및 처리
watch(
  () => route.params.boardType,
  async (newBoardType) => {
    selectedCategory.value = newBoardType;
    currentBoard.value = boards[newBoardType] || { title: "게시판 없음" };
    await fetchPosts();
  },
  { immediate: true }
);

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(fetchPosts);
</script>

<template>
  <div>
    <!-- 헤더 -->
    <div class="flex justify-between h-[46px] items-start mb-[18px] mx-4 sm:mx-0">
      <h1 class="text-4xl font-semibold">{{ currentBoard.title }}</h1>
      <DropDown :items="menuItems" buttonText="인기순" />
    </div>
    <div class="h-[1px] w-full mb-[27px] bg-hc-blue sm:hidden"></div>

    <!-- 검색창 -->
    <div class="flex justify-center mx-4">
      <div class="w-full bg-hc-white h-[45px] rounded-[20px] mb-[35px]"></div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex items-center justify-center h-40">
      <p class="text-lg font-semibold text-gray-500">게시글을 불러오는 중...</p>
    </div>

    <!-- 게시글 리스트 -->
    <ul v-else-if="posts.length">
      <li v-for="post in posts" :key="post.id">
        <RouterLink :to="`/${route.params.boardType}/${post.id}`" class="mb-7">
          <div class="flex items-center justify-between mx-4 mb-7">
            <div class="flex flex-col sm:gap-7 xm:gap-6">
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

    <!-- 게시글 없음 메시지 -->
    <p v-else>게시글이 없습니다.</p>

    <!-- 글 작성 버튼 -->
    <RouterLink :to="`/${route.params.boardType}/create-post`">
      <v-fab
        icon="$mdi-plus"
        class="fixed scale-[110%] bottom-0 right-0 z-30 m-[80px]"
      >
        <Icon
          icon="material-symbols:edit-outline"
          width="1.5rem"
          height="1.5rem"
          style="color: #729ecb"
        />
      </v-fab>
    </RouterLink>
  </div>
</template>

<style scoped></style>
