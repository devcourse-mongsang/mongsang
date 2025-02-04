<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import { useAuthStore } from "@/store/authStore";
import { getDiaryById } from "@/api/api-diary/api";
import { weatherIcons, faceIcons, getIconByName } from "@/utils/iconUtils";
import { useRouter } from "vue-router";
import { deleteDiary } from "@/api/api-diary/api";
import { useModalStore } from "@/store/modalStore";

const router = useRouter();
const route = useRoute();
const diaryId = route.params.id;

const diaryData = ref(null);

const authStore = useAuthStore();
const modalStore = useModalStore();

const handleDeleteDiary = () => {
  modalStore.addModal({
    title: "일기 삭제",
    content: "일기를 정말 삭제하시겠습니까?",
    btnText: "삭제",
    cancelBtnText: "취소",
    isOneBtn: false,
    onClick: async () => {
      try {
        await deleteDiary(diaryId);
        modalStore.modals = [];
        router.push("/diary");
      } catch (error) {
        console.error("일기 삭제 실패:", error);
      }
    },
  });
};

onMounted(async () => {
  try {
    const diaryResponse = await getDiaryById(diaryId);
    if (!diaryResponse) {
      console.error("다이어리 데이터 불러오기 실패");
      return;
    }

    await authStore.restoreSession();

    diaryData.value = {
      date: diaryResponse.created_at,
      username: authStore.profile?.username || "unknown user",
      title: diaryResponse.title,
      content: diaryResponse.content,
      condition: diaryResponse.condition,
      weather: diaryResponse.weather,
      dreamAnalysis: diaryResponse.dream_analysis,
      imgUrl: diaryResponse.img_url,
      youtubeUrl: diaryResponse.youtube_url,
    };
  } catch (error) {
    console.error("데이터 로딩 에러:", error);
  }
});

const formattedDate = computed(() => {
  if (!diaryData.value?.date) return "";

  const date = new Date(diaryData.value.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}년 / ${month}월 / ${day}일`;
});

// 모달 상태 관리
const isModalOpen = ref(false);

// 모달 토글 함수
const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};
</script>

<template>
  <div v-if="diaryData" class="max-w-[715px] mx-auto">
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
          <span
            class="font-semibold transition-colors duration-300 dark:text-hc-white"
            >{{ diaryData.username }}</span
          >
          <span class="transition-colors duration-300 dark:text-hc-white"
            >의 꿈 일기</span
          >
        </p>
      </div>

      <div class="flex items-center gap-8">
        <p
          class="text-xl transition-colors duration-300 dark:text-hc-white sm:text-xl"
        >
          {{ formattedDate }}
        </p>

        <div class="flex items-center justify-end gap-2 ml-auto">
          <p
            class="text-xl transition-colors duration-300 xm:hidden sm:block dark:text-hc-white"
          >
            오늘의 기분
          </p>
          <Icon
            :icon="getIconByName(faceIcons, diaryData.condition)"
            class="w-6 h-6 transition-colors duration-300 text-hc-blue dark:text-hc-dark-blue"
          />
        </div>

        <div class="flex items-center justify-end gap-2">
          <p
            class="text-xl transition-colors duration-300 xm:hidden sm:block dark:text-hc-white"
          >
            오늘의 날씨
          </p>
          <Icon
            :icon="getIconByName(weatherIcons, diaryData.weather)"
            class="w-6 h-6 transition-colors duration-300 text-hc-blue dark:text-hc-dark-blue"
          />
        </div>

        <!-- 더보기 버튼과 모달 -->
        <div class="relative">
          <button class="flex items-center gap-2" @click="toggleModal">
            <Icon
              icon="mdi:dots-horizontal"
              class="w-6 h-6 transition-colors duration-300 cursor-pointer text-hc-blue dark:text-hc-white"
            />
          </button>

          <!-- 모달 -->
          <div
            v-if="isModalOpen"
            class="absolute right-0 mt-2 w-[191px] rounded-[20px] bg-hc-white shadow-blue z-50 dark:shadow-dark-blue"
          >
            <div class="px-4 py-5">
              <RouterLink :to="`/diary/${diaryId}/update-diary`">
                <button
                  class="w-full mb-3 text-base text-center text-hc-black hover:scale-105"
                >
                  일기 수정
                </button>
              </RouterLink>
              <hr
                class="mb-3 border-hc-blue border-1 dark:border-hc-dark-blue"
              />
              <button
                class="w-full text-base text-center text-hc-coral hover:scale-105"
                @click="handleDeleteDiary"
              >
                일기 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 일기장 이미지 -->
    <img
      v-if="diaryData.imgUrl"
      :src="diaryData.imgUrl"
      alt="Dream"
      class="w-full rounded-[0px] object-cover mb-8 xm:h-auto sm:rounded-[20px]"
    />
    <img
      v-else
      src="/assets/imgs/img_placeholder.png"
      alt="Dream"
      class="w-full rounded-[0px] object-cover mb-8 xm:h-auto sm:rounded-[20px] dark:hidden"
    />
    <img
      v-if="!diaryData.imgUrl"
      src="/assets/imgs/img_placeholder_dark.png"
      alt="Dream"
      class="hidden w-full rounded-[0px] object-cover mb-8 xm:h-auto sm:rounded-[20px] dark:block"
    />

    <!-- 꿈 일기 제목과 내용 -->
    <h2
      class="text-2xl font-semibold mb-4 xm:text-xl xm:px-4 sm:px-[0px] dark:text-hc-white transition-colors duration-300"
    >
      {{ diaryData.title }}
    </h2>
    <p
      class="text-xl text-justify mb-8 xm:text-base xm:px-4 sm:px-[0px] dark:text-hc-white transition-colors duration-300"
    >
      {{ diaryData.content }}
    </p>
    <!-- 구분선 -->
    <hr class="my-8 border-hc-blue dark:border-hc-dark-blue" />

    <!-- 꿈 분석 -->
    <h3
      class="text-xl font-semibold text-hc-blue mb-4 xm:text-lg xm:px-4 sm:px-[0px] dark:text-hc-dark-blue transition-colors duration-300"
    >
      꿈 분석
    </h3>
    <p
      v-if="diaryData.dreamAnalysis"
      class="text-xl text-justify mb-8 xm:text-base xm:px-4 sm:px-[0px] dark:text-hc-white transition-colors duration-300"
    >
      {{ diaryData.dreamAnalysis }}
    </p>
    <p
      v-else
      class="text-xl text-justify mb-8 xm:text-base xm:px-4 sm:px-[0px] text-hc-gray dark:text-hc-white transition-colors duration-300"
    >
      분석된 꿈이 없습니다.
    </p>

    <!-- 구분선 -->
    <hr
      class="my-8 transition-colors duration-300 border-hc-blue dark:border-hc-dark-blue"
    />

    <!-- ASMR 섹션 -->
    <h3
      class="text-xl font-semibold text-hc-blue mb-4 xm:text-lg xm:px-4 sm:px-[0px] dark:text-hc-dark-blue transition-colors duration-300"
    >
      ASMR
    </h3>
    <div
      v-if="diaryData.youtubeUrl"
      class="w-full rounded-[20px] overflow-hidden xm:h-auto"
    >
      <iframe
        :src="diaryData.youtubeUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="w-full aspect-video"
      ></iframe>
    </div>
    <p
      v-else
      class="text-xl text-justify mb-8 xm:text-base xm:px-4 sm:px-[0px] text-hc-gray dark:text-hc-white transition-colors duration-300"
    >
      추천 영상이 없습니다.
    </p>

    <RouterLink to="/diary">
      <div
        class="fixed bottom-[20px] right-[10px] z-30 bg-hc-white dark:bg-hc-dark-blue aspect-square w-[3.5rem] rounded-full shadow-lg hover:scale-105 transition-colors duration-300"
      >
        <div class="flex items-center justify-center w-full h-full">
          <Icon
            icon="material-symbols:book-2-outline"
            width="1.5rem"
            height="1.5rem"
            class="transition-colors duration-300 text-hc-blue dark:text-hc-white"
          />
        </div>
      </div>
    </RouterLink>
  </div>
</template>
