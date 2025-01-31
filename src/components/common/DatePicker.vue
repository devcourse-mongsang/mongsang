<script setup>
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  selectedDate: {
    type: Date,
    required: true,
  },
});

const emit = defineEmits(["select"]);

// 현재 표시되는 년월 상태
const currentMonth = ref(new Date(props.selectedDate));

// 달력에 표시될 날짜들 계산
const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  const firstDayOfWeek = firstDay.getDay();

  // 현재 달의 날짜들
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null); // 빈 칸 추가
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  return days;
});

// 다음/이전 달로 이동
const changeMonth = (delta) => {
  const newDate = new Date(currentMonth.value);
  newDate.setMonth(newDate.getMonth() + delta);
  currentMonth.value = newDate;
};

// 날짜 선택
const selectDate = (date) => {
  emit("select", date);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-4 w-[280px]">
    <!-- 달력 헤더 -->
    <div class="flex justify-between items-center mb-4">
      <button @click="changeMonth(-1)" class="text-hc-blue">
        <Icon
          icon="material-symbols-light:arrow-left-rounded"
          class="w-10 h-10"
        />
      </button>
      <span class="font-semibold">
        {{ currentMonth.getFullYear() }}년 {{ currentMonth.getMonth() + 1 }}월
      </span>
      <button @click="changeMonth(1)" class="text-hc-blue">
        <Icon
          icon="material-symbols-light:arrow-right-rounded"
          class="w-10 h-10"
        />
      </button>
    </div>

    <!-- 요일 헤더 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <span
        v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
        :key="day"
        class="text-center text-sm"
      >
        {{ day }}
      </span>
    </div>

    <!-- 달력 날짜들 -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="day in calendarDays"
        :key="day ? day.date : Math.random()"
        class="h-8 w-8 flex items-center justify-center"
      >
        <button
          v-if="day"
          @click="selectDate(day.date)"
          class="h-8 w-8 flex items-center justify-center rounded-full"
          :class="{
            'text-gray-400': !day.isCurrentMonth,
            'bg-hc-blue text-white':
              day.date.toDateString() === selectedDate.toDateString(),
            'hover:bg-gray-100':
              day.date.toDateString() !== selectedDate.toDateString(),
          }"
        >
          {{ day.date.getDate() }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
