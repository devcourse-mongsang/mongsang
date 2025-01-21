<script setup>
import Calender from "../components/common/Calender.vue";
import DropDownDiary from "../components/common/DropDownDiary.vue";
import GlassBox from "../components/common/GlassBox.vue";
import { ref } from "vue";

const selectedDate = ref([new Date().getFullYear(), new Date().getMonth() + 1]);

const updateDate = (dateArray) => {
  selectedDate.value = dateArray;
  console.log("업데이트된 날짜:", selectedDate.value);
};

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
        <DropDownDiary @updateDate="updateDate" />
      </div>
      <div class="inner-box">
        <Calender
          :year="selectedDate[0]"
          :month="selectedDate[1]"
          class="calender-center"
        />
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
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
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
  top: 140px;
  left: 30px;
}

.inner-box {
  width: 786px;
  margin: 35px auto 0;
  border-radius: 20px 20px 10px 10px;
  background: rgba(114, 158, 203, 0.5);
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 10px;
  padding-bottom: 10px;
}
.calender-center {
  align-items: center;
  margin-bottom: 2px;
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
