<script setup>
import { defineProps } from "vue";
import { Icon } from "@iconify/vue";

// items와 buttonText를 props로 선언
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  buttonText: {
    type: String,
    required: true,
    default: "filter",
  },
});
</script>

<template>
  <div class="text-center">
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn
          style="border-radius: 20px; box-shadow: none"
          color="rgba(255,255,255,0.7)"
          v-bind="props"
        >
          {{ buttonText }}
          <Icon
            icon="material-symbols:arrow-drop-down-rounded"
            width="30"
            height="30"
            class="transition-transform duration-300 hover:rotate-180"
            style="color: #729ecb"
          />
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          class="cursor-pointer"
        >
          <v-list-item-title @click="() => console.log(`${item.title}`)">{{
            item.title
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
