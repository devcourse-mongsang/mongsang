<script setup>
import { useSidebarStore } from "../../store/sidebar"; // Pinia store import
import DropDownCommunity from "./DropDownCommunity.vue";
import { Icon } from "@iconify/vue";
import sidebarHr from "../../../public/assets/icons/sidebar_hr.svg";
import Headers from "./Headers.vue";
import { RouterLink } from "vue-router";

const sidebarStore = useSidebarStore(); // Pinia store 초기화
</script>

<template>
  <!-- 상단 바 -->
  <Headers />
  <!-- 사이드바 -->
  <div
    id="sidebar"
    :class="{
      'left-0 shadow-[0px_0.25rem_4.675rem_#688FB69E,0px_0.25rem_4.375rem_#FFF_inset]':
        sidebarStore.isHamburgerOpen,
      'left-[-20rem]': !sidebarStore.isHamburgerOpen,
    }"
    class="w-[20rem] h-screen fixed top-0 z-10 transition-all ease-in-out duration-[0.45s] pt-[6.5625rem] backdrop-blur-[0.6875rem] text-white flex flex-col gap-[0.125rem] rounded-[0_1.875rem_1.875rem_0] bg-gradient-to-b from-[rgba(34,193,233,0.5)] to-[rgba(184,58,155,0.4)] px-[2.5rem]"
  >
    <!-- 사이드바 콘텐츠 -->
    <div>
      <span class="block h-[1px] w-full bg-hc-white/30" />
      <div class="py-[10px] flex flex-col gap-[15px]">
        <RouterLink class="flex items-center gap-[10px]" to="/mypage/profile">
          <img
            class="w-10 h-10 rounded-full"
            src="https://cdn.pixabay.com/photo/2019/11/08/11/56/kitten-4611189_1280.jpg"
            alt="사용자 프로필 이미지입니다."
          />
          <div class="text-hc-white">
            <p class="font-semibold">@Mala_love</p>
            <p class="text-hc-black">저는 마라를 사랑합니다.</p>
          </div>
        </RouterLink>

        <div class="flex justify-between">
          <div>
            <Icon
              id="logout-icon"
              icon="material-symbols:logout-rounded"
              width="1.5rem"
              height="1.5rem"
              style="color: #ffffff"
            />
          </div>
          <div class="flex gap-[10px]">
            <Icon
              id="noti-icon"
              icon="material-symbols:notifications-outline"
              width="1.5rem"
              height="1.5rem"
              style="color: #ffffff"
            />
            <Icon
              id="weather-icon"
              icon="material-symbols:wb-sunny-rounded"
              width="1.5rem"
              height="1.5rem"
              style="color: #ffffff"
            />
          </div>
        </div>
      </div>

      <span class="block h-[1px] w-full bg-hc-white/30" />
    </div>

    <div
      class="mt-[1rem] bg-[rgba(255,255,255,0.5)] rounded-[1.25rem] text-[0.85rem] text-[#000] px-[0.9375rem] pt-[0.9375rem] sm:flex sm:flex-col gap-[0.3125rem] hidden"
    >
      <p>
        <span class="font-semibold">@tiffanyhansy</span> 님이 회원님을 팔로우
        했습니다.
      </p>

      <img :src="sidebarHr" alt="구분선 이미지" />
      <p>
        <span class="font-semibold">@Sooya</span>님이 회원의 게시글에 좋아요를
        눌렀습니다.
      </p>
      <img :src="sidebarHr" alt="구분선 이미지" />
      <p>
        <span class="font-semibold">@malaChild</span>님이 회원의 게시글에
        좋아요를 눌렀습니다.
      </p>
      <img :src="sidebarHr" alt="구분선 이미지" />
      <button
        class="underline text-[#757575] text-center mb-[0.5625rem] cursor-pointer"
      >
        닫기
      </button>
    </div>

    <div class="flex gap-4 py-3 xm:flex-col xm:py-[25%]">
      <RouterLink
        to="/record"
        class="bg-hc-white rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center"
      >
        <Icon
          icon="material-symbols:edit-outline"
          width="1.5rem"
          height="1.5rem"
          style="color: #729ecb"
        />
      </RouterLink>
      <RouterLink
        to="/diary"
        class="bg-hc-white rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center"
      >
        <Icon
          icon="material-symbols:book-2-outline"
          width="1.5rem"
          height="1.5rem"
          style="color: #729ecb"
        />
      </RouterLink>
    </div>

    <DropDownCommunity />
  </div>
</template>
