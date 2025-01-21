<script setup>
import Button from "@/components/common/Button.vue";
import {
  mdiMicrophoneOutline,
  mdiPaletteOutline,
  mdiEqualizer,
  mdiYoutube,
  mdiNotebookOutline,
  mdiContentCopy,
  mdiTrayArrowDown,
} from "@mdi/js";

import { ref } from "vue";

const value = ref("");
const rules = [(v) => v.length <= 1600 || "최대 1600자까지만 입력 가능합니다"];
</script>
<template>
  <div class="flex h-full gap-x-[85px] overflow-hidden">
    <!-- 꿈 기록 -->
    <div
      class="ml-[70px] fixed h-full xl:w-[720px] 2xl:w-[760px] 3xl:w-[800px] md:w-[680px] sm:w-[600px] w-[648px]"
    >
      <v-textarea
        :model-value="value"
        :rules="rules"
        variant="solo"
        auto-grow
        no-resize
        placeholder="꿈을 기록해주세요 (최대 1600자)"
        rows="28"
        counter
        rounded
        bg-color="rgba(255, 255, 255, 0.7)"
      ></v-textarea>

      <div class="flex justify-between">
        <div class="flex gap-x-[10px]">
          <Button variant="regular" class="text-hc-pink" size="xs">
            <v-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path :d="mdiMicrophoneOutline" />
              </svg>
            </v-icon>
          </Button>
          <Button variant="regular" size="xs"
            ><v-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path :d="mdiEqualizer" />
              </svg> </v-icon
          ></Button>
          <Button variant="regular" size="xs"
            ><v-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path :d="mdiPaletteOutline" />
              </svg> </v-icon
          ></Button>
          <Button variant="regular" size="xs"
            ><v-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path :d="mdiYoutube" />
              </svg> </v-icon
          ></Button>
        </div>
        <Button variant="filled" size="xs"
          ><v-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path :d="mdiNotebookOutline" />
            </svg> </v-icon
        ></Button>
      </div>
    </div>

    <div
      style="--webkit-scrollbar-width: none; scrollbar-width: none"
      class="flex flex-col w-[538px] gap-y-[50px] xl:w-[720px] xl:ml-[900px] mr-[70px] overflow-y-auto 2xl:w-[800px] 2xl:ml-[920px] 3xl:w-[840px] 3xl:ml-[960px]"
    >
      <div
        class="flex flex-col items-center w-full rounded-3xl px-[65px] relative pb-[78px] shadow-md"
        style="background-color: rgba(255, 255, 255, 0.7)"
      >
        <img
          src="/assets/imgs/big_logo.png"
          alt="Mongsang Logo"
          class="w-[108px] mb-[35px] mt-[38px]"
        />
        <!-- 분석 결과 -->
        <div class="w-full analysis">
          <h3 class="text-xl">
            {{
              analysisResult ||
              "꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!꿈을 분석했어요!"
            }}
          </h3>
        </div>

        <Button size="xs" variant="regular" class="absolute bottom-4 right-4">
          <v-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path :d="mdiContentCopy" />
            </svg>
          </v-icon>
        </Button>
      </div>

      <!-- ai 그림 생성 -->
      <div class="relative">
        <p class="mb-[10px] font-semibold">AI 그림 생성</p>

        <img
          src="/public/assets/imgs/img_placeholder.png"
          alt="AI 그림"
          class="w-full h-fit rounded-3xl"
        />

        <Button size="xs" variant="regular" class="absolute bottom-4 right-4">
          <v-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path :d="mdiTrayArrowDown" />
            </svg>
          </v-icon>
        </Button>
      </div>

      <!-- 추천 asmr -->
      <div class="mb-16">
        <p class="mb-[10px] font-semibold">추천 ASMR</p>
        <img
          src="/public/assets/imgs/youtube_thumbnail.png"
          alt="유튜브 썸네일"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
