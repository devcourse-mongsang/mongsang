<template>
  <div class="relative">
    <input
      :class="[
        'text-hc-gray bg-hc-white focus:outline-none flex items-center justify-center',
        isProfilePage ? 'w-full' : '',
        inputVar[variant],
        isProfilePage
          ? profileInputSize[size]
          : isPasswordInput
          ? passwordInputSize[size]
          : inputSize[size],
        inputBorderRadius[borderRadius],
        className,
      ]"
      :type="currentType"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :maxlength="maxlength"
      v-bind="otherProps"
    />
    <button
      v-if="type === 'passwordToggle'"
      type="button"
      class="absolute inset-y-0 right-3 flex items-center text-blue-500"
      @click="togglePassword"
    >
      <Icon
        :icon="isPasswordVisible ? 'tabler:eye-off' : 'tabler:eye'"
        class="w-5 h-5"
        style="color: #757575"
      />
    </button>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "Input",
  components: {
    Icon,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
      validator: (value) =>
        ["text", "password", "passwordToggle", "email"].includes(value),
    },
    variant: {
      type: String,
      validator: (value) => ["shadowed", "custom"].includes(value),
    },
    size: {
      type: String,
      required: true,
      validator: (value) => ["xs", "sm", "md", "lg", "xl"].includes(value),
    },
    borderRadius: {
      type: String,
      required: true,
      validator: (value) => ["md", "lg"].includes(value),
    },
    className: {
      type: String,
      default: "",
    },
    isProfilePage: {
      type: Boolean,
      default: false,
    },
    isPasswordInput: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: Number,
      default: null,
    },
  },
  setup(props, { attrs }) {
    const isPasswordVisible = ref(false);

    const togglePassword = () => {
      isPasswordVisible.value = !isPasswordVisible.value;
    };

    const currentType = computed(() => {
      if (props.type === "passwordToggle") {
        return isPasswordVisible.value ? "text" : "password";
      }
      return props.type;
    });

    const inputVar = {
      shadowed: "shadow-blue",
      custom: "",
    };

    const inputSize = {
      xs: "w-[198px] sm:w-[398px] h-[43px] sm:h-[63px] text-[16px] sm:text-[24px] pl-[40px]",
      sm: "w-[250px] sm:w-[480px] h-[53px] sm:h-[63px] text-[16px] sm:text-[24px] pl-[40px]",
      md: "w-[615px] h-[45px] text-[20px] pl-[16px]",
      lg: "w-[830px] h-[63px] text-[24px] pl-[40px]",
      xl: "w-[941px] h-[45px] text-[20px] pl-[16px]",
    };

    const profileInputSize = {
      xs: "h-[63px] md:h-[63px] text-sm md:text-xl pl-4 md:pl-[40px]",
      sm: "h-[63px] md:h-[63px] text-sm md:text-xl pl-4 md:pl-[40px]",
      md: "h-[45px] md:h-[45px] text-sm md:text-lg pl-4 md:pl-[16px]",
      lg: "h-[63px] md:h-[63px] text-sm md:text-xl pl-4 md:pl-[40px]",
      xl: "h-[45px] md:h-[45px] text-sm md:text-lg pl-4 md:pl-[16px]",
    };

    // 새로 추가한 비밀번호 입력 필드용 스타일
    const passwordInputSize = {
      xs: "w-[248px] sm:w-[398px] h-[43px] sm:h-[63px] text-[16px] sm:text-[24px] pl-[40px]",
      sm: "w-[300px] sm:w-[480px] h-[43px] sm:h-[63px] text-[16px] sm:text-[24px] pl-[40px]",
      md: "w-[615px] h-[45px] text-[20px] pl-[16px]",
      lg: "w-[830px] h-[63px] text-[24px] pl-[40px]",
      xl: "w-[941px] h-[45px] text-[20px] pl-[16px]",
    };

    const inputBorderRadius = {
      md: "rounded-[20px]",
      lg: "rounded-[70px]",
    };

    return {
      inputVar,
      inputSize,
      profileInputSize,
      passwordInputSize,
      inputBorderRadius,
      otherProps: attrs,
      isPasswordVisible,
      togglePassword,
      currentType,
    };
  },
});
</script>
