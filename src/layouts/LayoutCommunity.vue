<script setup>
import DropDown from "../components/common/DropDown.vue";
import Sidebar from "../components/common/Sidebar.vue";

import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const communityTitle = ref("초현실몽");
const route = useRoute();

watch(
  () => route.path,
  (newPath) => {
    const lastSegment = newPath.split("/").pop();
    communityTitle.value = decodeURIComponent(lastSegment);
  },
  { immediate: true }
);
</script>

<template>
  <div
    id="back-ground"
    class="max-w-full mx-auto min-h-screen bg-cover bg-center bg-no-repeat relative overflow-y-auto z-[-10px]"
    style="background-image: url('/assets/imgs/bg_circle 1.png')"
  >
    <Sidebar />
    <div class="pt-[70px]">
      <div
        class="mt-[115px] w-full max-w-[989px] px-[16px] sm:px-[24px] md:px-[100px] mx-auto mb-[49px]"
      >
        <div class="flex justify-between h-[46px] items-start mb-[18px]">
          <h1 class="text-4xl font-semibold">{{ communityTitle }}</h1>
          <DropDown />
        </div>
        <div
          class="w-full max-w-[941px] bg-white h-[45px] rounded-[20px] mb-[35px]"
        ></div>
        <RouterView />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
