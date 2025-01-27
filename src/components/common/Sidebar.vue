<script setup>
import { useSidebarStore } from "../../store/sidebar"; // Pinia store import
import DropDownCommunity from "./DropDownCommunity.vue";
import { Icon } from "@iconify/vue";
import Headers from "./Headers.vue";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";

const modalStore = useModalStore();
const authStore = useAuthStore();
const sidebarStore = useSidebarStore(); // Pinia store 초기화
const router = useRouter();

async function handleLogout() {
  modalStore.addModal({
    title: "로그아웃",
    content: "로그아웃 하시겠습니까?",
    btnText: "확인",
    cancelBtnText: "취소",
    isOneBtn: false,
    onClick: async () => {
      const success = await authStore.logout();
      if (success) {
        modalStore.modals = [];
        router.push("/");
      }
    },
  });
}
</script>

<template>
  <!-- 상단 바 -->
  <Headers />
  <!-- 사이드바 -->
  <div
    id="sidebar"
    :class="{
      'left-0 shadow-[0px_0.25rem_4.675rem_#688FB69E,0px_0.25rem_4.375rem_#FFF_inset]':
        sidebarStore.isHamburgerOpen,
      'left-[-20rem]': !sidebarStore.isHamburgerOpen,
    }"
    class="w-[20rem] h-screen fixed top-0 z-10 transition-all ease-in-out duration-[0.45s] pt-[6.5625rem] backdrop-blur-[0.6875rem] text-white flex flex-col gap-[0.125rem] rounded-[0_1.875rem_1.875rem_0] bg-gradient-to-b from-[rgba(34,193,233,0.5)] to-[rgba(184,58,155,0.4)] px-[2.5rem]"
  >
    <!-- 사이드바 콘텐츠 -->
    <div>
      <span class="block h-[1px] w-full bg-hc-white/30" />
      <div>
        <!-- 로그인 상태 -->
        <div v-if="authStore.user" class="py-[10px] flex flex-col gap-[15px]">
          <RouterLink
            class="flex items-center gap-[10px] hover:opacity-80"
            :to="`/mypage/profile/${authStore.user.id}`"
          >
            <img
              class="w-10 h-10 rounded-full"
              :src="authStore.profile.profile_url"
              alt="사용자의 프로필 이미지입니다."
            />
            <div class="text-hc-white">
              <p
                class="font-semibold"
                :style="{ fontSize: 'clamp(16px, 2.5vw, 20px)' }"
              >
                @{{ authStore.profile.username }}
              </p>
              <p
                class="text-hc-black"
                :style="{ fontSize: 'clamp(10px, 2vw, 13px)' }"
              >
                {{ authStore.profile.profile_bio }}
              </p>
            </div>
          </RouterLink>
        </div>

        <!-- 비로그인 상태 -->
        <div v-else class="py-[10px] flex flex-col gap-[15px]">
          <RouterLink
            class="flex items-center gap-[10px] hover:opacity-80"
            to="/login"
          >
            <img
              class="w-10 h-10 rounded-full"
              src="/assets/imgs/unknownUser.png"
              alt="알 수 없는 사용자 이미지입니다."
            />
            <button
              class="text-hc-white font-semibold hover:underline text-[20px]"
            >
              로그인
            </button>
          </RouterLink>
        </div>

        <div class="flex justify-between">
          <div>
            <Icon
              v-if="authStore.user"
              id="logout-icon"
              icon="material-symbols:logout-rounded"
              @click="handleLogout"
              width="1.5rem"
              height="1.5rem"
              style="color: #ffffff"
            />
          </div>
          <div class="flex gap-[10px]">
            <Icon
              id="weather-icon"
              icon="material-symbols:wb-sunny-rounded"
              width="1.5rem"
              height="1.5rem"
              style="color: #ffffff"
            />
          </div>
        </div>
      </div>

      <span class="block h-[1px] w-full bg-hc-white/30 mt-2.5" />
    </div>

    <div class="flex gap-4 py-3 xm:flex-col xm:py-[25%]">
      <RouterLink
        to="/record"
        class="bg-hc-white rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center"
      >
        <Icon
          icon="material-symbols:edit-outline"
          width="1.5rem"
          height="1.5rem"
          style="color: #729ecb"
        />
      </RouterLink>
      <RouterLink
        to="/diary"
        class="bg-hc-white rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center"
      >
        <Icon
          icon="material-symbols:book-2-outline"
          width="1.5rem"
          height="1.5rem"
          style="color: #729ecb"
        />
      </RouterLink>
    </div>

    <DropDownCommunity />
  </div>
</template>
