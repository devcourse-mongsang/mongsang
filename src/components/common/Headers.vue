<script setup>
import { useRoute } from "vue-router";
import { useSidebarStore } from "../../store/sidebar";
import { Icon } from "@iconify/vue";

const sidebarStore = useSidebarStore();
const route = useRoute();
</script>

<template>
  <!-- 상단 바 -->
  <nav
    class="flex items-center justify-between h-10 p-[30px] z-20 fixed mx-auto w-full"
  >
    <!-- 햄버거 메뉴 -->
    <div class="flex items-center">
      <input
        type="checkbox"
        id="menuicon"
        v-model="sidebarStore.isHamburgerOpen"
        class="hidden"
        @change="handleToggle"
      />
      <label
        for="menuicon"
        class="w-[24px] h-[23.5px] absolute cursor-pointer"
        aria-label="메뉴 열기"
      >
        <span
          class="block absolute w-[25px] h-[2.5px] bg-[#729ECB] rounded-full transition-all duration-300"
          :class="{
            'rotate-45 translate-y-[10.5px]': sidebarStore.isHamburgerOpen,
          }"
        ></span>
        <span
          class="block absolute top-1/2 w-[25px] h-[2.5px] bg-[#729ECB] rounded-full transition-all duration-300"
          :class="{
            'opacity-0': sidebarStore.isHamburgerOpen,
          }"
        ></span>
        <span
          class="block absolute bottom-0 w-[25px] h-[2.5px] bg-[#729ECB] rounded-full transition-all duration-300"
          :class="{
            '-rotate-45 -translate-y-[10.5px]': sidebarStore.isHamburgerOpen,
          }"
        ></span>
      </label>
    </div>

    <!-- 알림 아이콘과 홈 바로가기 -->
    <div class="flex items-center space-x-4">
      <!-- 알림 바로가기 -->
      <div id="noti-icon">
        <router-link to="/notification" class="bg-transparent cursor-pointer">
          <Icon
            id="noti-icon"
            icon="material-symbols:notifications-outline"
            width="29"
            height="29"
            style="color: #729ecb"
            class="cursor-pointer"
          />
        </router-link>
      </div>

      <!-- 홈 바로가기 -->
      <div id="home-icon">
        <router-link to="/" class="bg-transparent cursor-pointer">
          <Icon
            icon="material-symbols:home-outline-rounded"
            width="32"
            height="32"
            style="color: #729ecb"
          />
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
label span {
  display: block;
  position: absolute;
  width: 25px;
  height: 2.5px;
  background: #729ecb;
  border-radius: 30px;
  transition: all 0.35s ease;
}

/* 햄버거 버튼 초기 위치 */
label span:nth-child(1) {
  top: 0;
}

label span:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

label span:nth-child(3) {
  bottom: 0;
}
</style>
