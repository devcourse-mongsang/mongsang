<script setup>
import { ref, defineEmits } from "vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/24/solid";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const years = ref(Array.from({ length: 3 }, (_, i) => `${currentYear - i}년`));
const months = ref(Array.from({ length: 12 }, (_, i) => `${i + 1}월`));

const selectedYear = ref(`${currentYear}년`);
const selectedMonth = ref(`${currentMonth}월`);

const emit = defineEmits(["updateDate"]);

const selectYear = (year, close) => {
  selectedYear.value = year;
  updateSelection();
  close();
};

const selectMonth = (month, close) => {
  selectedMonth.value = month;
  updateSelection();
  close();
};

const updateSelection = () => {
  const year = parseInt(selectedYear.value.replace("년", ""), 10);
  const month = parseInt(selectedMonth.value.replace("월", ""), 10);

  const selectedDateArray = [year, month];
  emit("updateDate", selectedDateArray);
};
</script>

<template>
  <div class="flex space-x-4">
    <Menu as="div" class="relative inline-block">
      <div>
        <MenuButton
          class="inline-flex w-full justify-center items-center gap-x-1.5 rounded-3xl bg-hc-white bg-opacity-70 px-3 py-2 text-xl hover:bg-gray-50 shadow-dark-blue"
        >
          {{ selectedYear }}
          <ChevronDownIcon
            class="-mr-1 text-hc-blue size-5 dark:text-hc-dark-blue"
            aria-hidden="true"
          />
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute right-0 z-10 w-full mt-2 origin-top-right shadow-lg rounded-3xl bg-hc-white bg-opacity-70 focus:outline-none"
        >
          <div class="py-1">
            <MenuItem
              v-for="year in years"
              :key="year"
              v-slot="{ active, close }"
            >
              <a
                href="#"
                @click.prevent="selectYear(year, close)"
                :class="[
                  active
                    ? 'bg-gray-100 text-hc-black outline-none'
                    : 'text-gray-700',
                  'block px-4 py-2 text-xl',
                ]"
              >
                {{ year }}
              </a>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>

    <!-- 월 선택 -->
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton
          class="inline-flex w-full justify-center items-center gap-x-1.5 rounded-3xl bg-hc-white bg-opacity-70 px-3 py-2 text-xl shadow-dark-blue hover:bg-gray-50"
        >
          {{ selectedMonth }}
          <ChevronDownIcon
            class="-mr-1 text-hc-blue size-5 dark:text-hc-dark-blue"
            aria-hidden="true"
          />
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute right-0 z-10 w-full mt-2 overflow-y-auto origin-top-right shadow-lg rounded-3xl bg-hc-white bg-opacity-70 focus:outline-none max-h-60 no-scrollbar"
        >
          <div class="py-1">
            <MenuItem
              v-for="month in months"
              :key="month"
              v-slot="{ active, close }"
            >
              <a
                href="#"
                @click.prevent="selectMonth(month, close)"
                :class="[
                  active
                    ? 'bg-gray-100 text-gray-900 outline-none'
                    : 'text-gray-700',
                  'block px-4 py-2 text-xl',
                ]"
              >
                {{ month }}
              </a>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
