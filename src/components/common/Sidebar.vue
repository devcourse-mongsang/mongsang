<script setup>
import hamberger from "../../../public/assets/icons/hamberger_icon.svg";

const menus = [
  "자유게시판",
  "초현실몽",
  "예지몽",
  "반복몽",
  "자각몽",
  "악몽",
  "길몽",
  "해몽",
];
</script>
<template>
  <input type="checkbox" id="menuicon" class="hidden peer" />

  <!-- 햄버거 메뉴 버튼 -->
  <label
    for="menuicon"
    aria-label="메뉴 열기"
    class="absolute top-0 left-0 z-20 flex items-center justify-center w-10 h-10 bg-transparent cursor-pointer mt-[30px] pl-5"
  >
    <img :src="hamberger" alt="메뉴 아이콘 입니다." class="w-6 h-6" />
  </label>

  <!-- 사이드바 -->
  <div class="h-full bg-white w-[250px] absolute left-[-250px] z-20 top-0"></div>
  <div
    id="sidebar"
    class="w-[250px] h-full bg-[#222] absolute top-0 left-[-250px] z-10 transition-all ease-in-out duration-450 peer-checked:left-0 pt-[105px] pl-5 text-white flex flex-col gap-2 opacity-20"
  >
    <div>프로필 영역</div>
    <div>알림 영역</div>
    <div>
      <ul class="flex flex-col gap-2 peer-checked:pl-10">
        <li v-for="menu in menus" :key="menu">
          <a href="#" class="block hover:text-gray-400">{{ menu }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
