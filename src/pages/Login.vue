<script setup>
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import supabase from "@/config/supabase";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { useDarkMode } from "@/utils/darkMode";
import { Icon } from "@iconify/vue";

const modalStore = useModalStore();
const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const loginError = ref("");
const { isDark } = useDarkMode();

function goBack() {
  router.back();
}

function goHome() {
  router.push("/");
}

function showError(message) {
  loginError.value = message;
  console.error(message);
}

async function handleLogin() {
  if (!email.value || !password.value) {
    loginError.value = "아이디 또는 비밀번호가 잘못 되었습니다.";
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      showError("아이디 또는 비밀번호가 잘못 되었습니다.");
      return;
    }

    await authStore.setUser(data.user.id);

    modalStore.addModal({
      title: "성공",
      content: "로그인에 성공했습니다!",
      btnText: "확인",
      isOneBtn: true,
      onClick: () => {
        modalStore.modals = [];
        router.push("/");
      },
    });
  } catch (err) {
    console.error("로그인 중 오류 발생:", err.message);
    showError("아이디 또는 비밀번호가 잘못 되었습니다.");
  }
}

async function loginWithProvider(provider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: import.meta.env.VITE_PUBLIC_URL,
      },
    });

    if (error) {
      showError(`${provider} 로그인 실패: ${error.message}`);
      return;
    }

    window.location.hash = "";
    router.push("/");
  } catch (err) {
    showError(`${provider} 로그인 중 오류 발생: ${err.message}`);
  }
}

function handleSocialLogin(platform) {
  loginWithProvider(platform);
}
</script>

<template>
  <div
    id="back-ground"
    class="flex flex-col items-center justify-center max-w-full min-h-screen mx-auto bg-center bg-no-repeat bg-cover bg-[url('/assets/imgs/bg_circle_light.png')] dark:bg-[url('/assets/imgs/bg_circle_dark.png')] bg-[center_25%]"
  >
    <div
      class="fixed top-0 flex content-center justify-between w-full pt-[30px]"
    >
      <button class="font-bold size-8 text-hc-blue ml-[30px]" @click="goBack">
        <Icon
          icon="material-symbols:arrow-back-ios-new-rounded"
          width="27"
          height="27"
          class="dark:text-hc-white text-hc-blue"
        />
      </button>
      <button class="font-bold size-8 text-hc-blue mr-[30px]" @click="goHome">
        <Icon
          icon="material-symbols:home-outline-rounded"
          width="32"
          height="32"
          class="dark:text-hc-white text-hc-blue"
        />
      </button>
    </div>
    <img
      src="/assets/imgs/big_logo.png"
      alt="Mongsang light mode logo"
      class="w-[200px] sm:w-[276px] mb-2 sm:mb-7 mt-16 block dark:hidden"
    />
    <img
      src="/assets/imgs/big_logo_dark.png"
      alt="Mongsang dark mode logo"
      class="w-[200px] sm:w-[276px] mb-2 sm:mb-7 mt-16 hidden dark:block"
    />
    <div
      class="sm:rounded-[20px] sm:shadow-blue w-full max-w-[641px] flex flex-col sm:dark:shadow-dark-blue sm:bg-hc-white/30 sm:border-[7px] border-hc-white/50 items-center h-auto sm:p-6 md:h-[602px] md:p-10 justify-center bg-white/30 dark:sm:bg-[rgba(253,214,175,0.3)]"
    >
      <form
        class="flex flex-col items-center w-full mb-[30px] sm:mb-[50px]"
        @submit.prevent="handleLogin"
      >
        <div class="mb-5">
          <label
            class="block mb-1 ml-10 text-xl sm:text-2xl font-semibold text-hc-blue dark:text-hc-dark-blue"
            >이메일</label
          >
          <Input
            type="email"
            placeholder="이메일을 입력해주세요"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
            v-model="email"
          />
        </div>
        <div class="mb-[30px] sm:mb-[50px]">
          <label
            class="block mb-1 ml-10 text-xl sm:text-2xl font-semibold text-hc-blue dark:text-hc-dark-blue"
            >비밀번호</label
          >
          <Input
            type="passwordToggle"
            placeholder="비밀번호를 입력해주세요"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
            v-model="password"
          />
        </div>
        <p v-if="loginError" class="mb-5 text-red text-xm">
          {{ loginError }}
        </p>
        <Button variant="shadowed" size="lg">로그인하기</Button>
      </form>
      <div class="flex items-center justify-center space-x-4">
        <Button variant="custom" size="sm" @click="handleSocialLogin('google')">
          <img
            src="/assets/imgs/google_logo.png"
            alt="Google"
            class="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
          />
        </Button>
        <Button variant="custom" size="sm" @click="handleSocialLogin('kakao')">
          <img
            src="/assets/imgs/kakao_logo.png"
            alt="Kakao"
            class="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
          />
        </Button>
        <Button variant="custom" size="sm" @click="handleSocialLogin('gitHub')">
          <img
            src="/assets/imgs/github_logo.png"
            alt="GitHub"
            class="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
          />
        </Button>
      </div>
      <p
        class="mt-[38px] text-xl sm:text-2xl text-hc-blue dark:text-hc-dark-blue font-semibold"
      >
        <a href="/join" class="underline">회원가입</a>
      </p>
    </div>
  </div>
</template>
