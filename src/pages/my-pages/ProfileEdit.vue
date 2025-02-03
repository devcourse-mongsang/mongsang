<script setup>
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";
import { ref, watch, computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import supabase from "@/config/supabase";
import router from "@/router";
import { useModalStore } from "@/store/modalStore";

const modalStore = useModalStore();
const authStore = useAuthStore();

// 사용자 데이터
const userData = ref({
  username: authStore.profile.username || "",
  profile_bio: authStore.profile.profile_bio || "",
  profile_url: authStore.profile.profile_url || "",
  password: "",
  confirmPassword: "",
});
// 로그인 유형 확인 (이메일 로그인 여부)
const isEmailLogin = computed(() => {
  return authStore.user.app_metadata?.provider === "email";
});

// 저장 버튼 활성화 조건
const isSaveDisabled = computed(() => {
  // 비밀번호 또는 비밀번호 확인 입력값이 존재하는 경우
  if (userData.value.password || userData.value.confirmPassword) {
    // 비밀번호와 확인 비밀번호가 다르거나 에러가 있으면 비활성화
    return (
      passwordError.value ||
      confirmPasswordError.value ||
      userData.value.password !== userData.value.confirmPassword
    );
  }
  // 비밀번호 입력값이 없으면 활성화
  return false;
});

// 원본 데이터 (비교용)
const originalData = ref({ ...userData.value });
const selectedFile = ref(null); // 새로 선택된 파일
const previewImage = ref(userData.value.profile_url); // 미리보기 이미지
const passwordError = ref("");
const confirmPasswordError = ref("");
const isUpdating = ref(false); // 로딩 상태 관리

const isValidPassword = (password) => {
  const passwordRegExp =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  return passwordRegExp.test(password);
};

// 비밀번호 입력값을 실시간으로 감지
watch(
  () => userData.value.password,
  (newPassword) => {
    // 입력값이 없으면 에러 메시지를 제거
    if (!newPassword) {
      passwordError.value = ""; // 에러 메시지를 빈 문자열로 설정
      return;
    }

    // 비밀번호 유효성 검사
    if (!isValidPassword(newPassword)) {
      passwordError.value =
        "비밀번호는 8~16자로, 특수문자와 숫자를 최소 1개씩 포함해야 합니다.";
      return;
    }

    // 유효성 검사를 통과하면 에러 메시지를 제거
    passwordError.value = "";
  }
);

// 비밀번호 확인 입력값을 실시간으로 감지
watch(
  () => userData.value.confirmPassword,
  (newPasswordConfirm) => {
    // 입력값이 없으면 에러 메시지를 제거
    if (!newPasswordConfirm) {
      confirmPasswordError.value = ""; // 에러 메시지를 빈 문자열로 설정
      return;
    }

    // 입력값이 비밀번호와 일치하지 않을 경우
    if (newPasswordConfirm !== userData.value.password) {
      confirmPasswordError.value = "비밀번호가 일치하지 않습니다.";
      return;
    }

    // 유효성 검사를 통과하면 에러 메시지를 제거
    confirmPasswordError.value = "";
  }
);
// 자기소개 입력값 실시간 제어
const handleProfileBioInput = (event) => {
  const value = event.target.value;
  if (value.length > 16) {
    userData.value.profile_bio = value.slice(0, 16);
  }
};
// 사진 변경 처리 (미리보기)
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) {
    modalStore.addModal({
      title: "알림",
      content: "이미지를 선택해주세요!",
      btnText: "확인",
      isOneBtn: true,
    });
    return;
  }
  selectedFile.value = file; // 선택된 파일 저장

  // 미리보기 이미지 생성
  const reader = new FileReader();
  reader.onload = () => {
    previewImage.value = reader.result;
  };
  reader.readAsDataURL(file);
};

// 파일 이름을 안전하게 변환하는 함수
const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
};

// 프로필 저장 로직
const handleSave = async () => {
  if (isSaveDisabled.value) {
    modalStore.addModal({
      title: "알림",
      content: "비밀번호를 올바르게 입력해주세요.",
      btnText: "확인",
      isOneBtn: true,
    });
    return;
  }

  isUpdating.value = true;

  try {
    let newProfileUrl = userData.value.profile_url;

    if (selectedFile.value) {
      const sanitizedFileName = sanitizeFileName(selectedFile.value.name);
      const fileName = `user_Profile/${
        authStore.profile.id
      }/${Date.now()}_${sanitizedFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("MongSang_Img")
        .upload(fileName, selectedFile.value);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("MongSang_Img")
        .getPublicUrl(fileName);

      newProfileUrl = urlData.publicUrl;
    }

    // 비밀번호 변경은 이메일 로그인한 사용자만 처리
    if (isEmailLogin.value && userData.value.password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: userData.value.password,
      });
      if (passwordError) throw passwordError;
    }

    const updates = {};
    if (userData.value.profile_bio !== originalData.value.profile_bio) {
      updates.profile_bio = userData.value.profile_bio;
    }
    if (newProfileUrl !== originalData.value.profile_url) {
      updates.profile_url = newProfileUrl;
    }

    if (Object.keys(updates).length > 0) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", authStore.profile.id);

      if (profileError) throw profileError;
    }

    await authStore.setUser(authStore.user.id);
  } catch (err) {
    console.error(err);
    modalStore.addModal({
      title: "오류",
      content: "저장 중 오류가 발생했습니다.",
      btnText: "확인",
      isOneBtn: true,
    });
  } finally {
    isUpdating.value = false;
  }
};

const openConfirmationModal = () => {
  modalStore.addModal({
    title: "저장 확인",
    content: "저장하시겠습니까?",
    isOneBtn: false, // 취소/확인 버튼 추가
    btnText: "확인",
    onClick: () => {
      modalStore.modals = []; // 모든 모달 닫기
      handleSave(); // 저장 로직 실행
      router.push("/");
    },
  });
};
</script>

<template>
  <div
    class="flex items-start justify-center w-full min-h-screen px-4 md:px-6 lg:px-8"
  >
    <!-- 메인 컨테이너 -->
    <div class="w-full max-w-[996px] relative">
      <!-- 카드 컨테이너 -->
      <div
        class="w-full h-auto mx-auto mt-[100px] md:mt-[148px] border-[7px] border-hc-white/50 rounded-[20px] bg-hc-white/30 dark:bg-hc-beige/10 relative shadow-blue dark:shadow-dark-blue"
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
                :src="previewImage"
                class="w-[70px] h-[70px] md:w-[150px] md:h-[150px] rounded-full object-cover"
                alt="프로필 이미지"
              />
              <!-- 이미지 업로드 -->
              <div class="text-center md:text-left">
                <p
                  class="mb-3 text-lg font-semibold md:text-3xl lg:text-4xl dark:text-hc-white"
                >
                  @{{ userData.username }}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  id="fileInput"
                  @change="handleImageChange"
                />
                <label
                  for="fileInput"
                  class="mt-3 text-sm font-semibold underline cursor-pointer md:text-2xl text-hc-blue md:mt-3 dark:text-hc-dark-blue"
                >
                  사진 변경
                </label>
              </div>
            </div>
            <!-- 저장 버튼 -->
            <Button
              variant="filled"
              size="xl"
              :class="[
                'md:w-32 md:h-128 text-sm md:text-base rounded-[70px] shadow-blue dark:shadow-dark-blue',
                isSaveDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-hc-blue text-hc-white',
              ]"
              @click="openConfirmationModal"
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
            <p
              class="mb-4 text-xl font-semibold md:text-2xl text-hc-blue dark:text-hc-dark-blue"
            >
              자기소개 변경
            </p>
            <div
              class="w-full h-[50px] md:h-[63px] rounded-[70px] bg-hc-white/80 shadow-blue"
            >
              <Input
                v-model="userData.profile_bio"
                @input="handleProfileBioInput"
                :maxlength="16"
                type="text"
                placeholder="자기소개를 입력해주세요"
                size="lg"
                borderRadius="lg"
                className="text-hc-gray"
                :isProfilePage="true"
              />
            </div>

            <p
              class="mt-4 ml-5 text-xs"
              :class="{
                'text-red': userData.profile_bio.length === 16,
                'text-green': userData.profile_bio.length < 16,
              }"
            >
              {{ (userData.profile_bio || "").length }}/16
            </p>
          </div>

          <!-- 비밀번호 변경 -->
          <div v-if="isEmailLogin">
            <p
              class="mb-4 text-xl font-semibold md:text-2xl text-hc-blue dark:text-hc-dark-blue"
            >
              비밀번호 변경
            </p>
            <div
              class="w-full h-[50px] md:h-[63px] rounded-[70px] bg-hc-white/80 shadow-blue"
            >
              <Input
                v-model="userData.password"
                type="passwordToggle"
                placeholder="8-16자 (특문, 숫자 각 1개 이상 포함)"
                size="lg"
                borderRadius="lg"
                className="text-hc-gray"
                :isProfilePage="true"
              />
            </div>
            <p v-if="passwordError" class="mt-4 ml-5 text-xs text-red">
              {{ passwordError }}
            </p>
          </div>

          <!-- 비밀번호 확인 -->
          <div v-if="isEmailLogin">
            <p
              class="mb-4 text-xl font-semibold md:text-2xl text-hc-blue dark:text-hc-dark-blue"
            >
              비밀번호 확인
            </p>
            <div
              class="w-full h-[50px] md:h-[63px] rounded-[70px] bg-hc-white/80 shadow-blue"
            >
              <Input
                v-model="userData.confirmPassword"
                type="passwordToggle"
                placeholder="비밀번호를 입력해주세요"
                size="lg"
                borderRadius="lg"
                className="text-hc-gray"
                :isProfilePage="true"
              />
            </div>
            <p v-if="confirmPasswordError" class="mt-4 ml-5 text-xs text-red">
              {{ confirmPasswordError }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
