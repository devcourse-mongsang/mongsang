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
import { ref, onMounted } from "vue";
import { OpenAI } from "openai";
import { useDiaryStore } from "@/store/diaryStore";
import { checkDiaryExists } from "@/api/api-record/api";
const diaryStore = useDiaryStore();

const isDiaryWritten = ref(false);
const today = new Date().toISOString().split("T")[0];

const rules = [(v) => v.length <= 1600 || "최대 1600자까지만 입력 가능합니다"];

const isListening = ref(false);
let speechRecognition = null;

const isAnalyzing = ref(false);
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const isGeneratingImage = ref(false);

const emotion = ref("");
const asmrVideo = ref(null);
const isFetching = ref(false);

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
        diaryStore.setContent(
          diaryStore.content + event.results[i][0].transcript
        );
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
  console.log("📝 음성 인식 내용:", diaryStore.content);
};

//꿈 분석
const analyzeDream = async () => {
  if (!diaryStore.content.trim()) {
    alert("꿈이 입력 되지 않았습니다 😢 꿈을 입력해주세요!");
    return;
  }

  isAnalyzing.value = true;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "user",
          content: `이 꿈 내용을 분석하고 해석해줘. 대답에서 마크다운 문법(예: *, #, _)을 사용하지 말고, 순수한 텍스트로만 답변해줘. 대신 이모티콘을 넣어서 친근한 느낌을 줘.: "${diaryStore.content}"`,
        },
      ],

      max_tokens: 1000,
      temperature: 0.7,
    });

    diaryStore.setDreamAnalysis(response.choices[0].message.content);
  } catch (error) {
    console.error("❌Open AI API 호출 에러", error);
    alert("꿈 분석 중 에러가 발생했습니다 😢 다시 시도해주세요!");
  } finally {
    isAnalyzing.value = false;
  }
};

// 꿈 분석 복사
const copyAnalysis = () => {
  navigator.clipboard
    .writeText(diaryStore.dreamAnalysis)
    .then(() => {
      alert("분석 결과가 복사되었습니다! 📋");
      console.log("분석 결과: ", diaryStore.dreamAnalysis);
    })
    .catch(() => {
      console.error("❌ 분석 결과 복사에 실패했습니다.", error);
      alert("분석 결과 복사에 실패했습니다. 다시 시도해주세요!");
    });
};

//이미지 생성
const generateImage = async () => {
  isGeneratingImage.value = true;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a creative assistant that generates detailed and visually descriptive prompts for image generation.",
        },
        {
          role: "user",
          content: `다음 꿈을 바탕으로 귀엽고 서정적인 일러스트를 생성할 수 있는 프롬프트를 만들어 줘. 카툰 스타일. 부드러운 톤. 꿈 내용 : "${diaryStore.content}" `,
        },
      ],

      functions: [
        {
          name: "generate_image",
          parameters: {
            type: "object",
            properties: {
              prompt: { type: "string" },
              size: {
                type: "string",
                enum: ["256x256", "512x512", "1024x1024"],
              },
            },
            required: ["prompt", "size"],
          },
        },
      ],
      function_call: { name: "generate_image" },
    });
    //이미지 생성 요청
    const functionCall = response.choices[0]?.message?.function_call;

    if (!functionCall || !functionCall.arguments) {
      throw new Error("프롬프트 생성 응답이 유효하지 않습니다.");
    }

    const { prompt, size } = JSON.parse(functionCall.arguments);

    const imageResponse = await openai.images.generate({
      prompt,
      n: 1,
      size,
    });

    if (imageResponse.data && imageResponse.data.length > 0) {
      diaryStore.setImgUrl(imageResponse.data[0].url);
    } else {
      throw new Error("이미지 생성에 실패했습니다.");
    }
  } catch (error) {
    console.error("❌ 이미지 생성 에러 발생", error);
    alert("이미지 생성 중 에러가 발생했습니다 😢 다시 시도해주세요!");
  } finally {
    isGeneratingImage.value = false;
  }
};

//이미지 다운로드

//꿈 감정 분석
const analyzeEmotion = async () => {
  const prompt = `다음 꿈을 바탕으로 사용자가 어떤 감정을 느낄 것 같은지 주요 감정을 하나로 요약해줘. 감정 예시는 "슬픔", "기쁨", "두려움", "평온", "분노", "놀람" 중 하나로만 답해줘:
  꿈 감정 분석: "${diaryStore.content}"`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const emotion = response.choices[0].message.content;
    console.log("분석된 감정:", emotion);
    return emotion;
  } catch (error) {
    console.error("❌감정 분석 중 에러 발생", error);
    throw error;
  }
};

//분석된 감정 바탕으로 ASMR 키워드 설정
const emotionToASMRKeyword = (emotion) => {
  switch (emotion) {
    case "슬픔":
      return "슬플 때 듣는 asmr";
    case "기쁨":
      return "행복할 때 듣는 asmr";
    case "두려움":
      return "두려울 때, 불안할 때 듣는 asmr";
    case "평온":
      return "힐링 asmr";
    case "분노":
      return "화날 때 듣는 asmr";
    case "놀람":
      return "진정 asmr";
    default:
      return "힐링 asmr";
  }
};

//유튜브 API 이용
const fetchASMRVideos = async (emotion) => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const keyword = emotionToASMRKeyword(emotion);
  const maxResults = 1;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        keyword
      )}&type=video&maxResults=${maxResults}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.items.length > 0) {
      const item = data.items[0];
      return {
        title: item.snippet.title,
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails.high.url,
      };
    }
    throw new Error("추천 ASMR 영상이 없습니다.");
  } catch (error) {
    console.error("❌ASMR 영상들을 가져오는 데 실패했습니다.", error);
    throw error;
  }
};

//ASMR 영상 추천
const recommendASMR = async (dreamAnalysis) => {
  try {
    isFetching.value = true;
    emotion.value = await analyzeEmotion(dreamAnalysis);
    asmrVideo.value = await fetchASMRVideos(emotion.value);

    if (asmrVideo.value && asmrVideo.value.videoId) {
      const youtubeUrl = `https://www.youtube.com/embed/${asmrVideo.value.videoId}`;
      diaryStore.setYoutubeUrl(youtubeUrl);
    } else {
      console.warn("추천 ASMR 영상을 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("❌ASMR 추천 중 에러 발생", error);
    alert("ASMR 추천 중 에러가 발생했습니다 😢 다시 시도해주세요!");
  } finally {
    isFetching.value = false;
  }
};

// 오늘 일기 작성 확인
const checkTodayDiary = async () => {
  const exists = await checkDiaryExists(today);
  isDiaryWritten.value = exists;
};

onMounted(async () => {
  try {
    const exists = await checkDiaryExists(today); // 비동기 함수 호출
    isDiaryWritten.value = exists; // 상태 업데이트
    console.log("오늘 일기 작성 여부:", exists); // 디버깅용 콘솔 출력
  } catch (error) {
    console.error("onMounted에서 에러 발생:", error.message);
  }
});
</script>
<template>
  <div class="flex flex-col md:flex-row h-full gap-x-[85px] overflow-hidden">
    <!-- 꿈 기록 -->
    <div
      class="md:ml-[70px] h-full md:fixed md:w-[480px] lg:w-[560px] xl:w-[640px] 2xl:w-[700px] 3xl:w-[760px]"
    >
      <textarea
        v-model="diaryStore.content"
        :rules="rules"
        required
        maxlength="1600"
        placeholder="꿈 일기를 기록해주세요 (최대 1600자)"
        style="background-color: rgba(255, 255, 255, 0.7); aspect-ratio: 1 / 1"
        class="w-full p-16 text-xl resize-none md:rounded-3xl focus:outline-none"
      ></textarea>

      <div class="flex justify-between xm:mx-4 md:mx-0 mt-[10px]">
        <div class="flex gap-x-[10px]">
          <!-- 음성인식 버튼-->
          <Button
            v-if="!isListening"
            variant="regular"
            class="text-hc-pink"
            size="xs"
            @click="startListening"
          >
            <v-tooltip activator="parent" location="bottom" color="#E5E5E5"
              >음성인식 시작</v-tooltip
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
            <v-tooltip activator="parent" location="bottom"
              >음성인식 종료</v-tooltip
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
          <Button variant="regular" size="xs" @click="analyzeDream">
            <v-tooltip activator="parent" location="bottom"
              >AI 꿈 분석</v-tooltip
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
          <Button variant="regular" size="xs" @click="generateImage">
            <v-tooltip activator="parent" location="bottom"
              >AI 그림 생성</v-tooltip
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
          <Button variant="regular" size="xs" @click="recommendASMR">
            <v-tooltip activator="parent" location="bottom">ASMR 추천</v-tooltip
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

        <!-- 일기 쓰기 버튼 -->
        <RouterLink to="/diary/write">
          <Button
            variant="filled"
            size="xs"
            :disabled="isDiaryWritten"
            class="disabled:bg-hc-gray disabled:cursor-pointer"
          >
            <v-tooltip
              activator="parent"
              location="bottom right"
              v-if="isDiaryWritten"
              >앗! 오늘은 일기를 이미 작성하셨어요😲</v-tooltip
            >
            <v-tooltip activator="parent" location="bottom" v-else
              >일기 쓰러 가기</v-tooltip
            >

            <v-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path :d="mdiNotebookOutline" />
              </svg> </v-icon
          ></Button>
        </RouterLink>
      </div>
    </div>

    <div
      style="--webkit-scrollbar-width: none; scrollbar-width: none"
      class="flex flex-col xm:mt-[37px] md:mt-0 md:w-[640px] lg:w-[660px] xl:w-[680px] 2xl:w-[700px] 3xl:w-[840px] gap-y-[50px] md:mr-[70px] overflow-y-auto md:ml-[640px] lg:ml-[760px] xl:ml-[800px] 2xl:ml-[920px] 3xl:ml-[960px]"
    >
      <div
        class="flex flex-col items-center w-full md:rounded-3xl px-[65px] relative pb-[78px]"
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
              diaryStore.dreamAnalysis ||
              "AI가 꿈을 분석하고 결과를 여기에 보여드릴게요!🌙"
            }}
          </h3>
        </div>

        <Button
          size="xs"
          variant="regular"
          class="absolute bottom-4 right-4"
          @click="copyAnalysis"
        >
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
        <p class="mb-[10px] font-semibold text-2xl xm:pl-4 md:pl-0">
          AI 그림 생성
        </p>

        <img
          v-if="diaryStore.imgUrl"
          :src="diaryStore.imgUrl"
          alt="AI 생성 이미지"
          class="w-full h-fit md:rounded-3xl"
        />
        <img
          v-else
          src="/public/assets/imgs/img_placeholder.png"
          alt="AI 그림"
          class="w-full h-fit md:rounded-3xl"
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
      <div class="mb-16 video-container">
        <p class="mb-[10px] font-semibold text-2xl xm:pl-4 md:pl-0">
          추천 ASMR
        </p>
        <div
          class="relative w-full overflow-hidden md:rounded-3xl"
          style="padding-top: 56.25%"
        >
          <iframe
            v-if="asmrVideo"
            class="absolute top-0 left-0 w-full h-full"
            :src="diaryStore.youtubeUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <img
            v-else
            src="/public/assets/imgs/youtube_placeholder.png"
            alt="ASMR 비디오"
            class="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.v-tooltip > ::v-deep(.v-overlay__content) {
  background: #757575;
  color: white;
}
</style>
