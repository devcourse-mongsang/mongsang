import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    modals: [], // 여러 모달을 배열로 관리
  }),
  actions: {
    addModal(opts) {
      this.modals.push({
        id: Date.now(), // 고유 ID 생성
        title: "",
        content: "",
        btnText: "확인",
        isOneBtn: true,
        onClick: null,
        ...opts,
      });
    },
    removeModal(id) {
      this.modals = this.modals.filter((modal) => modal.id !== id);
    },
  },
});
