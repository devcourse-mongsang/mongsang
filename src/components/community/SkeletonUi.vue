<script setup>
import { useLoadingStore } from "@/store/loadingStore";
import { computed } from "vue";

const loadingStore = useLoadingStore();
const isLoading = computed(() => loadingStore.isLoading);
</script>
<template>
  <div v-if="isLoading" class="skeleton-container bg-hc-white/70">
    <div v-for="i in 6" :key="i" class="skeleton-item">
      <div class="skeleton-left">
        <div class="flex items-center gap-4">
          <div class="skeleton skeleton-author"></div>
          <div class="skeleton skeleton-author-name"></div>
        </div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-title"></div>
      </div>

      <div class="skeleton-right">
        <div class="skeleton skeleton-image"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-container {
  width: 100%;
  padding: 20px;
  margin-top: 950px;
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 20px;
}

.skeleton-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
}

.skeleton-left {
  width: 70%;
}

.skeleton-right {
  width: 25%;
}

.skeleton {
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
  margin-bottom: 10px;
}

.skeleton-title {
  height: 24px;
  width: 80%;
}

.skeleton-author {
  height: 50px;
  width: 50px;
  border-radius: 100%;
  padding-left: 20px;
}

.skeleton-author-name {
  height: 24px;
  width: 60%;
}

.skeleton-image {
  height: 100px;
  width: 100%;
  border-radius: 8px;
}

@keyframes pulse {
  0% {
    background-color: #b0b0b0;
  }
  50% {
    background-color: #d0d0d0;
  }
  100% {
    background-color: #b0b0b0;
  }
}
</style>
