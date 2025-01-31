import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    isHamburgerOpen: false,
  }),
  actions: {
    toggleHamburger() {
      this.isHamburgerOpen = !this.isHamburgerOpen;
      console.log("Sidebar 상태 변경됨:", this.isHamburgerOpen);
    },
  },
});
