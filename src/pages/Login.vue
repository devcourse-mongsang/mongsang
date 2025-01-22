<script setup>
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";
import { ChevronLeftIcon } from "@heroicons/vue/24/solid";
import { HomeIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { ref } from "vue";
import supabase from "@/config/supabase";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";

const modalStore = useModalStore();
const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");

// 로그인 오류 메시지 상태
const loginError = ref("");

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

    // 로그인 성공 후 사용자 정보를 Pinia에 설정
    await authStore.setUser(data.user.id);

    modalStore.addModal({
      title: "성공",
      content: "로그인에 성공했습니다!",
      btnText: "확인",
      isOneBtn: true,
      onClick: () => {
        modalStore.modals = []; // 모든 모달 닫기
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
        redirectTo: "http://localhost:5173/",
      },
    });

    if (error) {
      showError(`${provider} 로그인 실패: ${error.message}`);
      return;
    }

    modalStore.addModal({
      title: "성공",
      content: `${provider} 로그인에 성공했습니다!`,
      btnText: "확인",
      isOneBtn: true,
      onClick: () => {
        modalStore.modals = []; // 모든 모달 닫기
        window.location.hash = "";
        router.push("/"); // 메인 페이지로 이동
      },
    });
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
    class="flex flex-col items-center justify-center max-w-full min-h-screen mx-auto bg-center bg-no-repeat bg-cover"
    style="
      background-image: url('/assets/imgs/bg_circle 1.png');
      background-position: center 25%;
    "
  >
    <div
      class="fixed top-0 flex content-center justify-between w-full pt-[30px]"
    >
      <button class="font-bold size-8 text-hc-blue ml-[30px]" @click="goBack">
        <ChevronLeftIcon />
      </button>
      <button class="font-bold size-8 text-hc-blue mr-[30px]" @click="goHome">
        <HomeIcon />
      </button>
    </div>
    <img
      src="/assets/imgs/big_logo.png"
      alt="Mongsang Logo"
      class="w-[276px] mb-7"
    />
    <div
      class="rounded-xl shadow-blue w-full max-w-[641px] flex flex-col items-center h-auto p-6 md:h-[602px] md:p-10 justify-center"
      style="
        border-radius: 20px;
        border: 7px solid rgba(255, 255, 255, 0.5);
        background: rgba(255, 255, 255, 0.3);
      "
    >
      <form
        class="flex flex-col items-center w-full mb-[50px]"
        @submit.prevent="handleLogin"
      >
        <div class="mb-5">
          <label class="block mb-1 ml-10 text-2xl font-semibold text-hc-blue"
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
        <div class="mb-[50px]">
          <label class="block mb-1 ml-10 text-2xl font-semibold text-hc-blue"
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
        <!-- 로그인 오류 메시지 -->
        <p v-if="loginError" class="text-red text-xm mb-5">
          {{ loginError }}
        </p>
        <Button variant="shadowed" size="lg">로그인하기</Button>
      </form>
      <div class="flex items-center justify-center space-x-4">
        <Button variant="custom" size="sm" @click="handleSocialLogin('google')">
          <img
            src="/assets/imgs/google_logo.png"
            alt="Google"
            class="w-[50px] h-[50px]"
          />
        </Button>
        <Button variant="custom" size="sm" @click="handleSocialLogin('kakao')">
          <img
            src="/assets/imgs/kakao_logo.png"
            alt="Kakao"
            class="w-[50px] h-[50px]"
          />
        </Button>
        <Button variant="custom" size="sm" @click="handleSocialLogin('gitHub')">
          <img
            src="/assets/imgs/github_logo.png"
            alt="GitHub"
            class="w-[50px] h-[50px]"
          />
        </Button>
      </div>
      <p class="mt-[38px] text-2xl text-hc-blue">
        <a href="/join" class="underline">회원가입</a>
      </p>
    </div>
  </div>
</template>
