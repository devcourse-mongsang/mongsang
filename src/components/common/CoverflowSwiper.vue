<script setup>
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";

import { register } from "swiper/element/bundle";
import CommunityChips from "./CommunityChips.vue";
register();
</script>
<template>
  <div
    class="font-semibold max-w-[1141px] mx-auto px-4 md:px-8 lg:px-11 xm:mt-[60px] sm:mt-[128px] flex flex-col gap-5"
  >
    <h2 class="xm:text-base sm:text-2xl md:text-[32px]">
      카테고리별 인기글 TOP 5
    </h2>
    <CommunityChips />
  </div>
  <div>
    <swiper-container
      navigation="true"
      class="mySwiper"
      initial-slide="3"
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
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30 hover:scale-[105%]"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">자유게시판</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30 hover:scale-[105%]"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">초현실몽</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30 hover:scale-[105%]"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">예지몽</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30 hover:scale-[105%]"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">반복몽</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30 hover:scale-[105%]"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">자각몽</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30 hover:scale-[105%]"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">악몽</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30 hover:scale-[105%]"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">길몽</h3>
          <p class="text-base">name</p>
        </div>
      </swiper-slide>
      <swiper-slide
        class="p-[10px] bg-hc-white/50 rounded-[20px] border-[7px] border-hc-white/30 hover:scale-[105%]"
      >
        <img
          class="w-full h-[70%] object-cover rounded-[20px]"
          :src="imgPlaceholder"
        />
        <div class="text-xl mt-[24px] leading-tight">
          <h3 class="font-semibold">해몽</h3>
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
