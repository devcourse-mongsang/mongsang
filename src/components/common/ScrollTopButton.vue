<script setup>
import { Icon } from "@iconify/vue";
import { ref, onMounted, onUnmounted } from "vue";

// props 정의
defineProps({
  bottom: {
    type: String,
    default: "50px",
  },
  right: {
    type: String,
    default: "-40px",
  },
});

const showButton = ref(false);

// 스크롤 감지 함수
const handleScroll = () => {
  showButton.value = window.scrollY > 10; // 10px 이상 스크롤 시 버튼 표시
};

// 최상단 이동 함수
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" }); // 부드러운 스크롤 적용
};

// 이벤트 리스너 등록 및 해제
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div
    v-show="showButton"
    @click="scrollToTop"
    class="fixed z-30 m-[80px] bg-hc-white aspect-square w-[3rem] flex justify-center items-center rounded-full hover:scale-105 shadow-lg dark:bg-hc-dark-blue transition-colors duration-300"
    :style="{ bottom, right }"
  >
    <Icon
      icon="ic:round-arrow-upward"
      width="30px"
      height="30px"
      class="transition-colors duration-300 text-hc-blue dark:text-hc-white"
    />
  </div>
</template>
