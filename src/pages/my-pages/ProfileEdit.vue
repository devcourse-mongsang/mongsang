<script setup>
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";
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
  alert("사진 변경");
};
</script>

<template>
  <div
    class="w-full min-h-screen flex justify-center items-start px-4 md:px-6 lg:px-8"
  >
    <!-- 메인 컨테이너 -->
    <div class="w-full max-w-[996px] relative">
      <!-- 카드 컨테이너 -->
      <div
        class="w-full h-auto mx-auto mt-[100px] md:mt-[148px] border-[7px] border-hc-white/50 rounded-[20px] bg-hc-white/30 relative"
        style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
      >
        <!-- 프로필 섹션 -->
        <div
          class="w-full px-4 md:px-8 lg:max-w-[830px] lg:px-0 mx-auto"
          style="margin-top: 56px"
        >
          <!-- 반응형 프로필 섹션 -->
          <div
            class="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-0"
          >
            <!-- 프로필 정보 -->
            <div
              class="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8"
            >
              <!-- 프로필 이미지 -->
              <img
                :src="userData.profile_url"
                class="w-[70px] h-[70px] md:w-[150px] md:h-[150px] rounded-full object-cover"
                alt="프로필 이미지"
              />
              <!-- 아이디와 버튼 -->
              <div class="text-center md:text-left">
                <p class="text-lg md:text-3xl lg:text-4xl font-semibold">
                  {{ userData.username }}
                </p>
                <p
                  class="text-sm md:text-2xl font-semibold text-hc-blue cursor-pointer underline mt-2 md:mt-3"
                  @click="handleImageChange"
                >
                  사진 변경
                </p>
              </div>
            </div>
            <!-- 저장 버튼 -->
            <Button
              variant="custom"
              size="xl"
              class="bg-hc-blue text-hc-white md:w-32 md:h-128 text-sm md:text-base rounded-[70px] shadow-blue"
              @click="handleSave"
            >
              저장
            </Button>
          </div>
        </div>

        <!-- 입력 필드 섹션 -->
        <div
          class="w-full px-4 md:px-8 lg:max-w-[830px] lg:px-0 mx-auto space-y-6 md:space-y-10"
          style="padding-top: 48px; padding-bottom: 48px"
        >
          <!-- 자기소개 변경 -->
          <div>
            <p class="text-xl md:text-2xl font-semibold text-hc-blue mb-4">
              자기소개 변경
            </p>
            <div
              class="w-full h-[50px] md:h-[63px] rounded-[70px] bg-hc-white/80 shadow-blue"
            >
              <Input
                type="text"
                placeholder="자기소개를 입력해주세요"
                size="lg"
                borderRadius="lg"
                className="text-hc-gray"
                :isProfilePage="true"
              />
            </div>
          </div>

          <!-- 비밀번호 변경 -->
          <div>
            <p class="text-xl md:text-2xl font-semibold text-hc-blue mb-4">
              비밀번호 변경
            </p>
            <div
              class="w-full h-[50px] md:h-[63px] rounded-[70px] bg-hc-white/80 shadow-blue"
            >
              <Input
                v-model="userData.password"
                type="password"
                placeholder="8-16자 (특문, 숫자 각 1개 이상 포함)"
                size="lg"
                borderRadius="lg"
                className="text-hc-gray"
                :isProfilePage="true"
              />
            </div>
          </div>

          <!-- 비밀번호 확인 -->
          <div>
            <p class="text-xl md:text-2xl font-semibold text-hc-blue mb-4">
              비밀번호 확인
            </p>
            <div
              class="w-full h-[50px] md:h-[63px] rounded-[70px] bg-hc-white/80 shadow-blue"
            >
              <Input
                v-model="userData.confirmPassword"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                size="lg"
                borderRadius="lg"
                className="text-hc-gray"
                :isProfilePage="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
