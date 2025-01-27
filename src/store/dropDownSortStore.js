import { getLikeCount } from "@/api/api-like/api";
import { defineStore } from "pinia";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [],
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
          case "좋아요순":
            return [...state.posts].sort(
              (a, b) => (b.likeCount || 0) - (a.likeCount || 0)
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
    async fetchLikesForPosts() {
      const likeData = await Promise.all(
        this.posts.map(async (post) => {
          const likeCount = await getLikeCount(post.id);
          return { id: post.id, likeCount };
        })
      );

      // // posts 배열에 좋아요 데이터 병합
      this.posts = this.posts.map((post) => {
        const like = likeData.find((like) => like.id === post.id);
        return { ...post, likeCount: like ? like.likeCount : 0 };
      });
    },
  },
});
