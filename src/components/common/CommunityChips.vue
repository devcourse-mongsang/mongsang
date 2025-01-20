<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const tags = ref([
  { name: "자유게시판", route: "/community/free-board" },
  { name: "초현실몽", route: "/community/surreal-dream" },
  { name: "예지몽", route: "/community/prophetic-dream" },
  { name: "반복몽", route: "/community/recurrent-dream" },
  { name: "자각몽", route: "/community/lucid-dream" },
  { name: "악몽", route: "/community/nightmare" },
  { name: "길몽", route: "/community/good-dreams" },
  { name: "해몽", route: "/community/dream-interpretation" },
]);
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <div class="text-center" v-for="(tag, index) in tags" :key="index">
      <RouterLink :to="tag.route">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-chip
              v-bind="props"
              :color="isHovering ? '#4C6F9A' : 'indigo'"
              :variant="isHovering ? 'flat' : 'tonal'"
            >
              <Icon
                icon="material-symbols:tag-rounded"
                width="24"
                height="24"
              />
              {{ tag.name }}
            </v-chip>
          </template>
        </v-hover>
      </RouterLink>
    </div>
  </div>
</template>
<style scoped></style>
