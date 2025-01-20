<script setup>
import Button from "@/components/common/Button.vue";
import { ref } from "vue";

// 더미 데이터
const userData = ref({
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "@Mala_love",
  profile_bio: "저는 마라를 사랑합니다",
  profile_url: "/assets/imgs/unknownUser.png",
  password: "",
  confirmPassword: "",
});

const handleSave = () => {
  console.log("프로필 저장:", userData.value);
};

const handleImageChange = () => {
  console.log("이미지 변경");
};
</script>

<template>
  <div class="w-full min-h-screen flex justify-center items-start">
    <!-- 메인 컨테이너 -->
    <div class="w-[1440px] relative">
      <!-- 카드 컨테이너 -->
      <div
        class="w-[996px] h-auto mx-auto mt-[148px] border-[7px] border-hc-white/50 rounded-[20px] bg-hc-white/30 relative"
        style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
      >
        <!-- 프로필 섹션 -->
        <div class="w-[830px] mx-auto pt-14">
          <div class="flex items-center justify-between">
            <!-- 프로필 정보 -->
            <div class="flex items-center gap-8">
              <!-- 프로필 이미지 -->
              <img
                :src="userData.profile_url"
                class="w-[150px] h-[150px] rounded-full object-cover"
                alt="프로필 이미지"
              />
              <!-- 아이디와 버튼 -->
              <div>
                <p class="text-4xl font-semibold">{{ userData.username }}</p>
                <p
                  class="text-2xl font-semibold text-hc-blue cursor-pointer underline mt-2"
                  @click="handleImageChange"
                >
                  사진 변경
                </p>
              </div>
            </div>
            <!-- 저장 버튼 -->
            <Button
              variant="custom"
              size="md"
              class="bg-hc-blue text-hc-white w-32"
              @click="handleSave"
            >
              저장
            </Button>
          </div>
        </div>

        <!-- 입력 필드 섹션 -->
        <div class="w-[830px] mx-auto space-y-10 mb-10 pb-14 mt-12">
          <!-- 자기소개 변경 -->
          <div>
            <p class="text-2xl font-semibold text-hc-blue mb-4">
              자기소개 변경
            </p>
            <div
              class="w-full h-[63px] rounded-[70px] bg-hc-white/80"
              style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
            >
              <input
                type="text"
                placeholder="자기소개를 입력해주세요"
                class="w-full h-full px-10 bg-transparent text-2xl text-hc-gray outline-none rounded-[70px]"
              />
            </div>
          </div>

          <!-- 비밀번호 변경 -->
          <div>
            <p class="text-2xl font-semibold text-hc-blue mb-4">
              비밀번호 변경
            </p>
            <div
              class="w-full h-[63px] rounded-[70px] bg-hc-white/80"
              style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
            >
              <input
                v-model="userData.password"
                type="password"
                placeholder="8-16자 (특문, 숫자 각 1개 이상 포함)"
                class="w-full h-full px-10 bg-transparent text-2xl text-hc-gray outline-none rounded-[70px]"
              />
            </div>
          </div>

          <!-- 비밀번호 확인 -->
          <div>
            <p class="text-2xl font-semibold text-hc-blue mb-4">
              비밀번호 확인
            </p>
            <div
              class="w-full h-[63px] rounded-[70px] bg-hc-white/80"
              style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
            >
              <input
                v-model="userData.confirmPassword"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                class="w-full h-full px-10 bg-transparent text-2xl text-hc-gray outline-none rounded-[70px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  @apply bg-hc-blue/70;
  border-radius: 20px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
