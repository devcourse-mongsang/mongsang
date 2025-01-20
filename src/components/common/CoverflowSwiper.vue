<script setup>
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";

import { register } from "swiper/element/bundle";
import CommunityChips from "./CommunityChips.vue";
register();
</script>
<template>
  <div
    class="font-semibold max-w-[1141px] mx-auto px-4 md:px-8 lg:px-11 mt-[128px] flex flex-col gap-5"
  >
    <h2 class="text-[32px]">카테고리별 인기글 TOP 5</h2>
    <CommunityChips />
  </div>
  <div>
    <swiper-container
      class="mySwiper"
      initial-slide="2"
      pagination="true"
      effect="coverflow"
      grab-cursor="true"
      centered-slides="true"
      slides-per-view="auto"
      coverflow-effect-rotate="25"
      coverflow-effect-stretch="0"
      coverflow-effect-depth="300"
      coverflow-effect-modifier="1"
      coverflow-effect-slide-shadows="false"
    >
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">TITLE</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">TITLE</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">TITLE</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">TITLE</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">TITLE</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
    </swiper-container>
  </div>
</template>
<style scoped>
swiper-container {
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
}

swiper-slide {
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 400px;
}

swiper-slide img {
  display: block;
}
</style>
