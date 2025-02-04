<script setup>
import { ref, watch } from "vue";
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";
import { useRouter } from "vue-router";
import supabase from "@/config/supabase";
import { useModalStore } from "@/store/modalStore";
import { useDarkMode } from "@/utils/darkMode";
import { Icon } from "@iconify/vue";

const modalStore = useModalStore();

const router = useRouter();

function goBack() {
  router.back();
}

function goHome() {
  router.push("/");
}

// 회원가입 입력값 상태 관리
const registerCredentials = ref({
  email: "",
  username: "",
  profile_bio: "",
  password: "",
  password_confirm: "",
});

// 오류 메시지 상태 관리
const emailError = ref("");
const usernameError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const usernameAvailable = ref(false);
const emailAvailable = ref(false);

// 비밀번호와 비밀번호 확인 입력값을 실시간으로 감지
watch(
  () => registerCredentials.value.password,
  (newPassword) => {
    const passwordRegExp =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegExp.test(newPassword)) {
      passwordError.value =
        "비밀번호는 8~16자로, 특수문자와 숫자를 최소 1개씩 포함해야 합니다.";
    } else {
      passwordError.value = "";
    }
  }
);

watch(
  () => registerCredentials.value.password_confirm,
  (newPasswordConfirm) => {
    if (newPasswordConfirm !== registerCredentials.value.password) {
      confirmPasswordError.value = "비밀번호가 일치하지 않습니다.";
    } else {
      confirmPasswordError.value = "";
    }
  }
);

// 자기소개 입력값 실시간 제어
const handleProfileBioInput = (event) => {
  const value = event.target.value;
  if (value.length > 16) {
    registerCredentials.value.profile_bio = value.slice(0, 16);
  }
};

const checkEmail = async () => {
  const email = registerCredentials.value?.email?.trim();

  if (!email) {
    emailError.value = "이메일을 입력해주세요.";
    emailAvailable.value = false; // 사용 불가능 상태
    return;
  }

  const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegExp.test(email)) {
    emailError.value = "올바른 이메일 형식이 아닙니다.";
    emailAvailable.value = false; // 사용 불가능 상태
    return;
  }

  try {
    const { data, error } = await supabase.rpc("get_user_by_email", {
      email_input: email,
    });

    if (error) throw error;

    if (data && data.length > 0) {
      emailError.value = "이미 사용 중인 이메일입니다.";
      emailAvailable.value = false; // 사용 불가능 상태
    } else {
      emailError.value = "";
      emailAvailable.value = true; // 사용 가능 상태
    }
  } catch (error) {
    console.error("이메일 확인 오류:", error.message);
    emailError.value = "이메일 확인 중 오류가 발생했습니다.";
    emailAvailable.value = false; // 사용 불가능 상태
  }
};

const checkUsername = async () => {
  const { username } = registerCredentials.value;

  // 한글, 영문, 숫자를 허용하고 4~12자 제한
  if (!username.trim() || !/^[가-힣a-zA-Z0-9]{4,12}$/.test(username)) {
    usernameError.value =
      "닉네임는 4~12자 사이여야 하며, 한글, 영문, 숫자만 사용할 수 있습니다.";
    usernameAvailable.value = false; // 사용 불가능 상태
    return;
  }

  try {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (data) {
      usernameError.value = "이미 사용 중인 닉네임입니다.";
      usernameAvailable.value = false; // 사용 불가능 상태
    } else {
      usernameError.value = "";
      usernameAvailable.value = true; // 사용 가능 상태
    }
  } catch (error) {
    console.error("닉네임 확인 오류:", error.message);
    usernameError.value = "닉네임 확인 중 오류가 발생했습니다.";
    usernameAvailable.value = false; // 사용 불가능 상태
  }
};

const register = async () => {
  const { email, username, profile_bio, password, password_confirm } =
    registerCredentials.value;

  if (
    !email.trim() ||
    !username.trim() ||
    !profile_bio.trim() ||
    !password.trim()
  ) {
    modalStore.addModal({
      title: "오류",
      content: "모든 필드를 채워주세요.",
      btnText: "확인",
      isOneBtn: true,
    });
    return;
  }

  if (password !== password_confirm) {
    confirmPasswordError.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  const passwordRegExp =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  if (!passwordRegExp.test(password)) {
    passwordError.value =
      "비밀번호는 8~16자로, \n특수문자와 숫자를 최소 1개씩 포함해야 합니다.";
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: username } },
    });

    if (error) {
      modalStore.addModal({
        title: "회원가입 실패",
        content: "회원가입 중 오류가 발생했습니다.",
        btnText: "확인",
        isOneBtn: true,
      });
      return;
    }

    if (data.user) {
      const userId = data.user.id;

      // profiles 테이블에 프로필 정보 추가
      // -> username은 oauth때문에 트리거로 만들어 둔게 있어서 중복 적용 안시키려고 따로 추가

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ profile_bio })
        .eq("id", userId);

      if (profileError) {
        modalStore.addModal({
          title: "프로필 업데이트 실패",
          content: "프로필 업데이트 중 오류가 발생했습니다.",
          btnText: "확인",
          isOneBtn: true,
        });
        return;
      }

      // 세션 제거
      await supabase.auth.signOut();

      modalStore.addModal({
        title: "회원가입 성공!",
        content: "이제 로그인하세요.",
        btnText: "확인",
        isOneBtn: true,
        onClick: () => {
          modalStore.modals = [];
          router.push("/login");
        },
      });
    }
  } catch (error) {
    console.error("회원가입 중 예외 발생:", error.message);
  }
};

const { isDark } = useDarkMode();
</script>

<template>
  <div
    id="back-ground"
    class="flex flex-col items-center justify-center max-w-full min-h-screen mx-auto bg-center bg-no-repeat bg-cover"
    :class="{
      'bg-[url(/assets/imgs/bg_circle_dark.png)]': isDark,
      'bg-[url(/assets/imgs/bg_circle_light.png)]': !isDark,
    }"
    style="background-position: center 25%"
  >
    <div
      class="fixed top-0 flex content-center justify-between w-full pt-[30px]"
    >
      <button
        class="font-bold size-8 text-hc-blue ml-[30px] dark:text-hc-dark-blue"
        @click="goBack"
      >
        <Icon
          icon="material-symbols:arrow-back-ios-new-rounded"
          width="27"
          height="27"
          class="dark:text-hc-white text-hc-blue"
        />
      </button>
      <button
        class="font-bold size-8 text-hc-blue mr-[30px] dark:text-hc-dark-blue"
        @click="goHome"
      >
        <Icon
          icon="material-symbols:home-outline-rounded"
          width="32"
          height="32"
          class="dark:text-hc-white text-hc-blue"
        />
      </button>
    </div>

    <div
      class="sm:shadow-blue w-full max-w-[641px] sm:rounded-[20px] sm:bg-hc-white/30 dark:sm:shadow-dark-blue sm:border-[7px] border-hc-white/50 flex flex-col items-center h-auto p-6 mt-10 md:h-[790px] md:p-10 justify-center"
    >
      <form
        class="flex flex-col items-center w-full mb-[50px] gap-y-5 mt-[38px]"
        @submit.prevent="register"
      >
        <div>
          <label
            class="block mb-1 ml-10 text-xl font-semibold text-hc-blue dark:text-hc-dark-blue"
            >이메일</label
          >
          <div class="w-[300px] sm:w-[480px]">
            <div class="flex items-center">
              <Input
                type="email"
                placeholder="이메일을 입력해주세요"
                v-model="registerCredentials.email"
                variant="shadowed"
                size="xs"
                borderRadius="lg"
                :isPasswordInput="true"
              />
              <Button
                variant="filled"
                size="sm"
                class="ml-2 text-sm sm:text-xl font-semibold w-[43px] max-h-[43px] sm:w-[63px] sm:h-[63px] sm:max-h-[63px]"
                @click.prevent="checkEmail"
              >
                확인
              </Button>
            </div>
          </div>
          <p v-if="emailError" class="mt-2 mx-10 text-xs sm:text-sm text-red">
            {{ emailError }}
          </p>
          <p
            v-else-if="emailAvailable"
            class="mt-2 mx-10 text-xs sm:text-sm text-green"
          >
            사용가능한 이메일입니다.
          </p>
        </div>

        <div>
          <label
            class="block mb-1 ml-10 text-xl font-semibold text-hc-blue dark:text-hc-dark-blue"
            >닉네임</label
          >
          <div class="w-[300px] sm:w-[480px]">
            <!-- 고정 너비 컨테이너 추가 -->
            <div class="flex items-center">
              <Input
                type="text"
                placeholder="4-12자"
                v-model="registerCredentials.username"
                variant="shadowed"
                size="xs"
                borderRadius="lg"
                :isPasswordInput="true"
              />
              <Button
                variant="filled"
                size="sm"
                class="ml-2 text-sm sm:text-xl font-semibold w-[43px] max-h-[43px] sm:w-[63px] sm:h-[63px] sm:max-h-[63px]"
                @click.prevent="checkUsername"
              >
                확인
              </Button>
            </div>
            <p
              v-if="usernameError"
              class="mx-10 mt-2 text-xs sm:text-sm text-red"
            >
              {{ usernameError }}
            </p>
            <p
              v-else-if="usernameAvailable"
              class="mt-2 ml-10 text-xs sm:text-sm text-green"
            >
              사용가능한 닉네임입니다.
            </p>
          </div>
        </div>

        <div>
          <label
            class="block mb-1 ml-10 text-xl font-semibold text-hc-blue dark:text-hc-dark-blue"
          >
            자기소개
          </label>
          <Input
            type="text"
            placeholder="자기소개는 최대 16자입니다."
            v-model="registerCredentials.profile_bio"
            @input="handleProfileBioInput"
            :maxlength="16"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
            :isPasswordInput="true"
          />

          <p
            class="mt-2 ml-10 text-xs sm:text-sm"
            :class="{
              'text-red': registerCredentials.profile_bio.length === 16,
              'text-green': registerCredentials.profile_bio.length < 16,
            }"
          >
            {{ registerCredentials.profile_bio.length }}/16
          </p>
        </div>
        <div>
          <label
            class="block mb-1 ml-10 text-xl font-semibold text-hc-blue dark:text-hc-dark-blue"
            >비밀번호</label
          >
          <div class="w-[300px] sm:w-[480px]">
            <!-- 고정 너비 컨테이너 추가 -->
            <Input
              type="passwordToggle"
              placeholder="8-16자 (특문, 숫자 각 1개 이상 포함)"
              v-model="registerCredentials.password"
              variant="shadowed"
              size="sm"
              borderRadius="lg"
              :isPasswordInput="true"
              class="w-full"
            />
            <p
              v-if="passwordError"
              class="mx-10 mt-2 text-xs sm:text-sm text-red"
            >
              {{ passwordError }}
            </p>
          </div>
        </div>

        <div>
          <label
            class="block mb-1 ml-10 text-xl font-semibold text-hc-blue dark:text-hc-dark-blue"
            >비밀번호 확인</label
          >
          <Input
            type="passwordToggle"
            placeholder="비밀번호를 입력해주세요"
            v-model="registerCredentials.password_confirm"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
            :isPasswordInput="true"
          />
          <p
            v-if="confirmPasswordError"
            class="mt-2 ml-10 text-xs sm:text-sm text-red"
          >
            {{ confirmPasswordError }}
          </p>
        </div>

        <Button
          variant="shadowed"
          size="lg"
          class="mt-[15px] w-[300px] sm:w-[480px] h-[53px] sm:h-[63px]"
          >회원가입</Button
        >
      </form>
    </div>
  </div>
</template>

<style scoped></style>
