<script setup>
import { useSidebarStore } from "../../store/sidebar"; // Pinia store import
import DropDownCommunity from "./DropDownCommunity.vue";
import { Icon } from "@iconify/vue";
import Headers from "./Headers.vue";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { onClickOutside } from "@vueuse/core";
import { useDarkMode } from "@/utils/darkMode";
import { ref } from "vue";

const modalStore = useModalStore();
const authStore = useAuthStore();
const router = useRouter();
const sidebarStore = useSidebarStore();
const { isDark, toggleDarkMode } = useDarkMode();

const sidebarRef = ref(null);

onClickOutside(sidebarRef, () => {
  if (sidebarStore.isHamburgerOpen) {
    sidebarStore.toggleHamburger();
  }
});

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

const onRecordButtonClick = () => {
  if (!authStore.profile?.id) {
    modalStore.addModal({
      title: "로그인 필요",
      content: "로그인 후 이용해주세요.",
      btnText: "로그인",
      isOneBtn: false,
      onClick: () => {
        modalStore.modals = [];
        router.push({ name: "login" });
      },
    });
    return;
  }
  router.push({ name: "record" });
};

const onDiaryButtonClick = () => {
  if (!authStore.profile?.id) {
    modalStore.addModal({
      title: "로그인 필요",
      content: "로그인 후 이용해주세요.",
      btnText: "로그인",
      isOneBtn: false,
      onClick: () => {
        modalStore.modals = [];
        router.push({ name: "login" });
      },
    });
    return;
  }
  router.push({ name: "diary" });
};
</script>

<template>
  <div ref="sidebarRef">
    <!-- 상단 바 -->
    <Headers />
    <!-- 사이드바 -->
    <div
      id="sidebar"
      :class="{
        'left-0': sidebarStore.isHamburgerOpen,
        'left-[-20rem]': !sidebarStore.isHamburgerOpen,
        'shadow-[0px_0.25rem_4.675rem_#688FB69E,0px_0.25rem_4.375rem_#FFF_inset]':
          !sidebarStore.isDarkMode && sidebarStore.isHamburgerOpen,
      }"
      class="w-[20rem] h-screen fixed top-0 z-10 transition-all ease-in-out duration-[0.45s] pt-[6.5625rem] backdrop-blur-[0.6875rem] text-white flex flex-col gap-[0.125rem] rounded-[0_1.875rem_1.875rem_0] bg-gradient-to-b from-[rgba(34,193,233,0.5)] to-[rgba(184,58,155,0.4)] dark:from-[#A6B1B7] dark:to-[#C6858D] px-[2.5rem]"
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
                class="object-cover w-10 h-10 rounded-full"
                :src="authStore.profile.profile_url"
                alt="사용자의 프로필 이미지입니다."
              />
              <div
                class="transition-all duration-300 text-hc-white dark:text-hc-dark-blue"
              >
                <p
                  class="font-semibold"
                  :style="{ fontSize: 'clamp(16px, 2.5vw, 20px)' }"
                >
                  @{{ authStore.profile.username }}
                </p>
                <p
                  class="transition-all duration-300 text-hc-black dark:text-hc-white"
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
                class="cursor-pointer"
              />
            </div>

            <!-- 테마 -->
            <div class="flex gap-[10px]">
              <Icon
                id="weather-icon"
                :icon="
                  isDark
                    ? 'material-symbols:dark-mode'
                    : 'material-symbols:wb-sunny-rounded'
                "
                width="1.5rem"
                height="1.5rem"
                style="color: #ffffff"
                class="cursor-pointer"
                @click="toggleDarkMode"
              />
            </div>
          </div>
        </div>

        <span class="block h-[1px] w-full bg-hc-white/30 mt-2.5" />
      </div>

      <div class="flex gap-4 py-3 xm:flex-col xm:py-[25%]">
        <div
          @click="onRecordButtonClick"
          class="bg-hc-white rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center hover:scale-105"
        >
          <Icon
            icon="material-symbols:edit-outline"
            width="1.5rem"
            height="1.5rem"
            class="transition-all duration-300 text-hc-blue dark:text-hc-dark-blue"
          />
        </div>
        <div
          @click="onDiaryButtonClick"
          class="bg-hc-white rounded-full w-[2.5rem] h-[2.5rem] flex justify-center items-center hover:scale-105"
        >
          <Icon
            icon="material-symbols:book-2-outline"
            width="1.5rem"
            height="1.5rem"
            class="transition-all duration-300 text-hc-blue dark:text-hc-dark-blue"
          />
        </div>
      </div>

      <DropDownCommunity />
    </div>
  </div>
</template>
<style scoped>
#sidebar {
  z-index: 10;
}
#headersRef {
  z-index: 20;
}

.object-cover {
  object-fit: cover;
}
</style>
