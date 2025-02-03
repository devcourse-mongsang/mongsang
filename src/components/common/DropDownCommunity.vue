<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import sidebarhr from "../../../public/assets/icons/sidebar_hr.svg";

import { Icon } from "@iconify/vue";
const menus = [
  { name: "자유게시판", path: "/community/free-board" },
  { name: "초현실몽", path: "/community/surreal-dream" },
  { name: "예지몽", path: "/community/prophetic-dream" },
  { name: "반복몽", path: "/community/recurrent-dream" },
  { name: "자각몽", path: "/community/lucid-dream" },
  { name: "악몽", path: "/community/nightmare" },
  { name: "길몽", path: "/community/good-dream" },
  { name: "해몽", path: "/community/dream-interpretation" },
];

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".dropdown-container")) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Transition 훅 정의
const beforeEnter = (el) => {
  el.style.maxHeight = "0";
  el.style.opacity = "0";
};

const enter = (el, done) => {
  el.offsetHeight; // Reflow hack
  el.style.transition = "max-height 0.8s ease-out, opacity 0.8s ease";
  el.style.maxHeight = "500px"; // 원하는 최대 높이
  el.style.opacity = "1";
  done();
};

const leave = (el, done) => {
  el.style.transition = "max-height 0.3s ease-in, opacity 0.3s ease-in";
  el.style.maxHeight = "0";
  el.style.opacity = "0";
  done();
};
</script>

<template>
  <div class="relative inline-block dropdown-container">
    <Icon
      icon="material-symbols:groups-outline"
      width="50"
      height="50"
      style="color: #ffffff"
    />

    <img :src="sidebarhr" />
    <button
      @click="toggleDropdown"
      class="flex items-center justify-between w-full mt-2 transition text-hc-white"
    >
      <p class="font-semibold text-[18px]">커뮤니티</p>
      <Icon
        icon="material-symbols:arrow-drop-down-rounded"
        width="30"
        height="30"
        class="transition-transform duration-300"
        :class="{ 'rotate-180': isDropdownOpen, 'rotate-0': !isDropdownOpen }"
      />
    </button>

    <transition
      name="dropdown"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div v-if="isDropdownOpen" class="absolute w-48 mt-2 overflow-hidden">
        <ul class="flex flex-col sm:mt-2">
          <li v-for="menu in menus" :key="menu.name">
            <RouterLink
              :to="menu.path"
              class="block text-hc-white hover:text-hc-blue hover:bg-hc-white dark:hover:text-hc-dark-blue px-[19px] rounded-full pt-1 pb-[6px] transition-colors duration-500 ease-in-out"
              >{{ menu.name }}</RouterLink
            >
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* 슬라이딩 애니메이션 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: max-height 0.3s ease-out, opacity 0.3s ease;
}
.dropdown-enter, .dropdown-leave-to /* .dropdown-leave-active in <2.1.8 */ {
  max-height: 0;
  opacity: 0;
}
.dropdown-enter-to, .dropdown-leave /* .dropdown-leave-active in <2.1.8 */ {
  max-height: 500px; /* 원하는 최대 높이로 설정 */
  opacity: 1;
}
</style>
