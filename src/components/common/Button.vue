<template>
  <button
    :class="[
      'focus:outline-none flex items-center justify-center',
      buttonVar[variant],
      buttonSize[size],
      'hover:scale-105 active:scale-95',
      className,
      'dark:hover:scale-105 dark:active:scale-95',
    ]"
    v-bind="otherProps"
  >
    <slot />
  </button>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Button",
  props: {
    variant: {
      type: String,
      required: true,
      validator: (value) =>
        ["filled", "regular", "shadowed", "custom"].includes(value),
    },
    size: {
      type: String,
      required: true,
      validator: (value) => ["xs", "sm", "md", "lg", "xl"].includes(value),
    },

    className: {
      type: String,
      default: "",
    },
  },
  setup(props, { attrs }) {
    const buttonVar = {
      filled:
        "bg-hc-blue text-hc-white dark:bg-hc-dark-blue  dark:text-hc-white transition-all duration-300",
      regular:
        "text-hc-blue bg-hc-white dark:text-hc-dark-blue dark:bg-hc-white transition-all duration-300",
      shadowed:
        "shadow-blue bg-hc-blue text-hc-white dark:shadow-dark-blue dark:bg-hc-dark-blue transition-all duration-300",
      custom: "",
    };

    const buttonSize = {
      xs: "w-[50px] h-[50px] rounded-[70px]",
      sm: "w-[63px] h-[63px] sm:w-[63px] sm:h-[63px] rounded-[70px]",
      md: "w-[160px] h-[45px] text-[16px] rounded-[20px]",
      lg: "w-[250px] sm:w-[480px] h-[63px] text-[20px] sm:text-[24px] rounded-[70px] font-semibold",
      xl: "w-[128px] h-[45px] rounded-[20px]",
    };

    return {
      buttonVar,
      buttonSize,
      otherProps: attrs,
    };
  },
});
</script>
