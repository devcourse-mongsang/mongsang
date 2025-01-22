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
  mdiMicrophoneOff,
} from "@mdi/js";

import { ref } from "vue";
import { OpenAI } from "openai";

const value = ref("");

const rules = [(v) => v.length <= 1600 || "최대 1600자까지만 입력 가능합니다"];

const isListening = ref(false);
let speechRecognition = null;

const analysisResult = ref("");
const isAnalyzing = ref(false);
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

//음성 인식 시작
const startListening = () => {
  if (isListening.value) return; //중복 클릭 X

  if (!("webkitSpeechRecognition" in window)) {
    alert("⚠️음성 입력을 지원하지 않는 브라우저입니다.");
    return;
  }

  speechRecognition = new webkitSpeechRecognition();
  speechRecognition.lang = "ko-KR";
  speechRecognition.continuous = true;
  speechRecognition.interimResults = false;

  speechRecognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        value.value += event.results[i][0].transcript;
      }
    }
  };

  speechRecognition.onerror = (event) => {
    console.error("❌ 음성 인식 에러 발생:", event.error);
    alert("음성 인식 중 에러가 발생했습니다!");
    stopListening();
  };

  speechRecognition.onend = () => {
    isListening.value = false;
  };

  speechRecognition.start();
  isListening.value = true;
};

// 음성 입력 종료
const stopListening = () => {
  if (speechRecognition && isListening.value) {
    speechRecognition.stop();
    isListening.value = false;
  }
  console.log("📝 꿈일기 내용:", value.value);
};

//꿈 분석
const analyzeDream = async () => {
  if (!value.value.trim()) {
    alert("꿈이 입력 되지 않았습니다 😢 꿈을 입력해주세요!");
    return;
  }

  isAnalyzing.value = true; //로딩 상태

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "user",
          content: `이 꿈 내용을 분석하고 해석해줘. 대답에서 마크다운 문법(예: *, #, _)을 사용하지 말고, 순수한 텍스트로만 답변해줘. 대신 이모티콘을 넣어서 친근한 느낌을 줘.: "${value.value}"`,
        },
      ],

      max_tokens: 1000,
      temperature: 0.7,
    });

    analysisResult.value = response.choices[0].message.content;
  } catch (error) {
    console.error("❌Open AI API 호출 에러", error);
    alert("꿈 분석 중 에러가 발생했습니다 😢 다시 시도해주세요!");
  } finally {
    isAnalyzing.value = false;
  }
};
</script>
<template>
  <div class="flex h-full gap-x-[85px] overflow-hidden">
    <!-- 꿈 기록 -->
    <div
      class="ml-[70px] fixed h-full xl:w-[720px] 2xl:w-[760px] 3xl:w-[800px] md:w-[680px] sm:w-[600px] w-[648px]"
    >
      <v-textarea
        v-model="value"
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
          <!-- 음성인식 버튼-->
          <Button
            v-if="!isListening"
            variant="regular"
            class="text-hc-pink"
            size="xs"
            @click="startListening"
          >
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

          <Button
            v-else
            variant="regular"
            class="text-hc-pink"
            size="xs"
            @click="stopListening"
          >
            <v-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path :d="mdiMicrophoneOff" />
              </svg>
            </v-icon>
          </Button>

          <!-- 분석 버튼 -->
          <Button variant="regular" size="xs" @click="analyzeDream"
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

          <!-- AI 이미지 생성 버튼  -->
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

          <!-- ASMR 추천 버튼  -->
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
              "AI가 꿈을 분석하고 결과를 여기에 보여드릴게요!🌙"
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
