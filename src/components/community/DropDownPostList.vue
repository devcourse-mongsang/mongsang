<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { usePostsStore } from "@/store/dropDownSortStore";

const postsStore = usePostsStore();

const options = ["최신순", "작성순", "좋아요순"];

function selectSort(option) {
  postsStore.setSortKey(option); // Pinia 스토어의 sortKey 업데이트
}
</script>

<template>
  <div>
    <Menu
      as="div"
      class="relative inline-block text-left bg-hc-white/70 rounded-[20px]"
    >
      <div>
        <MenuButton
          class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium rounded-md"
        >
          {{ postsStore.sortKey }}
          <!-- 현재 선택된 항목 표시 -->
          <ChevronDownIcon
            class="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute right-0 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-xl outline-none ring-black/5"
        >
          <div class="px-1 py-1">
            <MenuItem
              v-for="(option, index) in options"
              :key="index"
              v-slot="{ active }"
            >
              <button
                @click="selectSort(option)"
                :class="[
                  active ? 'bg-hc-black/30 text-hc-white' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                {{ option }}
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
