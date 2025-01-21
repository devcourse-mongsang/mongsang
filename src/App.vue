<script setup>
import { useAuthStore } from "@/store/authStore";
import { onMounted } from "vue";

const authStore = useAuthStore();

onMounted(() => {
  authStore.restoreSession(); // 세션 복구
});
</script>

<template>
  <RouterView />
</template>
