<script setup>
import Sidebar from "../components/common/Sidebar.vue";
</script>
<template>
  <div
    id="back-ground"
    class="max-w-full mx-auto min-h-screen bg-cover bg-center bg-no-repeat relative overflow-y-auto z-[-10px]"
    style="background-image: url('/assets/imgs/bg_light_home.png')"
  >
    <Sidebar />
    <div class="pt-[70px]">
      <RouterView />
    </div>
  </div>
</template>
