<script setup>
import DropDownCommunity from "./DropDownCommunity.vue";
import Headers from "./Headers.vue";
import logout from "../../../public/assets/icons/logout_icon.svg";
import sidebarhr from "../../../public/assets/icons/sidebar_hr.svg";
import noti from "../../../public/assets/icons/notification_icon.svg";
import activeNoti from "../../../public/assets/icons/notification_active_icon.svg";
import modeToggleBtn from "../../../public/assets/icons/mode_toggle_icon.svg";
import pencil from "../../../public/assets/icons/pencil_icon.svg";
import diary from "../../../public/assets/icons/diary_icon.svg";
</script>

<template>
  <Headers />
  <div
    id="sidebar"
    class="w-[250px] h-full absolute top-0 left-[-250px] z-10 transition-all ease-in-out duration-450 peer-checked:left-0 pt-[105px] backdrop-blur-[11px] text-white flex flex-col gap-2 rounded-[0px_30px_30px_0px] bg-gradient-to-b from-[rgba(34,193,233,0.5)] to-[rgba(184,58,155,0.4)] peer-checked:shadow-[0px_4px_74.8px_#688FB69E,0px_4px_70px_#FFF_inset] px-[30px]"
  >
    <div class="">
      <img :src="sidebarhr" />

      <div class="leading-[140%] flex gap-[10px]">
        <img
          class="h-[30px] w-[30px] rounded-full mt-[6px]"
          src="https://cdn.pixabay.com/photo/2019/11/08/11/56/kitten-4611189_1280.jpg"
          alt="사용자 프로필 이미지입니다."
        />
        <div class="mt-1">
          <p class="text-[15px] font-semibold">@Mala_love</p>
          <p class="text-xs text-[#000]">저는 마라를 사랑합니다.</p>
        </div>
      </div>
      <div class="flex justify-between mb-[7px] mt-9">
        <img :src="logout" alt="로그아웃 버튼입니다." />
        <div class="flex gap-[10.38px]">
          <img :src="noti" alt="알림 보기 버튼입니다." />
          <img :src="modeToggleBtn" alt="모드 토글 버튼입니다." />
        </div>
      </div>
      <img :src="sidebarhr" />
    </div>
    <div
      class="mt-[17px] w-[191px] bg-[rgba(255,255,255,0.5)] rounded-[20px] text-[0.85rem] text-[#000] px-[15px] pt-[15px] flex flex-col gap-[5px]"
    >
      <p>
        <span class="font-semibold">@tiffanyhansy</span> 님이 회원님을 팔로우
        했습니다.
      </p>

      <img :src="sidebarhr" />
      <p>
        <span class="font-semibold">@Sooya</span>님이 회원의 게시글에 좋아요를
        눌렀습니다.
      </p>
      <img :src="sidebarhr" />
      <p>
        <span class="font-semibold">@malaChild</span>님이 회원의 게시글에
        좋아요를 눌렀습니다.
      </p>
      <img :src="sidebarhr" />
      <button
        class="underline text-[#757575] text-center mb-[9px] cursor-pointer"
      >
        닫기
      </button>
    </div>
    <div class="flex flex-col gap-[10px] mt-[102px]">
      <RouterLink
        to="/record"
        class="bg-white rounded-full w-[30px] h-[30px] flex justify-center items-center"
      >
        <img :src="pencil" alt="꿈 기록하기 바로가기 버튼입니다." />
      </RouterLink>
      <RouterLink
        to="/diary"
        class="bg-white rounded-full w-[30px] h-[30px] flex justify-center items-center"
      >
        <img :src="diary" alt="꿈 일기장 바로가기 버튼입니다." />
      </RouterLink>
    </div>
    <nav>
      <DropDownCommunity />
    </nav>
  </div>
</template>
