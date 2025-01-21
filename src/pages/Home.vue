<script setup>
import Button from "@/components/common/Button.vue";

import CoverflowSwiper from "@/components/common/CoverflowSwiper.vue";
import { ref } from "vue";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const popularPosts = ref([
  {
    image:
      "https://cdn.pixabay.com/photo/2023/12/30/21/14/fields-8478994_1280.jpg",
    title: "TITLE 1",
    name: "name 1",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2023/12/30/21/14/fields-8478994_1280.jpg",
    title: "TITLE 2",
    name: "name 2",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2023/12/30/21/14/fields-8478994_1280.jpg",
    title: "TITLE 3",
    name: "name 3",
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2023/12/30/21/14/fields-8478994_1280.jpg",
    title: "TITLE 4",
    name: "name 4",
  },
]);
</script>

<template>
  <div v-if="loading">로딩 중...</div>
  <div v-else-if="authStore.isLoggedIn && authStore.profile">
    {{ authStore.profile.username }}님
  </div>
  <div v-else>로그인해주세요.</div>

  <div
    class="flex flex-col items-center w-full py-8 sm:py-12 lg:py-16 px-4 md:px-[40px] lg:px-[120px] mb-[202px] mt-[30px]"
  >
    <!-- 로고 -->
    <div class="flex justify-center w-2/3 max-w-lg">
      <img
        class="sm:w-full xm:w-[231px]"
        src="../../public/assets/imgs/big_logo.png"
        alt="로고 이미지입니다."
      />
    </div>

    <!-- 소개 섹션 -->
    <div class="flex flex-col items-center mt-8 space-y-4 text-center">
      <h1 class="font-semibold sm:text-[24px] md:text-[32px] text-base">
        꿈을 기록하는 몽상가가 되어보세요
      </h1>
      <div class="hidden mt-[10px] mb-6 text-xl md:flex md:flex-col">
        <h2>
          꿈에 담긴 감정을 AI로 시각화하고 분석된 심리 상태에 맞는 ASMR로 마음을
          어루만지세요.
        </h2>
        <h2>
          몽상가가 되어 당신의 꿈을 세상과 나누는 특별한 경험을 시작하세요.
        </h2>
      </div>
      <RouterLink to="/record"
        ><Button
          variant="shadowed"
          size="lg"
          class-name="sm:w-[336px] sm:mt-[40px] md:mt-0 hover:scale-[105%] xm:w-[192px] xm:text-[14px] sm:text-2xl xm:h-[47px] sm:h-[63px]"
        >
          꿈 기록하러 가기
        </Button></RouterLink
      >
    </div>

    <div class="max-w-[1300px] w-full">
      <CoverflowSwiper />
    </div>

    <!-- AI 추천 ASMR -->
    <div
      class="max-w-[1141px] px-4 md:px-8 lg:px-11 py-8 mt-20 bg-[rgba(255,255,255,0.3)] border-[7px] border-[rgba(255,255,255,0.5)] rounded-[20px]"
    >
      <h3 class="mb-8 text-2xl font-semibold">
        당신의 꿈에 귀 기울이는 순간, ASMR 추천
      </h3>
      <ul
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
      >
        <li v-for="(item, index) in popularPosts" :key="index">
          <div class="">
            <img
              class="object-cover w-full max-h-[300px] rounded-[20px]"
              :src="item.image"
              :alt="`${item.title} 이미지입니다.`"
            />
            <div class="text-start">
              <h4 class="text-lg font-semibold">{{ item.title }}</h4>
              <p class="text-sm text-gray-600">{{ item.name }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* 공통된 스타일을 간결화 */
h1,
h2,
h3 {
  color: #333;
}

/* img {
  transition: transform 0.3s ease;
} */

/* img:hover {
  transform: scale(1.05);
} */
</style>
