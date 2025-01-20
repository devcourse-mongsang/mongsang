<script setup>
import Calendar from "../components/common/Calender.vue";
import DropDownDiary from "../components/common/DropDownDiary.vue";
import GlassBox from "../components/common/glassBox.vue";

const springs = [
  { class: "top-left-1", style: { top: "-23px", left: "90px" } },
  { class: "top-left-2", style: { top: "-23px", left: "150px" } },
  { class: "top-right-1", style: { top: "-23px", right: "90px" } },
  { class: "top-right-2", style: { top: "-23px", right: "150px" } },
];
</script>
<template>
  <div class="container">
    <GlassBox class="custom-box">
      <div class="logo-container">
        <img
          class="logo"
          src="../../public/assets/imgs/big_logo.png"
          alt="로고 이미지입니다."
        />
      </div>
      <div class="dropdown-container">
        <DropDownDiary />
      </div>
      <div class="inner-box">
        <Calendar />
      </div>
      <div
        v-for="spring in springs"
        :key="spring.class"
        :class="['spring', spring.class]"
        :style="spring.style"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="46"
          viewBox="0 0 20 46"
          fill="none"
        >
          <path
            d="M10 10L10 36"
            stroke="#757575"
            stroke-width="20"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </GlassBox>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.custom-box {
  width: 838px;
  height: 838px;
}
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 40px;
}

.logo {
  width: 229px;
  height: 132px;
}

.dropdown-container {
  position: absolute;
  top: 140px; /* 위쪽으로 10px 마진 */
  left: 30px; /* 왼쪽 상단에 위치 */
}

.inner-box {
  width: 786px;
  height: 571px;
  margin: 35px auto 0; /* 위쪽으로 10px 마진 추가 */
  border-radius: 20px 20px 10px 10px;
  background: rgba(114, 158, 203, 0.5);
  padding: 16px;
  box-sizing: border-box;
  position: relative;
}

.spring {
  position: absolute;
}

.top-left-1 {
  top: -23px;
  left: 90px;
}

.top-left-2 {
  top: -23px;
  left: 150px;
}

.top-right-1 {
  top: -23px;
  right: 90px;
}

.top-right-2 {
  top: -23px;
  right: 150px;
}
</style>
