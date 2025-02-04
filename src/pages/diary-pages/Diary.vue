<script setup>
import Calender from "../../components/common/Calender.vue";
import DropDownDiary from "../../components/common/DropDownDiary.vue";
import GlassBox from "../../components/common/GlassBox.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useModalStore } from "@/store/modalStore";
import { useAuthStore } from "@/store/authStore";

const modalStore = useModalStore();
const authStore = useAuthStore();
const router = useRouter();

const selectedDate = ref([new Date().getFullYear(), new Date().getMonth() + 1]);

const updateDate = (dateArray) => {
  selectedDate.value = dateArray;
};

const springs = [
  { class: "top-left-1" },
  { class: "top-left-2" },
  { class: "top-right-1" },
  { class: "top-right-2" },
];
</script>

<template>
  <div class="flex justify-center items-center mt-[10vh]">
    <GlassBox
      class="w-[100vw] lg:w-[52.375rem] h-full flex flex-col items-center pb-6"
    >
      <div class="flex items-center justify-center w-full pt-10">
        <img
          class="w-[7rem] lg:w-[14.3125rem] h-full dark:hidden block"
          src="../../../public/assets/imgs/big_logo.png"
          alt="로고 이미지입니다."
        />
        <img
          class="w-[7rem] lg:w-[14.3125rem] h-full dark:block hidden"
          src="../../../public/assets/imgs/big_logo_dark.png"
          alt="로고 이미지입니다."
        />
      </div>
      <div class="relative w-full">
        <!-- DropDownDiary 외부 상단 위치 -->
        <div class="absolute mt-[1vh] ml-[2vw]">
          <DropDownDiary @updateDate="updateDate" />
        </div>

        <!-- 파란 박스 -->
        <div
          class="w-[97vw] lg:w-[49.125rem] mx-auto mt-[70px] rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[10px] rounded-br-[10px] bg-hc-blue/50 dark:bg-hc-white/25 box-border relative flex flex-col items-center pt-2 pb-2"
        >
          <Calender
            :year="selectedDate[0]"
            :month="selectedDate[1]"
            class="w-full mb-1"
          />
        </div>
      </div>

      <div
        v-for="spring in springs"
        :key="spring.class"
        :class="[
          'absolute',
          spring.class === 'top-left-1' ? 'top-[-23px] left-[90px]' : '',
          spring.class === 'top-left-2' ? 'top-[-23px] left-[150px]' : '',
          spring.class === 'top-right-1' ? 'top-[-23px] right-[90px]' : '',
          spring.class === 'top-right-2' ? 'top-[-23px] right-[150px]' : '',
          'hidden',
          'md:block',
        ]"
        :style="spring.style"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.25rem"
          height="2.875rem"
          viewBox="0 0 20 46"
          fill="none"
        >
          <path
            d="M10 10L10 36"
            stroke="#757575"
            stroke-width="1.25rem"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </GlassBox>
  </div>
</template>

<style scoped></style>
