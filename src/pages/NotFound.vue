<script setup>
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

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
        <Icon
          icon="material-symbols:arrow-back-ios-new-rounded"
          width="27"
          height="27"
          style="color: #729ecb"
        />
      </button>

      <button class="font-bold size-8 text-hc-blue mr-[30px]" @click="goHome">
        <Icon
          icon="material-symbols:home-outline-rounded"
          width="32"
          height="32"
          style="color: #729ecb"
        />
      </button>
    </div>
  </div>
</template>
<style scoped>
.not-found {
  background-image: url("/assets/imgs/bg_not_found_mobile.png");
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
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
