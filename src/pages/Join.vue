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

    <div
      class="rounded-xl shadow-blue w-[641px] flex flex-col items-center h-[766px] justify-center"
      style="
        border-radius: 20px;
        border: 7px solid rgba(255, 255, 255, 0.5);
        background: rgba(255, 255, 255, 0.3);
      "
    >
      <!--회원가입 폼 -->
      <form
        class="flex flex-col items-center w-full mb-[50px] gap-y-5 mt-[38px]"
      >
        <div>
          <label class="block mb-1 ml-10 text-2xl font-semibold text-hc-blue"
            >이메일</label
          >
          <div class="flex items-center">
            <Input
              type="email"
              placeholder="이메일을 입력해주세요"
              variant="shadowed"
              size="xs"
              borderRadius="lg"
            />

            <Button
              variant="filled"
              size="sm"
              class="ml-4 text-2xl font-semibold"
              >확인</Button
            >
          </div>
        </div>

        <div>
          <label class="block mb-1 ml-10 text-2xl font-semibold text-hc-blue"
            >아이디</label
          >
          <div class="flex items-center">
            <Input
              type="text"
              placeholder="4-12자"
              variant="shadowed"
              size="xs"
              borderRadius="lg"
            />

            <Button
              variant="filled"
              size="sm"
              class="ml-4 text-2xl font-semibold"
              >확인</Button
            >
          </div>
        </div>

        <div>
          <label class="block mb-1 ml-10 text-2xl font-semibold text-hc-blue"
            >자기소개</label
          >
          <Input
            type="text"
            placeholder="자기소개를 입력해주세요"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
          />
        </div>
        <div>
          <label class="block mb-1 ml-10 text-2xl font-semibold text-hc-blue"
            >비밀번호</label
          >
          <Input
            type="password"
            placeholder="8-16자 (특문, 숫자 각 1개 이상 포함)"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
          />
        </div>
        <div>
          <label class="block mb-1 ml-10 text-2xl font-semibold text-hc-blue"
            >비밀번호 확인</label
          >
          <Input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
          />
        </div>
        <Button variant="shadowed" size="lg" class="mt-[42px]">회원가입</Button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
