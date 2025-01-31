<script setup>
import { useAuthStore } from "@/store/authStore";
import { onMounted } from "vue";
import Modal from "./components/common/Modal.vue";
const authStore = useAuthStore();

onMounted(() => {
  authStore.restoreSession(); // 세션 복구
});
</script>

<template>
  <RouterView />
  <Modal />
</template>
