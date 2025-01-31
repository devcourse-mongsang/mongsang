import { defineStore } from "pinia";

export const useDiaryStore = defineStore("diary", {
  state: () => ({
    content: "",
    dreamAnalysis: "",
    imgUrl: "",
    youtubeUrl: "",
  }),
  actions: {
    setContent(newContent) {
      this.content = newContent;
    },
    setDreamAnalysis(newAnalysis) {
      this.dreamAnalysis = newAnalysis;
    },
    setImgUrl(newImgUrl) {
      this.imgUrl = newImgUrl;
    },
    setYoutubeUrl(newYoutubeUrl) {
      this.youtubeUrl = newYoutubeUrl;
    },
    resetData() {
      this.content = "";
      this.dreamAnalysis = "";
      this.imgUrl = "";
      this.youtubeUrl = "";
    },
  },
});
