<script setup>
import Sidebar from "@/components/common/Sidebar.vue";
</script>
<template>
  <div
    id="back-ground"
    class="max-w-full mx-auto min-h-screen bg-cover bg-center bg-no-repeat relative overflow-y-auto z-[-10px] bg-[url('/assets/imgs/bg_circle_light.png')] dark:bg-[url('/assets/imgs/bg_circle_dark.png')]"
  >
    <Sidebar />
    <div class="pt-[70px]">
      <div class="pt-[30px] pb-[140px] px-[0px] flex justify-center">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
