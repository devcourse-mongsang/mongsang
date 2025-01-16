<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

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
</script>

<template>
  <div class="relative inline-block dropdown-container">
    <button @click="toggleDropdown" class="text-white transition">
      커뮤니티
    </button>
    <div v-show="isDropdownOpen" class="absolute w-48 mt-2">
      <ul class="flex flex-col gap-2 mt-2 ml-4 peer-checked:pl-10">
        <li v-for="menu in menus" :key="menu.name">
          <RouterLink
            :to="menu.path"
            class="block hover:text-gray-400"
            @click="closeDropdown"
            >{{ menu.name }}</RouterLink
          >
        </li>
      </ul>
    </div>
  </div>
</template>
