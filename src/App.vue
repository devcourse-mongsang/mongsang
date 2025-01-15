<script setup></script>
<template>
  <nav class="flex gap-2">
    <RouterLink to="/">홈</RouterLink>
    <RouterLink to="/record">기록하기</RouterLink>
    <RouterLink to="/diary">일기장</RouterLink>
  </nav>
  <RouterView />
</template>
<style scoped></style>
