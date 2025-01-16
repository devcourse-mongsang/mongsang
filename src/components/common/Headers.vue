<script setup>
import hamberger from "../../../public/assets/icons/hamberger_icon.svg";
import home from "../../../public/assets/icons/home_icon.svg";
</script>

<template>
  <input type="checkbox" id="menuicon" class="hidden peer" />
  <label for="menuicon" class="z-20" aria-label="메뉴 열기">
    <span></span>
    <span></span>
    <span></span>
  </label>

  <router-link
    to="/"
    class="absolute top-0 right-0 z-20 flex items-center justify-center w-10 h-10 bg-transparent cursor-pointer mt-[30px] mr-4"
  >
    <img :src="home" alt="홈 바로가기 아이콘 입니다." class="w-6 h-6" />
  </router-link>
</template>

<style scoped>
input[id="menuicon"] + label {
  top: 0;
  left: 0;
  margin-top: 40px;
  margin-left: 40px;
  display: block;
  width: 25px;
  height: 25px;
  position: absolute;
  cursor: pointer;
}

input[id="menuicon"] + label span {
  display: block;
  position: absolute;
  width: 25px;
  height: 2.5px;
  border-radius: 30px;
  background: white;
  transition: all 0.35s;
}

input[id="menuicon"]:checked + label span:nth-child(1) {
  transform: translateY(10.5px) rotate(45deg);
}

input[id="menuicon"]:checked + label span:nth-child(2) {
  opacity: 0;
}

input[id="menuicon"]:checked + label span:nth-child(3) {
  transform: translateY(-11.5px) rotate(-45deg);
}

input[id="menuicon"] + label span:nth-child(1) {
  top: 0;
}

input[id="menuicon"] + label span:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

input[id="menuicon"] + label span:nth-child(3) {
  bottom: 0;
}
</style>
