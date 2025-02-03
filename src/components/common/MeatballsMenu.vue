<script setup>
import { ref, onMounted, onUnmounted } from "vue";

defineProps(["menuItems"]);

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenuOnOutsideClick = (event) => {
  const dropdown = document.querySelector(".dropdown-container");
  if (dropdown && !dropdown.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", closeMenuOnOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener("click", closeMenuOnOutsideClick);
});
</script>

<template>
  <div
    class="relative inline-block dropdown-container"
    @click.stop="toggleMenu"
  >
    <div class="flex gap-1 cursor-pointer">
      <span class="w-1.5 h-1.5 bg-hc-gray rounded-full"></span>
      <span class="w-1.5 h-1.5 bg-hc-gray rounded-full"></span>
      <span class="w-1.5 h-1.5 bg-hc-gray rounded-full"></span>
    </div>

    <div
      v-if="isOpen"
      class="absolute right-0 z-50 w-[190px] mt-2 bg-white border border-gray-200 rounded-[20px] shadow-lg"
    >
      <ul class="py-5">
        <li
          v-for="item in menuItems"
          :key="item.label"
          @click="item.action && item.action()"
          class="flex items-center justify-center gap-2 text-center text-gray-700 cursor-pointer"
        >
          <RouterLink
            v-if="item.link"
            :to="item.link"
            class="flex items-center justify-center gap-2 mx-auto text-left border-b-[1px] border-hc-blue w-[150px] pb-3"
          >
            <span class="hover:text-hc-gray/60">{{ item.label }}</span>
          </RouterLink>

          <div v-else class="flex items-center gap-2 text-hc-coral">
            <span class="pt-3 hover:text-hc-coral/60">{{ item.label }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
