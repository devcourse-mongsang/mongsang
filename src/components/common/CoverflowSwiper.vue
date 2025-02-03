<script setup>
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";
import { register } from "swiper/element/bundle";
import CommunityChips from "./CommunityChips.vue";
import { ref, onMounted } from "vue";
import { getPostById } from "@/api/api-community/api";
import supabase from "@/config/supabase";
import { fetchImagesFromSupabase } from "@/api/api-community/imgsApi";
import { Icon } from "@iconify/vue";
import HomeSwiperSkeletonUi from "./HomeSwiperSkeletonUi.vue";

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

const getCategoryTitle = (category) => {
  return boards[category]?.title || "카테고리 없음";
};

const topLikedPosts = ref([]);
const posts = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");

const fetchTopLikedPosts = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    const { data, error } = await supabase.from("post_likes").select("post_id");

    if (error) throw error;

    const likeCounts = data.reduce((acc, { post_id }) => {
      acc[post_id] = (acc[post_id] || 0) + 1;
      return acc;
    }, {});

    topLikedPosts.value = Object.entries(likeCounts)
      .map(([post_id, count]) => ({ post_id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    posts.value = await Promise.all(
      topLikedPosts.value.map(async (val) => {
        const post = await getPostById(val.post_id);
        post.categoryTitle = getCategoryTitle(post.category);
        post.images = await fetchImagesFromSupabase(post.id);
        post.likeCount = val.count;

        return post;
      })
    );
  } catch (err) {
    console.error("Error fetching top liked posts:", err);
    errorMessage.value = "인기 게시글을 불러오는 중 오류가 발생했습니다.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchTopLikedPosts);
register();
</script>

<template>
  <div
    class="font-semibold max-w-[1141px] mx-auto px-4 md:px-8 lg:px-11 xm:mt-[60px] sm:mt-[128px] flex flex-col gap-5"
  >
    <h2 class="transition-all duration-300 xm:text-base sm:text-2xl dark:text-hc-white">
      실시간 인기글 TOP 5
    </h2>
    <CommunityChips />
  </div>

  <div v-if="isLoading">
    <HomeSwiperSkeletonUi />
  </div>
  <div v-else-if="errorMessage">오류 발생: {{ errorMessage }}</div>
  <div v-else-if="posts.length === 0">인기글이 없습니다.</div>

  <swiper-container
    v-if="posts.length > 0"
    navigation="true"
    class="scale-75 sm:scale-90 lg:scale-100"
    initial-slide="0"
    pagination="true"
    effect="coverflow"
    grab-cursor="true"
    centered-slides="true"
    slides-per-view="auto"
    coverflow-effect-rotate="25"
    coverflow-effect-stretch="0"
    coverflow-effect-depth="300"
    coverflow-effect-modifier="1"
    coverflow-effect-slide-shadows="false"
  >
    <swiper-slide
      v-for="post in posts"
      :key="post.id"
      class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30 hover:scale-[105%] dark:bg-hc-beige/20"
    >
      <RouterLink :to="`/${post.category}/${post.id}`">
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="post.images[0] || imgPlaceholder"
          alt="Post Image"
        />
        <div class="text-xl mt-[24px] leading-tight dark:text-hc-dark-blue">
          <p class="text-base">{{ post.categoryTitle }}</p>
          <div class="flex justify-between">
            <h3 class="font-semibold dark:te">
              {{ post.title || "제목 없음" }}
            </h3>
            <div class="flex items-center gap-1 pr-2">
              <Icon
                class="cursor-pointer"
                icon="stash:heart-solid"
                width="20"
                height="20"
              />
              <p>
                {{ post.likeCount }}
              </p>
            </div>
          </div>
          <!-- 좋아요 수 표시 -->
        </div>
      </RouterLink>
    </swiper-slide>
  </swiper-container>
</template>

<style scoped>
swiper-container {
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
}

swiper-slide {
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 400px;
}

swiper-slide img {
  display: block;
}
</style>
