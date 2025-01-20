<!-- Input.vue -->
<template>
  <input
    :class="[
      'text-hc-gray bg-hc-white focus:outline-none flex items-center justify-center',
      isProfilePage ? 'w-full' : '',
      inputVar[variant],
      isProfilePage ? profileInputSize[size] : inputSize[size],
      inputBorderRadius[borderRadius],
      className,
    ]"
    v-bind="otherProps"
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Input",
  props: {
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
  },
  setup(props, { attrs }) {
    const inputVar = {
      shadowed: "shadow-blue",
      custom: "",
    };

    // 기존 사이즈 설정
    const inputSize = {
      xs: "w-[398px] h-[63px] text-[24px] pl-[40px]",
      sm: "w-[480px] h-[63px] text-[24px] pl-[40px]",
      md: "w-[615px] h-[45px] text-[20px] pl-[16px]",
      lg: "w-[830px] h-[63px] text-[24px] pl-[40px]",
      xl: "w-[941px] h-[45px] text-[20px] pl-[16px]",
    };

    // ProfileEdit 페이지용 사이즈 설정
    const profileInputSize = {
      xs: "h-[63px] md:h-[63px] text-sm md:text-xl pl-4 md:pl-[40px]",
      sm: "h-[63px] md:h-[63px] text-sm md:text-xl pl-4 md:pl-[40px]",
      md: "h-[45px] md:h-[45px] text-sm md:text-lg pl-4 md:pl-[16px]",
      lg: "h-[63px] md:h-[63px] text-sm md:text-xl pl-4 md:pl-[40px]",
      xl: "h-[45px] md:h-[45px] text-sm md:text-lg pl-4 md:pl-[16px]",
    };

    const inputBorderRadius = {
      md: "rounded-[20px]",
      lg: "rounded-[70px]",
    };

    return {
      inputVar,
      inputSize,
      profileInputSize,
      inputBorderRadius,
      otherProps: attrs,
    };
  },
});
</script>
