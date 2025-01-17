<script setup>
import DropDown from "../components/common/DropDown.vue";

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
  <div class="mt-[115px] w-[65%] mx-auto mb-[49px]">
    <div class="flex justify-between h-[46px] items-start mb-[18px]">
      <h1 class="text-4xl font-semibold">{{ communityTitle }}</h1>
      <DropDown />
    </div>
    <div class="w-full bg-white h-[45px] rounded-[20px] mb-[35px]"></div>
    <RouterView />
  </div>
</template>
<style scoped></style>
