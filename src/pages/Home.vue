<script setup>
import Button from "@/components/common/Button.vue";

import CoverflowSwiper from "@/components/common/CoverflowSwiper.vue";
import { ref } from "vue";
import { useAuthStore } from "@/store/authStore";
import { mdiReload } from "@mdi/js";
import ScrollTopButton from "@/components/common/ScrollTopButton.vue";
import { useModalStore } from "@/store/modalStore";
import { useRouter } from "vue-router";

const videos = ref([]);
const isLoading = ref(true); // 로딩 상태 추가
const modalStore = useModalStore();
const authStore = useAuthStore();
const router = useRouter();

const fetchASMRVideos = async () => {
  videos.value = [];
  isLoading.value = true; // 로딩 상태 시작
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const keyword = "asmr ambience";
  const maxResults = 8;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${keyword}&maxResults=${maxResults}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const randomVideos = getRandomVideos(data.items, 4);
      videos.value = randomVideos;
    } else {
      console.error("ASMR 영상이 없습니다.");
    }
  } catch (error) {
    console.error("Error fetching ASMR videos:", error);
  } finally {
    isLoading.value = false; // 로딩 상태 종료
  }
};

const getRandomVideos = (arr, n) => {
  const mixed = arr.slice(0);
  for (let i = mixed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
  }
  return mixed.slice(0, n);
};

const onRecordButtonClick = () => {
  if (!authStore.profile?.id) {
    modalStore.addModal({
      title: "로그인 필요",
      content: "로그인 후 이용해주세요.",
      btnText: "로그인",
      isOneBtn: false,
      onClick: () => {
        modalStore.modals = [];
        router.push({ name: "login" });
      },
    });
    return;
  }
  router.push({ name: "record" });
};

fetchASMRVideos();
</script>

<template>
  <div
    class="flex flex-col items-center w-full py-8 sm:py-12 lg:py-16 px-4 md:px-[40px] lg:px-[120px] mb-[202px] mt-[30px]"
  >
    <!-- 로고 -->
    <div class="flex justify-center w-2/3 max-w-lg">
      <img
        class="sm:w-full xm:w-[231px] block dark:hidden"
        src="/assets/imgs/big_logo.png"
        alt="라이트 모드 로고"
      />
      <img
        class="sm:w-full xm:w-[231px] hidden dark:block"
        src="/assets/imgs/big_logo_dark.png"
        alt="다크 모드 로고"
      />
    </div>

    <!-- 소개 섹션 -->
    <div class="flex flex-col items-center mt-8 space-y-4 text-center">
      <h1
        class="font-semibold sm:text-[24px] md:text-[32px] text-base dark:text-hc-white"
      >
        꿈을 기록하는
        <span class="text-hc-blue dark:text-hc-dark-blue">몽상가</span>가
        되어보세요
      </h1>
      <div class="hidden mt-[10px] mb-6 text-xl md:flex md:flex-col">
        <h2 class="transition-all duration-300 dark:text-hc-white">
          꿈에 담긴 감정을 AI로 시각화하고 분석된 심리 상태에 맞는 ASMR로 마음을
          어루만지세요.
        </h2>
        <h2 class="transition-all duration-300 dark:text-hc-white">
          몽상가가 되어 당신의 꿈을 세상과 나누는 특별한 경험을 시작하세요.
        </h2>
      </div>
      <div @click="onRecordButtonClick">
        <Button
          variant="shadowed"
          class-name="sm:w-[336px] sm:mt-[40px] md:mt-0 hover:scale-[105%] w-[192px] text-[14px] sm:text-2xl h-[47px] sm:h-[63px] mb-[100px] xm:mb-[0px] rounded-[20px]"
        >
          꿈 기록하러 가기
        </Button>
      </div>
    </div>

    <div class="max-w-[1300px] w-full">
      <CoverflowSwiper />
    </div>

    <!-- AI 추천 ASMR -->
    <div
      class="max-w-[1280px] px-4 md:px-8 lg:px-11 pb-8 pt-6 mt-20 bg-[rgba(255,255,255,0.3)] dark:bg-hc-beige/20 border-[7px] border-[rgba(255,255,255,0.5)] rounded-[20px] w-full"
    >
      <div class="flex items-center mb-4 gap-x-3">
        <h3
          class="font-semibold transition-all duration-300 xm:text-base sm:text-2xl dark:text-hc-white"
        >
          당신의 꿈에 귀 기울이는 순간, ASMR 추천
        </h3>
        <Button
          variant="custom"
          size="xs"
          @click="fetchASMRVideos"
          style="background-color: rgba(255, 255, 255, 0.5)"
          class="dark:text-hc-dark-blue"
        >
          <v-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path :d="mdiReload" />
            </svg> </v-icon
        ></Button>
      </div>
      <ul
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
      >
        <li v-for="index in 4" :key="'skeleton_' + index" v-if="isLoading">
          <v-skeleton-loader
            type="image"
            class="w-full max-h-[300px] object-cover"
          ></v-skeleton-loader>
        </li>
        <li v-for="video in videos" :key="video.id.videoId" v-else>
          <iframe
            :src="'https://www.youtube.com/embed/' + video.id.videoId"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full max-h-[300px] rounded-[20px] object-cover h-auto"
            style="aspect-ratio: 16 / 9"
          ></iframe>
        </li>
      </ul>
    </div>
  </div>
  <div class="flex justify-between px-4 pb-2 text-hc-white/50">
    <p>Copyright @2025 Mongsang inc. All rights reserved.</p>
    <p>v.1.0.5</p>
  </div>
  <ScrollTopButton bottom="-20px" />
</template>

<style scoped>
/* 공통된 스타일을 간결화 */
h1,
h2,
h3 {
  color: #333;
}
</style>
