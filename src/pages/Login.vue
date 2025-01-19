<script setup>
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";
import { ChevronLeftIcon } from "@heroicons/vue/24/solid";
import { HomeIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
  router.back();
}

function goHome() {
  router.push("/");
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
      class="rounded-xl shadow-blue w-[641px] flex flex-col items-center h-[602px] justify-center"
      style="
        border-radius: 20px;
        border: 7px solid rgba(255, 255, 255, 0.5);
        background: rgba(255, 255, 255, 0.3);
      "
    >
      <!-- 로그인 폼 -->
      <form class="flex flex-col items-center w-full mb-[50px]">
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
          />
        </div>
        <div class="mb-[50px]">
          <label class="block mb-1 ml-10 text-2xl font-semibold text-hc-blue"
            >비밀번호</label
          >
          <Input
            type="email"
            placeholder="비밀번호를 입력해주세요"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
          />
        </div>
        <Button variant="shadowed" size="lg">로그인하기</Button>
      </form>

      <!-- 소셜 로그인 -->
      <div class="flex items-center justify-center space-x-4">
        <Button variant="custom" size="sm"
          ><img
            src="/assets/imgs/google_logo.png"
            alt="Google"
            class="w-[50px] h-[50px]"
        /></Button>
        <Button variant="custom" size="sm">
          <img
            src="/assets/imgs/kakao_logo.png"
            alt="Kakao"
            class="w-[50px] h-[50px]"
          />
        </Button>
        <Button variant="custom" size="sm">
          <img
            src="/assets/imgs/github_logo.png"
            alt="GitHub"
            class="w-[50px] h-[50px]"
          />
        </Button>
      </div>

      <!-- 회원가입 -->
      <p class="mt-[38px] text-2xl text-hc-blue">
        <a href="/join" class="underline">회원가입</a>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
