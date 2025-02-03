<script setup>
import Sidebar from "../components/common/Sidebar.vue";
</script>

<template>
  <div
    id="back-ground"
    class="max-w-full mx-auto min-h-screen bg-cover bg-center bg-no-repeat relative overflow-y-auto z-[-10px]"
  >
    <Sidebar />
    <div class="pt-[70px]">
      <div
        class="xm:mt-[20px] sm:mt-[115px] w-full max-w-[989px] px-[0px] sm:px-[24px] md:px-[100px] xm: mx-auto mb-[49px]"
      >
        <RouterView />
      </div>
    </div>
  </div>
</template>
<style scoped>
#back-ground {
  background-image: url("../../public/assets/imgs/bg_circle_mobile.png");
}

@media (min-width: 768px) {
  #back-ground {
    background-image: url("/assets/imgs/bg_circle_light.png");
  }
}

.dark #back-ground {
  background-image: url("/assets/imgs/bg_circle_mobile_dark.png");
}

@media (min-width: 768px) {
  .dark #back-ground {
    background-image: url("/assets/imgs/bg_circle_dark.png");
  }
}
</style>
