import { defineStore } from "pinia";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [], // 초기 post 리스트
    sortKey: "최신순",
  }),
  getters: {
    sortedPosts: (state) => {
      return (sortKey) => {
        switch (sortKey) {
          case "작성순":
            return [...state.posts].sort(
              (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
          case "최신순":
            return [...state.posts].sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
          default:
            return state.posts;
        }
      };
    },
  },
  actions: {
    setPosts(posts) {
      this.posts = posts;
    },
    setSortKey(key) {
      this.sortKey = key;
    },
  },
});
