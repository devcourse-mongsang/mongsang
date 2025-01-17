import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    isHamburgerOpen: false,
  }),
  actions: {
    toggleHamburger() {
      this.isHamburgerOpen = !this.isHamburgerOpen;
    },
  },
});
