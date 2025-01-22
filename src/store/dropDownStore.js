import { defineStore } from "pinia";

export const useDropDownStore = defineStore("dropdown", {
  state: () => ({
    currentCategory: "자유게시판",
  }),
  actions: {
    setCategory(newCategory) {
      this.currentCategory = newCategory;
    },
  },
});
