<script setup>
import Sidebar from "../components/common/Sidebar.vue";
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
        <RouterView />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
