<script setup>
const imgPlaceholder = "/assets/imgs/img_placeholder.png";
</script>
<template>
  <div class="calendar-container">
    <div class="grid grid-cols-7 text-center text-20px second-font">
      <div class="text-hc-coral">sun</div>
      <div class="text-hc-white">mon</div>
      <div class="text-hc-white">tue</div>
      <div class="text-hc-white">wed</div>
      <div class="text-hc-white">thu</div>
      <div class="text-hc-white">fri</div>
      <div class="text-hc-coral">sat</div>
    </div>
    <div class="calendar-grid">
      <div v-for="i in 35" :key="i" class="calendar-cell">
        <img :src="imgPlaceholder" alt="placeholder" class="placeholder-img" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.text-20px {
  font-size: 20px;
}
.second-font {
  font-family: "Cafe24Meongi-B-v1.0", sans-serif;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 2px;
  column-gap: 7px;
  margin-top: 10px;
}

.calendar-cell {
  width: 100px;
  height: 100px;
  background-color: white;
  border: none;
  box-sizing: border-box;
}
</style>
