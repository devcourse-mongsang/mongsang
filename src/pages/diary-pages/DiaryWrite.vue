<script setup>
import { ref, computed } from "vue";
import DropDownWeather from "@/components/common/DropDownWeather.vue";
import DropDownFace from "../../components/common/DropDownFace.vue";
import { Icon } from "@iconify/vue";
import DatePicker from "@/components/common/DatePicker.vue";

// 상태 관리
const showDatePicker = ref(false);
const selectedDate = ref(new Date());

// 더미 데이터
const diaryData = ref({
  date: "2025년 / 01월 / 20일",
  username: "@Mala_love",
  title: "나는 오늘도 마라탕을 먹으면서 버블티를 마시는 꿈을 꾼다",
  content:
    "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
  dreamAnalysis:
    "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
  aiImg: "/assets/imgs/img_placeholder.png",
  asmrImg: "/assets/imgs/youtube_thumbnail.png",
});

// 제목과 본문 초기화
const title = ref(diaryData.value.title);
const content = ref(diaryData.value.content);

// 날짜 포맷 계산
const formattedDate = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = String(selectedDate.value.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.value.getDate()).padStart(2, "0");
  return { year, month, day };
});

// 날짜 선택 핸들러
const handleDateSelect = (date) => {
  selectedDate.value = date;
  showDatePicker.value = false;
};

// 달력 토글 핸들러
const toggleDatePicker = () => {
  showDatePicker.value = !showDatePicker.value;
};
</script>

<template>
  <div class="flex justify-center items-start">
    <div class="w-[710px]">
      <!-- 날짜 표시 및 상단 버튼들 -->
      <div class="flex justify-between mb-5">
        <div class="w-[289px] h-[45px] relative bg-hc-white/70 rounded-[20px]">
          <p class="absolute left-[18px] top-[8px] text-xl">
            <span class="text-hc-gray">{{ formattedDate.year }}</span>
            <span class="text-hc-black">년 / </span>
            <span class="text-hc-gray">{{ formattedDate.month }}</span>
            <span class="text-hc-black">월 / </span>
            <span class="text-hc-gray">{{ formattedDate.day }}</span>
            <span class="text-hc-black">일</span>
          </p>
          <button @click="toggleDatePicker">
            <Icon
              icon="material-symbols:date-range"
              class="absolute right-4 top-[8.5px] w-6 h-6 text-hc-blue"
            />
          </button>

          <!-- DatePicker 컴포넌트 -->
          <div v-if="showDatePicker" class="absolute top-[50px] left-0 z-50">
            <DatePicker
              :selected-date="selectedDate"
              @select="handleDateSelect"
            />
          </div>
        </div>

        <!-- 상단 우측 버튼들 -->
        <div class="flex gap-4">
          <!-- 버튼들을 감싸는 컨테이너 추가 -->

          <DropDownFace />

          <DropDownWeather />
        </div>
      </div>

      <!-- 메인 컨텐츠 영역 -->
      <div
        class="relative w-[710px] h-[718px] bg-hc-white/50 rounded-[20px] p-6"
      >
        <!-- 상단 흰색 박스 -->
        <div class="w-[660px] h-60 bg-hc-white rounded-[20px] p-8">
          <input
            v-model="title"
            placeholder="제목 없음"
            class="w-full text-2xl font-semibold text-hc-gray mb-4 bg-transparent border-none focus:outline-none"
          />
          <textarea
            v-model="content"
            placeholder="꿈 일기를 작성해주세요"
            class="w-full text-xl text-hc-gray bg-transparent border-none focus:outline-none"
            rows="4"
          ></textarea>
        </div>

        <!-- 미리보기 섹션 -->
        <div class="mt-11 px-6">
          <p class="text-xl font-semibold mb-2">미리보기</p>
          <div class="space-y-4">
            <!-- 꿈 분석 -->
            <div>
              <p class="text-xl font-semibold text-hc-blue mb-2">꿈 분석</p>
              <div v-if="diaryData.dreamAnalysis">
                <div class="h-32 overflow-y-auto">
                  <p class="text-xl text-hc-black">
                    {{ diaryData.dreamAnalysis }}
                  </p>
                </div>
              </div>
              <div
                v-else
                class="w-full h-32 bg-[#D9D9D9] rounded-[20px] relative"
              >
                <div
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    class="w-[50px] h-[50px] rounded-full bg-hc-white/30"
                  ></div>
                  <Icon
                    icon="material-symbols:notes-rounded"
                    class="w-6 h-6 text-hc-blue absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
              </div>
            </div>

            <!-- 이미지와 ASMR -->
            <div class="flex gap-4">
              <div>
                <p class="text-xl font-semibold text-hc-blue mb-2">이미지</p>
                <div v-if="diaryData.aiImg" class="w-[90px] h-[90px]">
                  <img
                    :src="diaryData.aiImg"
                    class="w-full h-full object-cover rounded-[20px]"
                    alt="AI Generated Image"
                  />
                </div>
                <div
                  v-else
                  class="w-[90px] h-[90px] bg-[#D9D9D9] rounded-[20px] relative"
                >
                  <div
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      class="w-[50px] h-[50px] rounded-full bg-hc-white/30"
                    ></div>
                    <Icon
                      icon="material-symbols:photo-library-rounded"
                      class="w-6 h-6 text-hc-blue absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p class="text-xl font-semibold text-hc-blue mb-2">ASMR</p>
                <div v-if="diaryData.asmrImg" class="w-[127px] h-[90px]">
                  <img
                    :src="diaryData.asmrImg"
                    class="w-full h-full object-cover rounded-[20px]"
                    alt="ASMR Image"
                  />
                </div>
                <div
                  v-else
                  class="w-[127px] h-[90px] bg-[#D9D9D9] rounded-[20px] relative"
                >
                  <div
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      class="w-[50px] h-[50px] rounded-full bg-hc-white/30"
                    ></div>
                    <Icon
                      icon="material-symbols:slideshow-outline-rounded"
                      class="w-6 h-6 text-hc-blue absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
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
