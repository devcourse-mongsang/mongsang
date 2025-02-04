<script setup>
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";
import imgPlaceholderDark from "../../../public/assets/imgs/img_placeholder_dark.png";
import { getPostByCategory } from "@/api/api-community/api";
import dateConverter from "@/utils/dateConveter";

import "@mdi/font/css/materialdesignicons.css";

import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";

import supabase from "@/config/supabase";
import { getUserById } from "@/api/api-user/api";
import { fetchImagesFromSupabase } from "@/api/api-community/imgsApi";
import { useLoadingStore } from "@/store/loadingStore";
import SkeletonUi from "@/components/community/SkeletonUi.vue";
import DropDownPostList from "@/components/community/DropDownPostList.vue";
import { usePostsStore } from "@/store/dropDownSortStore";
import { getPostLike } from "@/api/api-like/api";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import router from "@/router";
import ScrollTopButton from "@/components/common/ScrollTopButton.vue";

// 페이지네이션
const page = ref(1);
const itemPerPage = ref(6);
const paginationedPosts = computed(() => {
  const start = (page.value - 1) * itemPerPage.value;
  const end = start + itemPerPage.value;
  return filteredAndSortedPosts.value.slice(start, end);
});

const route = useRoute();
const selectedCategory = ref(route.params.boardType);
const modalStore = useModalStore();

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

const currentBoard = ref(
  boards[selectedCategory.value] || { title: "게시판 없음" }
);
const posts = ref([]);

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const authorCache = ref({});
const postImgs = ref({});

const loadingStore = useLoadingStore();
const isLoading = computed(() => loadingStore.isLoading);

const postsStore = usePostsStore();
const sortedPosts = computed(() => postsStore.sortedPosts(postsStore.sortKey));

const searchQuery = ref("");

const filteredAndSortedPosts = computed(() => {
  const filtered = searchQuery.value.trim()
    ? sortedPosts.value.filter((post) =>
        [post.title, post.content].some((field) =>
          field.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      )
    : sortedPosts.value;
  return filtered;
});

const fetchPosts = async () => {
  loadingStore.startLoading();
  try {
    const fetchedPosts = await getPostByCategory(
      selectedCategory.value,
      supabase
    );
    postsStore.setPosts([...fetchedPosts]);
    posts.value = fetchedPosts || [];
    await postsStore.fetchLikesForPosts();

    for (let post of posts.value) {
      if (!authorCache.value[post.author_id]) {
        const user = await getUserById(post.author_id);
        authorCache.value[post.author_id] = user[0] || {};
      }
      if (!postImgs.value[post.id]) {
        const imgUrl = await fetchImagesFromSupabase(post.id);
        postImgs.value[post.id] = imgUrl[0] || {};
      }
    }
  } catch (error) {
    console.error("게시글을 불러오는 중 오류가 발생했습니다:", error);
    posts.value = [];
  } finally {
    loadingStore.stopLoading();
  }
};

const onIsLoggedout = () => {
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
};

watch(
  () => route.params.boardType,
  async (newBoardType) => {
    if (selectedCategory.value !== newBoardType) {
      selectedCategory.value = newBoardType;
      currentBoard.value = boards[newBoardType] || { title: "게시판 없음" };
      await fetchPosts();
    }
  },
  { immediate: true }
);

onMounted(fetchPosts);
</script>

<template>
  <div>
    <!-- 헤더 -->
    <div
      class="flex justify-between h-[46px] items-start mb-[18px] mx-4 sm:mx-0"
    >
      <h1
        class="text-2xl font-semibold transition-colors duration-300 dark:text-hc-white"
      >
        {{ currentBoard.title }}
      </h1>
      <DropDownPostList />
    </div>
    <div
      class="h-[1px] w-full mb-[27px] bg-hc-blue sm:hidden dark:bg-hc-dark-blue"
    ></div>

    <!-- 검색창 -->
    <div class="flex justify-center mx-4 mb-[35px]">
      <div
        class="w-full bg-hc-white h-[45px] rounded-[20px] flex items-center px-4"
      >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="게시물 검색"
          class="w-full h-full px-4 outline-none"
        />
        <Icon icon="ic:round-search" width="24" height="24" />
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex items-center justify-center h-40">
      <SkeletonUi />
    </div>

    <!-- 게시글 리스트 -->
    <ul v-else-if="paginationedPosts.length">
      <li v-for="post in paginationedPosts" :key="post.id">
        <RouterLink :to="`/${route.params.boardType}/${post.id}`" class="mb-7">
          <div class="flex items-center justify-between mx-4 mb-7">
            <div class="flex flex-col gap-6 sm:gap-7">
              <span class="flex items-center gap-[10px]">
                <img
                  class="aspect-square w-[30px] xm:w-[30px] sm:w-[50px] rounded-full object-cover"
                  :src="
                    authorCache[post.author_id]?.profile_url || imgPlaceholder
                  "
                  alt="User profile image"
                />
                <p
                  class="font-semibold transition-colors duration-300 lg:text-xl dark:text-hc-white"
                >
                  {{ authorCache[post.author_id]?.username || "@anonymous" }}
                </p>
              </span>
              <span
                class="flex flex-col transition-colors duration-300 dark:text-hc-white"
              >
                <h2 class="font-semibold sm:text-xl lg:text-2xl">
                  {{ post.title }}
                </h2>
                <p class="text-hc-gray xm:text-xs sm:text-base">
                  {{ dateConverter(post.created_at) }}
                </p>
              </span>
            </div>
            <img
              class="sm:w-[180px] sm:h-[180px] w-[100px] h-[100px] rounded-[20px] object-cover dark:hidden block"
              :src="
                Object.keys(postImgs[post.id] || {}).length === 0
                  ? imgPlaceholder
                  : postImgs[post.id]
              "
              alt="Post image"
            />
            <img
              class="sm:w-[180px] sm:h-[180px] w-[100px] h-[100px] rounded-[20px] object-cover hidden dark:block"
              :src="
                Object.keys(postImgs[post.id] || {}).length === 0
                  ? imgPlaceholderDark
                  : postImgs[post.id]
              "
              alt="Post image"
            />
          </div>

          <div class="sm:px-4">
            <div
              class="h-[1px] w-full mb-[27px] bg-hc-blue dark:bg-hc-dark-blue"
            ></div>
          </div>
        </RouterLink>
      </li>
    </ul>

    <!-- 게시글 없음 메시지 -->
    <div v-else class="flex justify-center py-10 h-[500px] items-center">
      <p class="text-lg transition-colors duration-300 dark:text-hc-white">
        아직 게시글이 없습니다.
      </p>
    </div>
    <!-- 글 작성 버튼 -->

    <RouterLink
      v-show="isLoggedIn"
      :to="`/${route.params.boardType}/create-post`"
    >
      <div
        class="fixed bottom-[-30px] right-[-40px] z-30 m-[80px] bg-hc-white dark:bg-hc-dark-blue transition-colors duration-300 aspect-square w-[3rem] flex justify-center items-center rounded-full hover:scale-105 shadow-lg ease-in-out"
      >
        <Icon
          icon="material-symbols:edit-outline"
          width="24px"
          height="24px"
          class="text-hc-blue dark:text-hc-white"
        />
      </div>
    </RouterLink>

    <div
      v-show="!isLoggedIn"
      class="fixed bottom-[-30px] right-[-40px] z-30 m-[80px] bg-hc-white dark:bg-hc-dark-blue transition-colors duration-300 aspect-square w-[3rem] flex justify-center items-center rounded-full hover:scale-105 shadow-lg ease-in-out"
      @click="onIsLoggedout"
    >
      <Icon
        icon="material-symbols:edit-outline"
        width="24px"
        height="24px"
        class="text-hc-blue dark:text-hc-white"
      />
    </div>
    <div class="text-xs-center" v-if="!isLoading">
      <v-pagination
        v-model="page"
        :length="Math.ceil(filteredAndSortedPosts.length / itemPerPage)"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </div>

    <ScrollTopButton bottom="50px" right="-40px" />
  </div>
</template>

<style scoped>
input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.object-cover {
  object-fit: cover;
}
</style>
