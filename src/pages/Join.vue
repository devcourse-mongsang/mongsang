<script setup>
import { ref, watch } from "vue";
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";
import { ChevronLeftIcon } from "@heroicons/vue/24/solid";
import { HomeIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import supabase from "@/config/supabase";
import { useModalStore } from "@/store/modalStore";

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
      "아이디는 4~12자 사이여야 하며, 한글, 영문, 숫자만 사용할 수 있습니다.";
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
      usernameError.value = "이미 사용 중인 아이디입니다.";
      usernameAvailable.value = false; // 사용 불가능 상태
    } else {
      usernameError.value = "";
      usernameAvailable.value = true; // 사용 가능 상태
    }
  } catch (error) {
    console.error("아이디 확인 오류:", error.message);
    usernameError.value = "아이디 확인 중 오류가 발생했습니다.";
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
      "비밀번호는 8~16자로, 특수문자와 숫자를 최소 1개씩 포함해야 합니다.";
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: username } },
    });

    if (error) {
      alert("회원가입 실패: " + error.message);
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
        alert("프로필 업데이트 실패: " + profileError.message);
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
      class="rounded-xl shadow-blue w-[641px] flex flex-col items-center h-[790px] justify-center"
      style="
        border-radius: 20px;
        border: 7px solid rgba(255, 255, 255, 0.5);
        background: rgba(255, 255, 255, 0.3);
      "
    >
      <form
        class="flex flex-col items-center w-full mb-[50px] gap-y-5 mt-[38px]"
        @submit.prevent="register"
      >
        <div>
          <label class="block mb-1 ml-10 text-xl font-semibold text-hc-blue"
            >이메일</label
          >
          <div class="flex items-center">
            <Input
              type="email"
              placeholder="이메일을 입력해주세요"
              v-model="registerCredentials.email"
              variant="shadowed"
              size="xs"
              borderRadius="lg"
            />
            <Button
              variant="filled"
              size="sm"
              class="ml-4 text-xl font-semibold"
              @click.prevent="checkEmail"
            >
              확인
            </Button>
          </div>
          <p v-if="emailError" class="text-red mt-2 text-xs ml-10">
            {{ emailError }}
          </p>
          <p v-else-if="emailAvailable" class="text-green text-xs ml-10 mt-2">
            사용가능한 이메일입니다.
          </p>
        </div>

        <div>
          <label class="block mb-1 ml-10 text-xl font-semibold text-hc-blue"
            >아이디</label
          >
          <div class="flex items-center">
            <Input
              type="text"
              placeholder="4-12자"
              v-model="registerCredentials.username"
              variant="shadowed"
              size="xs"
              borderRadius="lg"
            />
            <Button
              variant="filled"
              size="sm"
              class="ml-4 text-xl font-semibold"
              @click.prevent="checkUsername"
            >
              확인
            </Button>
          </div>
          <p v-if="usernameError" class="text-red mt-2 text-xs ml-10">
            {{ usernameError }}
          </p>
          <p
            v-else-if="usernameAvailable"
            class="text-green text-xs ml-10 mt-2"
          >
            사용가능한 아이디입니다.
          </p>
        </div>

        <div>
          <label class="block mb-1 ml-10 text-xl font-semibold text-hc-blue"
            >자기소개</label
          >
          <Input
            type="text"
            placeholder="자기소개를 입력해주세요"
            v-model="registerCredentials.profile_bio"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
          />
        </div>
        <div>
          <label class="block mb-1 ml-10 text-xl font-semibold text-hc-blue"
            >비밀번호</label
          >
          <Input
            type="passwordToggle"
            placeholder="8-16자 (특문, 숫자 각 1개 이상 포함)"
            v-model="registerCredentials.password"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
          />
          <p v-if="passwordError" class="text-red mt-2 text-xs ml-10">
            {{ passwordError }}
          </p>
        </div>

        <div>
          <label class="block mb-1 ml-10 text-xl font-semibold text-hc-blue"
            >비밀번호 확인</label
          >
          <Input
            type="passwordToggle"
            placeholder="비밀번호를 입력해주세요"
            v-model="registerCredentials.password_confirm"
            variant="shadowed"
            size="sm"
            borderRadius="lg"
          />
          <p v-if="confirmPasswordError" class="text-red mt-2 text-xs ml-10">
            {{ confirmPasswordError }}
          </p>
        </div>

        <Button variant="shadowed" size="lg" class="mt-[15px]">회원가입</Button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
