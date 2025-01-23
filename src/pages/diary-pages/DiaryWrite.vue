<script setup>
import { ref, computed, onMounted } from "vue";
import DropDownWeather from "@/components/common/DropDownWeather.vue";
import DropDownFace from "../../components/common/DropDownFace.vue";
import { Icon } from "@iconify/vue";

// 상태 관리
const selectedDate = ref(new Date());

// 더미 데이터
const diaryData = ref({
  date: "2025년 / 01월 / 20일",
  username: "@Mala_love",
  title: "",
  content:
    "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
  dreamAnalysis:
    "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
  aiImg: "/assets/imgs/img_placeholder.png",
  asmrImg: "/assets/imgs/youtube_thumbnail.png",
});

// 제목과 본문 초기화
const title = ref(diaryData.value.title);
//const content = ref(diaryData.value.content);

// 날짜 포맷 계산
const formattedDate = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = String(selectedDate.value.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.value.getDate()).padStart(2, "0");
  return { year, month, day };
});

// 데이터 삭제 핸들러
const deleteDreamAnalysis = () => {
  diaryData.value.dreamAnalysis = "";
};

const deleteImage = () => {
  diaryData.value.aiImg = "";
};

const deleteAsmr = () => {
  diaryData.value.asmrImg = "";
};

const contentTextarea = ref(null);

const content = ref(""); // textarea 내용
const hasContent = ref(false); // 버튼 표시 여부

// content 확인
const checkContent = () => {
  hasContent.value =
    content.value.trim().length > 0 ||
    diaryData.value.content.trim().length > 0;
};

// 버튼 클릭 동작
const fetchContent = () => {
  content.value = diaryData.value.content; // diaryData의 content를 textarea로 복사
  checkContent(); // 버튼 상태 업데이트
};

// 초기화 시 diaryData의 content를 content에 복사
onMounted(() => {
  content.value = diaryData.content;
});

// 데이터 표시 상태 관리
const showDreamAnalysis = ref(false);
const showAiImage = ref(false);
const showAsmrImage = ref(false);

// 데이터 표시 함수
const toggleDreamAnalysis = () => {
  showDreamAnalysis.value = !showDreamAnalysis.value;
};

const toggleAiImage = () => {
  showAiImage.value = !showAiImage.value;
};

const toggleAsmrImage = () => {
  showAsmrImage.value = !showAsmrImage.value;
};
</script>

<template>
  <div class="flex justify-center items-start p-4 xm:p-0">
    <div class="w-full max-w-[710px] xm:w-full">
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
        <div class="flex gap-4 justify-end ml-auto">
          <DropDownFace />
          <DropDownWeather />
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
            class="w-full text-lg sm:text-2xl font-semibold text-hc-gray mb-4 sm:mb-2 bg-transparent border-none focus:outline-none"
          />
          <div class="relative">
            <!-- content textarea -->
            <textarea
              v-model="content"
              @input="checkContent"
              class="w-full h-32 p-2"
              placeholder="꿈 일기를 작성해주세요"
            ></textarea>
            <button
              v-show="!hasContent"
              @click="fetchContent"
              class="w-[50px] h-[50px] rounded-full bg-hc-gray/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Icon
                icon="material-symbols:edit-note-rounded"
                class="w-6 h-6 absolute text-hc-blue top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </button>
          </div>
        </div>

        <!-- 미리보기 섹션 -->
        <div class="mt-6 xm:mt-11 xm:px-6">
          <p class="text-lg sm:text-xl font-semibold mb-2">미리보기</p>
          <div class="space-y-4">
            <!-- 꿈 분석 -->
            <div class="relative w-[620px]">
              <p
                class="text-lg sm:text-xl font-semibold text-hc-blue mb-2 inline-block"
              >
                꿈 분석
              </p>
              <button
                v-if="diaryData.dreamAnalysis"
                @click="deleteDreamAnalysis"
                class="absolute right-0 top-0"
              >
                <div
                  class="flex justify-start items-center w-[30px] h-[30px] relative gap-2.5 p-[3px] rounded-[15px] bg-[#757575]"
                >
                  <Icon
                    icon="mdi:trash-can-outline"
                    class="w-5 h-5 text-hc-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
              </button>
              <div
                v-if="showDreamAnalysis"
                class="h-20 sm:h-32 overflow-y-auto"
              >
                <p class="text-base sm:text-xl text-hc-black">
                  {{ diaryData.dreamAnalysis }}
                </p>
              </div>
              <div
                v-else
                class="w-full h-20 sm:h-32 bg-[#D9D9D9] rounded-[20px] relative"
              >
                <button
                  @click="toggleDreamAnalysis"
                  class="w-[50px] h-[50px] rounded-full bg-hc-white/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <Icon
                    icon="material-symbols:notes-rounded"
                    class="w-6 h-6 absolute text-hc-blue top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                </button>
              </div>
            </div>

            <!-- 이미지와 ASMR -->
            <div class="flex flex-wrap gap-4">
              <div class="relative">
                <p class="text-lg sm:text-xl font-semibold text-hc-blue mb-2">
                  이미지
                </p>
                <div class="relative">
                  <button
                    v-if="diaryData.aiImg"
                    @click="deleteImage"
                    class="absolute -top-2 -right-2 z-10"
                  >
                    <div
                      class="flex justify-start items-center w-[30px] h-[30px] relative gap-2.5 p-[3px] rounded-[15px] bg-[#757575]"
                    >
                      <Icon
                        icon="mdi:trash-can-outline"
                        class="w-5 h-5 text-hc-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      />
                    </div>
                  </button>
                  <img
                    v-if="showAiImage"
                    :src="diaryData.aiImg"
                    class="w-20 h-20 sm:w-[90px] sm:h-[90px] object-cover rounded-[20px]"
                    alt="AI Image"
                  />
                  <div
                    v-else
                    class="w-20 h-20 sm:w-[90px] sm:h-[90px] bg-[#D9D9D9] rounded-[20px] relative"
                  >
                    <button
                      v-if="diaryData.aiImg"
                      @click="toggleAiImage"
                      class="w-[50px] h-[50px] rounded-full bg-hc-white/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <Icon
                        icon="material-symbols:photo-library-rounded"
                        class="w-6 h-6 absolute text-hc-blue top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div class="relative">
                <p class="text-lg sm:text-xl font-semibold text-hc-blue mb-2">
                  ASMR
                </p>
                <div class="relative">
                  <button
                    v-if="diaryData.asmrImg"
                    @click="deleteAsmr"
                    class="absolute -top-2 -right-2 z-10"
                  >
                    <div
                      class="flex justify-start items-center w-[30px] h-[30px] relative gap-2.5 p-[3px] rounded-[15px] bg-[#757575]"
                    >
                      <Icon
                        icon="mdi:trash-can-outline"
                        class="w-5 h-5 text-hc-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      />
                    </div>
                  </button>
                  <img
                    v-if="showAsmrImage"
                    :src="diaryData.asmrImg"
                    class="w-28 h-20 sm:w-[127px] sm:h-[90px] object-cover rounded-[20px]"
                    alt="ASMR Image"
                  />
                  <div
                    v-else
                    class="w-28 h-20 sm:w-[127px] sm:h-[90px] bg-[#D9D9D9] rounded-[20px] relative"
                  >
                    <button
                      v-if="diaryData.asmrImg"
                      @click="toggleAsmrImage"
                      class="w-[50px] h-[50px] rounded-full bg-hc-white/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <Icon
                        icon="material-symbols:slideshow-outline-rounded"
                        class="w-6 h-6 absolute text-hc-blue top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
      <div class="mt-4 flex justify-end">
        <button class="w-[50px] h-[50px] bg-hc-blue rounded-full relative">
          <Icon
            icon="material-symbols:check-rounded"
            class="w-6 h-6 text-hc-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 필요한 경우 여기에 추가 스타일을 넣을 수 있습니다 */
</style>
