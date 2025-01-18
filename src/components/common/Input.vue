<template>
  <input
    :class="[
      'text-hc-gray bg-hc-white focus:outline-none flex items-center justify-center',
      inputVar[variant],
      inputSize[size],
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
  },
  setup(props, { attrs }) {
    const inputVar = {
      shadowed: "shadow-blue",
      custom: "",
    };

    const inputSize = {
      xs: "w-[368px] h-[63px] text-[24px] pl-[40px]",
      sm: "w-[480px] h-[63px] text-[24px] pl-[40px]",
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
      inputBorderRadius,
      otherProps: attrs,
    };
  },
});
</script>
