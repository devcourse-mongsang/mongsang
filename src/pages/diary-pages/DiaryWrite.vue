<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import DropDownWeather from "@/components/common/DropDownWeather.vue";
import DropDownFace from "@/components/common/DropDownFace.vue";
import { Icon } from "@iconify/vue";
import { useDiaryStore } from "@/store/diaryStore";
import { createDiary } from "@/api/api-diary/api.js";
import { useAuthStore } from "@/store/authStore";
import { useDarkMode } from "@/utils/darkMode";
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";
import imgPlaceholderDark from "../../../public/assets/imgs/img_placeholder_dark.png";
import { useModalStore } from "@/store/modalStore";

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null,
  },
  isUpdateMode: {
    type: Boolean,
    default: false,
  },
});

const { isDark } = useDarkMode();

const emit = defineEmits(["submit"]);

const selectedDate = ref(new Date());
const diaryStore = useDiaryStore();

const router = useRouter();
const authStore = useAuthStore();

const title = ref("");
const condition = ref(props.initialData?.condition || "satisfied");
const weather = ref(props.initialData?.weather || "sunny");

const content = ref("");
const modalStore = useModalStore();

onMounted(() => {
  if (!authStore.profile?.id) {
    modalStore.addModal({
      title: "로그인 필요",
      content: "로그인 후 이용해주세요.",
      btnText: "로그인",
      isOneBtn: true,
      onClick: () => {
        modalStore.modals = [];
        router.push({ name: "login" });
      },
    });
  }
});

watch(
  () => diaryStore.content,
  (newValue) => {
    content.value = newValue;
  },
  { immediate: true }
);
const formattedDate = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = String(selectedDate.value.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.value.getDate()).padStart(2, "0");
  return { year, month, day };
});
const updateCondition = (newCondition) => {
  condition.value = newCondition;
};

const updateWeather = (newWeather) => {
  weather.value = newWeather;
};
const handleCheckButtonClick = async () => {
  if (!title.value) {
    modalStore.addModal({
      title: "알림",
      content: "제목을 입력해주세요.",
      btnText: "확인",
      isOneBtn: true,
      onClick: async () => {
        modalStore.modals = []; // 모든 모달 닫기
      },
    });
    return;
  }
  if (!content.value) {
    modalStore.addModal({
      title: "알림",
      content: "내용을 입력해주세요.",
      btnText: "확인",
      isOneBtn: true,
      onClick: async () => {
        modalStore.modals = []; // 모든 모달 닫기
      },
    });
    return;
  }

  const diaryData = {
    title: title.value,
    content: content.value,
    condition: condition.value,
    weather: weather.value,
    dream_analysis: diaryStore.dreamAnalysis,
    img_url: diaryStore.imgUrl,
    youtube_url: diaryStore.youtubeUrl,
  };

  if (props.isUpdateMode) {
    emit("submit", diaryData);
  } else {
    const diary = {
      author_id: authStore.profile.id,
      ...diaryData,
    };

    try {
      const data = await createDiary(diary);
      router.push(`/diary/${data[0].id}`);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  }
};

const deletedData = ref({
  dreamAnalysis: "",
  imgUrl: "",
  youtubeUrl: "",
});

const deleteDreamAnalysis = () => {
  deletedData.value.dreamAnalysis = diaryStore.dreamAnalysis;
  diaryStore.dreamAnalysis = "";
  showDreamAnalysis.value = false;
};

const deleteImage = () => {
  deletedData.value.imgUrl = diaryStore.imgUrl;
  diaryStore.imgUrl = "";
  showAiImage.value = false;
};
const deleteAsmr = () => {
  deletedData.value.youtubeUrl = diaryStore.youtubeUrl;
  diaryStore.youtubeUrl = "";
  showAsmrImage.value = false;
};

const hasContent = ref(false);

const checkContent = () => {
  hasContent.value =
    content.value.trim().length > 0 || diaryStore.content.trim().length > 0;
};

const showDreamAnalysis = ref(false);
const showAiImage = ref(false);
const showAsmrImage = ref(false);

const toggleDreamAnalysis = () => {
  if (!showDreamAnalysis.value && deletedData.value.dreamAnalysis) {
    diaryStore.dreamAnalysis = deletedData.value.dreamAnalysis;
    deletedData.value.dreamAnalysis = "";
  }
  showDreamAnalysis.value = !showDreamAnalysis.value;
};
const toggleAiImage = () => {
  if (!showAiImage.value && deletedData.value.imgUrl) {
    diaryStore.imgUrl = deletedData.value.imgUrl;
    deletedData.value.imgUrl = "";
  }
  showAiImage.value = !showAiImage.value;
};

const toggleAsmrImage = () => {
  if (!showAsmrImage.value && deletedData.value.youtubeUrl) {
    diaryStore.youtubeUrl = deletedData.value.youtubeUrl;
    deletedData.value.youtubeUrl = "";
  }
  showAsmrImage.value = !showAsmrImage.value;
};

onMounted(() => {
  showDreamAnalysis.value = !!diaryStore.dreamAnalysis;
  showAiImage.value = !!diaryStore.imgUrl;
  showAsmrImage.value = !!diaryStore.youtubeUrl;

  if (props.initialData) {
    title.value = props.initialData.title;
    content.value = props.initialData.content;

    selectedDate.value = props.initialData.createdAt;
    if (props.isUpdateMode) {
      diaryStore.dreamAnalysis = props.initialData.dreamAnalysis;
      diaryStore.imgUrl = props.initialData.imgUrl;
      diaryStore.youtubeUrl = props.initialData.youtubeUrl;
    }
  }
});
</script>

<template>
  <div class="flex items-start justify-center p-4 xm:p-0">
    <div class="max-w-[710px] min-w-[376px] w-[90vw] md:w-full">
      <!-- 날짜 표시 및 상단 버튼들 -->
      <div class="flex justify-between gap-4 mb-5 xm:mb-0">
        <div class="flex items-center w-full sm:w-auto">
          <div
            class="w-[215px] h-[45px] relative bg-hc-white/70 rounded-[20px]"
          >
            <p class="absolute left-[18px] top-[8px] text-xl">
              <span class="text-hc-gray">{{ formattedDate.year }}</span>
              <span class="text-hc-black">년 / </span>
              <span class="text-hc-gray">{{ formattedDate.month }}</span>
              <span class="text-hc-black">월 / </span>
              <span class="text-hc-gray">{{ formattedDate.day }}</span>
              <span class="text-hc-black">일</span>
            </p>
          </div>
        </div>

        <!-- 상단 우측 버튼들 -->
        <div class="flex justify-end gap-4 ml-auto">
          <DropDownFace
            :initial-condition="props.initialData?.condition"
            @update:condition="updateCondition"
          />
          <DropDownWeather
            :initial-weather="props.initialData?.weather"
            @update:weather="updateWeather"
          />
        </div>
      </div>

      <!-- 메인 컨텐츠 영역 -->
      <div
        class="relative bg-hc-white/70 rounded-[20px] p-6 shadow-md w-710px xm:w-full xm:mb-5"
      >
        <!-- 상단 흰색 박스 -->
        <div
          class="bg-hc-white rounded-[20px] xm:p-4 sm:p-8 w-full xm:w-full xm:mb-5 relative"
        >
          <input
            v-model="title"
            placeholder="제목을 입력해주세요"
            class="w-full mb-4 text-lg font-semibold bg-transparent border-none sm:text-2xl text-hc-gray sm:mb-2 focus:outline-none"
          />
          <div class="relative">
            <!-- content textarea -->
            <textarea
              v-model="content"
              @input="checkContent"
              class="w-full h-32 p-2 focus:outline-none"
              placeholder="꿈 일기를 작성해주세요"
              style="resize: none"
            ></textarea>
          </div>
        </div>

        <!-- 미리보기 섹션 -->
        <div class="mt-6 xm:mt-11 xm:px-6 w-[90vw] md:w-full">
          <p
            class="mb-2 text-lg font-semibold sm:text-xl dark:text-hc-dark-teal"
          >
            미리보기
          </p>
          <div class="space-y-4">
            <!-- 꿈 분석 -->
            <div class="relative w-[75vw] min-w-[295px] max-w-[620px]">
              <p
                class="inline-block mb-2 text-lg font-semibold sm:text-xl text-hc-blue dark:text-hc-dark-blue"
              >
                꿈 분석
              </p>
              <div v-if="isUpdateMode" class="h-20 overflow-y-auto sm:h-32">
                <p class="text-base sm:text-xl text-hc-black">
                  {{ diaryStore.dreamAnalysis }}
                </p>
              </div>
              <div v-else>
                <button
                  v-if="diaryStore.dreamAnalysis"
                  @click="deleteDreamAnalysis"
                  class="absolute z-10 -top-2 -right-2 hover:scale-105"
                >
                  <div
                    class="flex justify-start items-center w-[30px] h-[30px] relative gap-2.5 p-[3px] rounded-[15px] bg-[#757575]"
                  >
                    <Icon
                      icon="mdi:trash-can-outline"
                      class="absolute w-5 h-5 transform -translate-x-1/2 -translate-y-1/2 text-hc-white top-1/2 left-1/2"
                    />
                  </div>
                </button>
                <div
                  v-if="showDreamAnalysis"
                  class="h-20 overflow-y-auto sm:h-32"
                >
                  <p class="text-base sm:text-xl text-hc-black">
                    {{ diaryStore.dreamAnalysis }}
                  </p>
                </div>
                <div
                  v-else
                  class="w-full h-20 sm:h-32 bg-[#D9D9D9] rounded-[20px] relative"
                >
                  <button
                    @click="toggleDreamAnalysis"
                    :disabled="!diaryStore.dreamAnalysis"
                    class="w-[50px] h-[50px] rounded-full bg-hc-white/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:scale-105"
                  >
                    <Icon
                      icon="material-symbols:notes-rounded"
                      class="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 text-hc-blue top-1/2 left-1/2 dark:text-hc-dark-blue"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- 이미지와 ASMR -->
            <div class="flex flex-wrap pt-[3vh] gap-4">
              <!-- 이미지 -->
              <div class="relative">
                <p
                  class="mb-2 text-lg font-semibold sm:text-xl text-hc-blue dark:text-hc-dark-blue"
                >
                  이미지
                </p>
                <div v-if="isUpdateMode">
                  <img
                    :src="diaryStore.imgUrl"
                    class="w-20 h-20 sm:w-[90px] sm:h-[90px] object-cover rounded-[20px]"
                    alt="AI Image"
                  />
                </div>
                <div v-else>
                  <button
                    v-if="diaryStore.imgUrl"
                    @click="deleteImage"
                    class="absolute z-10 -top-2 -right-2 hover:scale-105"
                  >
                    <div
                      class="flex justify-start items-center w-[30px] h-[30px] relative gap-2.5 p-[3px] rounded-[15px] bg-[#757575]"
                    >
                      <Icon
                        icon="mdi:trash-can-outline"
                        class="absolute w-5 h-5 transform -translate-x-1/2 -translate-y-1/2 text-hc-white top-1/2 left-1/2"
                      />
                    </div>
                  </button>
                  <img
                    v-if="showAiImage"
                    :src="diaryStore.imgUrl || imgPlaceholder"
                    class="w-20 h-20 sm:w-[90px] sm:h-[90px] object-cover rounded-[20px] dark:hidden block"
                    alt="Light AI Image"
                  />
                  <img
                    v-if="showAiImage"
                    :src="diaryStore.imgUrl || imgPlaceholderDark"
                    class="w-20 h-20 sm:w-[90px] sm:h-[90px] object-cover rounded-[20px] dark:block hidden"
                    alt="Dark AI Image"
                  />
                  <div
                    v-else
                    class="w-20 h-20 sm:w-[90px] sm:h-[90px] bg-[#D9D9D9] rounded-[20px] relative"
                  >
                    <button
                      @click="toggleAiImage"
                      class="w-[50px] h-[50px] rounded-full bg-hc-white/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:scale-105"
                    >
                      <Icon
                        icon="material-symbols:photo-library-rounded"
                        class="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 text-hc-blue dark:text-hc-dark-blue top-1/2 left-1/2"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <!-- ASMR -->
              <div class="relative">
                <p
                  class="mb-2 text-lg font-semibold sm:text-xl text-hc-blue dark:text-hc-dark-blue"
                >
                  ASMR
                </p>
                <div v-if="isUpdateMode">
                  <iframe
                    class="w-28 h-20 sm:w-[127px] sm:h-[90px] object-cover rounded-[20px]"
                    :src="diaryStore.youtubeUrl"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                <div v-else>
                  <button
                    v-if="diaryStore.youtubeUrl"
                    @click="deleteAsmr"
                    class="absolute z-10 -top-2 -right-2 hover:scale-105"
                  >
                    <div
                      class="flex justify-start items-center w-[30px] h-[30px] relative gap-2.5 p-[3px] rounded-[15px] bg-[#757575]"
                    >
                      <Icon
                        icon="mdi:trash-can-outline"
                        class="absolute w-5 h-5 transform -translate-x-1/2 -translate-y-1/2 text-hc-white top-1/2 left-1/2"
                      />
                    </div>
                  </button>
                  <iframe
                    v-if="showAsmrImage"
                    class="w-28 h-20 sm:w-[127px] sm:h-[90px] object-cover rounded-[20px]"
                    :src="diaryStore.youtubeUrl"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                  <div
                    v-else
                    class="w-28 h-20 sm:w-[127px] sm:h-[90px] bg-[#D9D9D9] rounded-[20px] relative"
                  >
                    <button
                      @click="toggleAsmrImage"
                      :disabled="!diaryStore.youtubeUrl"
                      class="w-[50px] h-[50px] rounded-full bg-hc-white/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:scale-105"
                    >
                      <Icon
                        icon="material-symbols:slideshow-outline-rounded"
                        class="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 text-hc-blue top-1/2 left-1/2 dark:text-hc-dark-blue"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 동그라미 버튼 -->
      <div class="flex justify-end mt-4">
        <button
          class="w-[50px] h-[50px] bg-hc-blue rounded-full relative dark:bg-hc-dark-blue hover:scale-105"
          @click="handleCheckButtonClick"
        >
          <Icon
            icon="material-symbols:check-rounded"
            class="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 text-hc-white top-1/2 left-1/2"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
