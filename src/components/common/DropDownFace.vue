<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { Icon } from "@iconify/vue";
import { ref } from "vue";

// 선택된 아이콘 상태
const selectedIcon = ref(
  "material-symbols:sentiment-satisfied-outline-rounded"
);

// 아이콘 리스트
const icons = [
  "material-symbols:sentiment-satisfied-outline-rounded",
  "material-symbols:sentiment-neutral-outline-rounded",
  "material-symbols:sentiment-dissatisfied-outline-rounded",
  "material-symbols:sentiment-sad-outline-rounded",
  "material-symbols:sentiment-extremely-dissatisfied-outline-rounded",
  "material-symbols:sentiment-very-satisfied-outline-rounded",
];
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="w-16 h-[45px] bg-hc-white/70 rounded-[20px] flex items-center justify-around px-2"
      >
        <!-- 선택된 아이콘 -->
        <Icon :icon="selectedIcon" class="w-6 h-6 text-hc-blue" />
        <ChevronDownIcon class="-mr-1 text-hc-blue size-5" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      appear
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 origin-top-right rounded-md shadow-lg bg-hc-white ring-1 ring-black/5 focus:outline-none"
      >
        <div class="py-1 flex flex-col items-center gap-2 p-2">
          <!-- 아이콘 리스트 -->
          <MenuItem v-for="icon in icons" :key="icon" v-slot="{ active }">
            <div
              @click="selectedIcon = icon"
              :class="[
                active ? 'bg-gray-200' : '',
                'flex items-center justify-center w-12 h-12 rounded-full cursor-pointer',
              ]"
            >
              <Icon :icon="icon" class="w-6 h-6 text-hc-blue" />
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
