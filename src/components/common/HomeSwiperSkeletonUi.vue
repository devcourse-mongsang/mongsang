<template>
  <swiper-container
    navigation="true"
    class="mySwiper"
    initial-slide="0"
    pagination="true"
    effect="coverflow"
    grab-cursor="true"
    centered-slides="true"
    slides-per-view="auto"
    coverflow-effect-rotate="25"
    coverflow-effect-stretch="0"
    coverflow-effect-depth="300"
    coverflow-effect-modifier="1"
    coverflow-effect-slide-shadows="false"
  >
    <swiper-slide v-for="n in 5" :key="n" class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text small"></div>
    </swiper-slide>
  </swiper-container>
</template>

<style scoped>
.skeleton-card {
  width: 300px;
  height: 400px;
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-image {
  width: 100%;
  height: 70%;
  background-color: #e0e0e0;
  border-radius: 10px;
}

.skeleton-text {
  width: 80%;
  height: 15px;
  background-color: #e0e0e0;
  border-radius: 5px;
}

.skeleton-text.small {
  width: 50%;
}

@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #d0d0d0;
  }
  100% {
    background-color: #e0e0e0;
  }
}
</style>
