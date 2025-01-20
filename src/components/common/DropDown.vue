<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
</script>
<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="inline-flex w-[72px] justify-center gap-x-1.5 rounded-[20px] bg-hc-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        filter
        <ChevronDownIcon
          class="-mr-1 text-gray-400 size-5"
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
        class="absolute right-0 z-10 w-56 mt-2 origin-top-right rounded-md shadow-lg bg-hc-white ring-1 ring-black/5 focus:outline-none"
      >
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              :class="[
                active
                  ? 'bg-gray-100 text-gray-900 outline-none'
                  : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
              >like</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              :class="[
                active
                  ? 'bg-gray-100 text-gray-900 outline-none'
                  : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
              >comment</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              :class="[
                active
                  ? 'bg-gray-100 text-gray-900 outline-none'
                  : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
              >latest</a
            >
          </MenuItem>
          <form method="POST" action="#">
            <MenuItem v-slot="{ active }">
              <button
                type="submit"
                :class="[
                  active
                    ? 'bg-gray-100 text-gray-900 outline-none'
                    : 'text-gray-700',
                  'block w-full px-4 py-2 text-left text-sm',
                ]"
              >
                oldest
              </button>
            </MenuItem>
          </form>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
