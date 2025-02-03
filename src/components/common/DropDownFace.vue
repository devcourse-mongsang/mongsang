<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { Icon } from "@iconify/vue";
import { ref, defineEmits, watch, defineProps } from "vue";

const props = defineProps({
  initialCondition: {
    type: String,
    default: "satified",
  },
});

// 선택된 아이콘 상태
const selectedIcon = ref("");

// 아이콘 리스트
const icons = [
  {
    icon: "material-symbols:sentiment-satisfied-outline-rounded",
    name: "satisfied",
  },
  {
    icon: "material-symbols:sentiment-neutral-outline-rounded",
    name: "neutral",
  },
  {
    icon: "material-symbols:sentiment-dissatisfied-outline-rounded",
    name: "dissatisfied",
  },
  { icon: "material-symbols:sentiment-sad-outline-rounded", name: "sad" },
  {
    icon: "material-symbols:sentiment-extremely-dissatisfied-outline-rounded",
    name: "extremely_dissatisfied",
  },
  {
    icon: "material-symbols:sentiment-very-satisfied-outline-rounded",
    name: "extremely_satisfied",
  },
];

const emit = defineEmits(["update:condition"]);

watch(
  () => props.initialCondition,
  (newCondition) => {
    const matchedIcon = icons.find((icon) => icon.name === newCondition);
    selectedIcon.value =
      matchedIcon?.icon ||
      "material-symbols:sentiment-very-satisfied-outline-rounded";
  },
  { immediate: true }
);

const selectIcon = (icon) => {
  selectedIcon.value = icon.icon;
  emit("update:condition", icon.name);
};
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="w-16 h-[45px] bg-hc-white/70 rounded-[20px] flex items-center justify-around px-2"
      >
        <!-- 선택된 아이콘 -->
        <Icon
          :icon="selectedIcon"
          class="w-6 h-6 text-hc-blue dark:text-hc-dark-blue"
        />
        <ChevronDownIcon
          class="-mr-1 text-hc-blue size-5 dark:text-hc-dark-blue"
          aria-hidden="true"
        />
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
        <div class="flex flex-col items-center gap-2 p-2 py-1">
          <!-- 아이콘 리스트 -->
          <MenuItem v-for="icon in icons" :key="icon" v-slot="{ active }">
            <div
              @click="selectIcon(icon)"
              :class="[
                active ? 'bg-gray-200' : '',
                'flex items-center justify-center w-12 h-12 rounded-full cursor-pointer',
              ]"
            >
              <Icon
                :icon="icon.icon"
                class="w-6 h-6 text-hc-blue dark:text-hc-dark-blue"
              />
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
