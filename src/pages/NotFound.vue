<script setup>
import { ChevronLeftIcon } from "@heroicons/vue/24/solid";
import { HomeIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
  router.back();
}

function goHome() {
  router.push("/");
}
</script>
<template>
  <div class="not-found">
    <div
      class="fixed top-0 flex content-center justify-between w-full pt-[30px]"
    >
      <button class="font-bold size-8 text-hc-blue ml-[30px]" @click="goBack">
        <ChevronLeftIcon />
      </button>

      <button class="font-bold size-8 text-hc-blue mr-[30px]" @click="goHome">
        <HomeIcon />
      </button>
    </div>
  </div>
</template>
<style scoped>
.not-found {
  background-image: url("/assets/imgs/bg_not_found_mobile.png");
  background-size: 90%; /* 이미지를 요소 크기에 맞게 조정 */
  background-position: center; /* 이미지를 중앙에 배치 */
  height: 100vh; /* 화면 전체 높이를 차지하도록 설정 */
  display: flex;
  justify-content: center;

  align-items: center;
}
@media (min-width: 1024px) {
  .not-found {
    background-image: url("/assets/imgs/bg_not_found_desktop.png");
  }
  button {
    color: white;
    font-size: 24px;
  }
}
</style>
