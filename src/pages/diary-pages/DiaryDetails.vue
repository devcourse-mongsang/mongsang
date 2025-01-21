<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const diaryData = ref({
  date: "2025년 / 01월 / 20일",
  username: "@Mala_love",
  title: "나는 오늘도 마라탕을 먹으면서 버블티를 마시는 꿈을 꾼다",
  content:
    "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
  dreamAnalysis:
    "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
});

// 모달 상태 관리
const isModalOpen = ref(false);

// 모달 토글 함수
const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};
</script>

<template>
  <div class="max-w-[715px] mx-auto">
    <!-- Header Section -->
    <div class="mb-8 xm:px-4 sm:px-[0px]">
      <div class="relative w-[232px] h-[205.68px] mx-auto">
        <img
          src="/assets/imgs/diary_logo.png"
          alt="Profile"
          class="w-[216.03px] h-[205.68px] absolute right-4 top-0 object-contain"
        />
        <p
          class="absolute right-7 top-[89px] text-2xl text-justify text-black whitespace-nowrap"
        >
          <span class="font-semibold">{{ diaryData.username }}</span>
          <span> 의 꿈 일기</span>
        </p>
      </div>

      <div class="flex items-center gap-8">
        <p class="text-xl">{{ diaryData.date }}</p>

        <!-- ml-auto 추가하여 나머지 요소들을 오른쪽으로 밀기 -->
        <div class="flex items-center gap-2 justify-end ml-auto">
          <p class="text-xl xm:hidden sm:block">오늘의 기분</p>
          <Icon
            icon="mdi:emoticon-happy-outline"
            class="w-6 h-6 text-hc-blue"
          />
        </div>

        <div class="flex items-center gap-2 justify-end">
          <p class="text-xl xm:hidden sm:block">오늘의 날씨</p>
          <Icon icon="mdi:snowflake" class="w-6 h-6 text-hc-blue" />
        </div>

        <!-- 더보기 버튼과 모달 -->
        <div class="relative">
          <button class="flex items-center gap-2" @click="toggleModal">
            <Icon
              icon="mdi:dots-horizontal"
              class="w-6 h-6 text-hc-blue cursor-pointer"
            />
          </button>

          <!-- 모달 -->
          <div
            v-if="isModalOpen"
            class="absolute right-0 mt-2 w-[191px] rounded-[20px] bg-hc-white shadow-blue z-50"
          >
            <div class="py-5 px-4">
              <button
                class="w-full text-base text-center text-hc-black hover:opacity-60 mb-3"
              >
                게시글 수정
              </button>

              <hr class="border-hc-blue border-1 mb-3" />

              <button
                class="w-full text-base text-center text-hc-coral hover:opacity-70"
              >
                게시글 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 일기장 이미지 -->
    <img
      src="/assets/imgs/img_placeholder.png"
      alt="Dream"
      class="w-full h-[710px] rounded-[0px] object-cover mb-8 xm:h-auto sm:rounded-[20px]"
    />

    <!-- 꿈 일기 제목과 내용 -->
    <h2 class="text-2xl font-semibold mb-4 xm:text-xl xm:px-4 sm:px-[0px]">
      {{ diaryData.title }}
    </h2>
    <p class="text-xl text-justify mb-8 xm:text-base xm:px-4 sm:px-[0px]">
      {{ diaryData.content }}
    </p>

    <!-- 구분선 -->
    <hr class="border-hc-blue my-8" />

    <!-- 꿈 분석 -->
    <h3
      class="text-xl font-semibold text-hc-blue mb-4 xm:text-lg xm:px-4 sm:px-[0px]"
    >
      꿈 분석
    </h3>
    <p class="text-xl text-justify mb-8 xm:text-base xm:px-4 sm:px-[0px]">
      {{ diaryData.dreamAnalysis }}
    </p>

    <!-- 구분선 -->
    <hr class="border-hc-blue my-8" />

    <!-- ASMR 섹션 -->
    <h3
      class="text-xl font-semibold text-hc-blue mb-4 xm:text-lg xm:px-4 sm:px-[0px]"
    >
      ASMR
    </h3>
    <div
      class="w-full h-[508px] rounded-[20px] bg-black overflow-hidden xm:h-auto"
    >
      <img
        src="/assets/imgs/asmr.png"
        alt="ASMR"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</template>

<style scoped></style>
