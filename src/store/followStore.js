import { defineStore } from "pinia";
import supabase from "@/config/supabase";

export const useFollowStore = defineStore("followStore", {
  state: () => ({
    followers: [], // 특정 사용자의 팔로워 목록
    profileFollowing: [], // 특정 사용자가 팔로우하는 사람들 목록
    following: [], // 로그인한 사용자가 팔로우하는 사람들 목록
    allUsers: [], // 전체 사용자 목록
  }),
  actions: {
    // 로그인한 사용자가 팔로우 중인 목록 가져오기
    async fetchLoggedInUserFollowing(loggedInUserId) {
      const { data, error } = await supabase
        .from("follow")
        .select("followed_userid(id, username, profile_bio, profile_url)")
        .eq("follower_userid", loggedInUserId);

      if (!error) this.following = data.map((item) => item.followed_userid);
    },

    // 특정 사용자의 팔로워와 팔로잉 목록 가져오기
    async fetchFollowData(profileUserId) {
      const { data: followersData } = await supabase
        .from("follow")
        .select("follower_userid(id, username, profile_bio, profile_url)")
        .eq("followed_userid", profileUserId);

      const { data: followingData } = await supabase
        .from("follow")
        .select("followed_userid(id, username, profile_bio, profile_url)")
        .eq("follower_userid", profileUserId);

      // 팔로워와 팔로잉 데이터를 상태에 저장
      this.followers = followersData.map((item) => item.follower_userid);
      this.profileFollowing = followingData.map((item) => item.followed_userid);
    },

    // 전체 사용자 목록 가져오기
    async fetchAllUsers() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, profile_bio, profile_url");

      if (!error) this.allUsers = data;
    },

    // 특정 사용자가 팔로우 중인지 확인
    isUserFollowed(userId) {
      return this.following.some((user) => user.id === userId);
    },

    // 팔로우/언팔로우 토글
    async toggleFollow(loggedInUserId, user) {
      const isFollowing = this.isUserFollowed(user.id);

      if (isFollowing) {
        // 이미 팔로우 중이라면 언팔로우
        await supabase
          .from("follow")
          .delete()
          .eq("follower_userid", loggedInUserId)
          .eq("followed_userid", user.id);

        // 상태에서 해당 사용자 제거
        this.following = this.following.filter((u) => u.id !== user.id);
      } else {
        // 팔로우 상태가 아니라면 팔로우 추가
        await supabase.from("follow").insert({
          follower_userid: loggedInUserId,
          followed_userid: user.id,
        });

        // 상태에 새 사용자 추가
        this.following.push(user);
      }
    },
  },
});
