<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";

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
    <!-- Meatballs Icon -->
    <div class="flex gap-1 cursor-pointer">
      <span class="w-1.5 h-1.5 bg-hc-gray rounded-full"></span>
      <span class="w-1.5 h-1.5 bg-hc-gray rounded-full"></span>
      <span class="w-1.5 h-1.5 bg-hc-gray rounded-full"></span>
    </div>

    <div
      v-if="isOpen"
      class="absolute right-0 z-50 w-40 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
    >
      <ul class="py-1">
        <li
          v-for="item in menuItems"
          :key="item.label"
          @click="item.action && item.action()"
          class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-hc-gray/20"
        >
          <RouterLink
            v-if="item.link"
            :to="item.link"
            class="flex items-center w-full gap-2 text-left"
          >
            <Icon
              v-if="item.icon"
              :icon="item.icon"
              :width="item.width || 20"
              :height="item.height || 20"
              :color="item.color || '#757575'"
            />
            <span>{{ item.label }}</span>
          </RouterLink>
          <div v-else class="flex items-center gap-2">
            <Icon
              v-if="item.icon"
              :icon="item.icon"
              :width="item.width || 20"
              :height="item.height || 20"
              :color="item.color || '#757575'"
            />
            <span>{{ item.label }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
