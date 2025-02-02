import { ref, watchEffect } from "vue";

export function useDarkMode() {
  const isDark = ref(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  watchEffect(() => {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  return { isDark, toggleDarkMode: () => (isDark.value = !isDark.value) };
}
