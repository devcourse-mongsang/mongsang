<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useSidebarStore } from "../../store/sidebar";
import { Icon } from "@iconify/vue";
import { useAuthStore } from "@/store/authStore";
import { useNotificationsStore } from "@/store/notificationsStore";
import router from "@/router";

const headersElement = ref(null);
defineExpose({ headersElement });

const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();

const isAtTop = ref(true);

const handleScroll = () => {
  isAtTop.value = window.scrollY === 0;
};

const sendToLogin = () => {
  router.push({ name: "login" });
};

const sendToMypage = () => {
  router.push({ name: "profile", params: { id: authStore.profile.id } });
};

const hasUnreadNotifications = computed(() => {
  return notificationsStore.notifications.some(
    (notification) => !notification.is_read
  );
});

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);

  if (authStore.isLoggedIn) {
    await notificationsStore.fetchNotifications(authStore.user.id);
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template ref="headersElement">
  <!-- 상단 바 -->
  <div
    class="fixed top-0 z-10 w-full transition-all duration-300 ease-in-out"
    :class="{
      'bg-hc-white/50 dark:bg-hc-gray/50 h-[0px]': isAtTop,
      'bg-hc-white/50 dark:bg-hc-gray/50 shadow-md backdrop-blur-md h-[60px]':
        !isAtTop,
    }"
  ></div>
  <nav
    class="flex items-center justify-between h-10 p-[30px] z-20 mx-auto fixed top-0 left-0 w-full"
  >
    <!-- 햄버거 메뉴 -->
    <div class="flex items-center">
      <input
        type="checkbox"
        id="menuicon"
        v-model="sidebarStore.isHamburgerOpen"
        class="hidden"
      />
      <label
        for="menuicon"
        class="w-[24px] h-[23.5px] absolute cursor-pointer"
        aria-label="메뉴 열기"
      >
        <span
          class="block absolute w-[25px] h-[2.5px] bg-hc-blue rounded-full transition-all duration-300 pointer-events-none dark:bg-hc-white"
          :class="{
            'rotate-45 translate-y-[10.5px]': sidebarStore.isHamburgerOpen,
          }"
        ></span>
        <span
          class="block absolute top-1/2 w-[25px] h-[2.5px] bg-hc-blue rounded-full transition-all duration-300 pointer-events-none dark:bg-hc-white"
          :class="{
            'opacity-0': sidebarStore.isHamburgerOpen,
          }"
        ></span>
        <span
          class="block absolute bottom-0 w-[25px] h-[2.5px] bg-hc-blue rounded-full transition-all duration-300 pointer-events-none dark:bg-hc-white"
          :class="{
            '-rotate-45 -translate-y-[10.5px]': sidebarStore.isHamburgerOpen,
          }"
        ></span>
      </label>
    </div>

    <!-- 알림 아이콘과 홈 바로가기 -->
    <div class="flex items-center space-x-4 cursor-pointer">
      <!-- 로그인 상태 노출 -->
      <div class="font-semibold text-hc-dark-blue">
        <div
          v-if="authStore.isLoggedIn && authStore.profile"
          @click="sendToMypage"
        >
          {{ authStore.profile.username }}님
        </div>
        <div v-else @click="sendToLogin">
          <p>로그인</p>
        </div>
      </div>

      <!-- 알림 바로가기 -->
      <div v-if="authStore.isLoggedIn" id="noti-icon" class="relative">
        <router-link to="/notification" class="bg-transparent cursor-pointer">
          <Icon
            id="noti-icon"
            icon="material-symbols:notifications-outline"
            width="29"
            height="29"
            class="transition-all duration-300 cursor-pointer dark:text-hc-white text-hc-blue"
          />
          <!-- Red dot for unread notifications -->
          <span
            v-if="hasUnreadNotifications"
            class="absolute top-2 right-2 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-hc-pink rounded-full"
          ></span>
        </router-link>
      </div>

      <!-- 홈 바로가기 -->
      <div id="home-icon">
        <router-link to="/" class="bg-transparent cursor-pointer">
          <Icon
            icon="material-symbols:home-outline-rounded"
            width="32"
            height="32"
            class="transition-all duration-300 cursor-pointer dark:text-hc-white text-hc-blue"
          />
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
label span {
  display: block;
  position: absolute;
  width: 25px;
  height: 2.5px;
  background: #729ecb;
  border-radius: 30px;
  transition: all 0.35s ease;
}

/* 햄버거 버튼 초기 위치 */
label span:nth-child(1) {
  top: 0;
}

label span:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

label span:nth-child(3) {
  bottom: 0;
}
</style>
