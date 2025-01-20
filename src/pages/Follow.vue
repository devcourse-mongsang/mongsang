<script setup>
import { ref } from "vue";
import Button from "@/components/common/Button.vue";

// 더미 데이터 - 모든 사용자
const allUsers = ref([
  {
    id: 1,
    username: "@Mala_love",
    bio: "저는 마라를 사랑합니다",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: false,
  },
  {
    id: 2,
    username: "@HotPot_Chef",
    bio: "마라탕 요리사입니다",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: false,
  },
  {
    id: 3,
    username: "@Spicy_Food",
    bio: "매운 음식 전문가",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: false,
  },
  {
    id: 4,
    username: "@Food_Lover",
    bio: "저는 마라를 사랑합니다",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: false,
  },
  {
    id: 5,
    username: "@Cooking_Pro",
    bio: "저는 마라를 사랑합니다",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: false,
  },
  {
    id: 6,
    username: "@Cooking_Pro",
    bio: "요리 전문가",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: false,
  },
]);

// 친구 목록 (이미 팔로우한 사용자)
const friends = ref([
  {
    id: 7,
    username: "@Best_Friend1",
    bio: "오랜 친구",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: true,
  },
  {
    id: 8,
    username: "@Best_Friend2",
    bio: "오랜 친구",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: true,
  },
  {
    id: 9,
    username: "@Best_Friend3",
    bio: "오랜 친구",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: true,
  },
  {
    id: 10,
    username: "@Best_Friend4",
    bio: "오랜 친구",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: true,
  },
  {
    id: 11,
    username: "@Best_Friend5",
    bio: "오랜 친구",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: true,
  },
  {
    id: 12,
    username: "@Best_Friend6",
    bio: "오랜 친구",
    profileImage: "/assets/imgs/unknownUser.png",
    isFollowing: true,
  },
]);

const toggleFollow = (user) => {
  user.isFollowing = !user.isFollowing;
};
</script>

<template>
  <div class="flex flex-col justify-center items-center min-h-screen">
    <!-- Logo Section -->
    <div class="mb-8">
      <img src="/assets/imgs/big_logo.png" alt="Logo" class="h-36" />
    </div>

    <div
      class="w-[642px] h-[1250px] bg-hc-white/30 border-[7px] border-hc-white/50 rounded-[20px] relative p-8"
      style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
    >
      <div class="flex flex-col h-full">
        <!-- Friends Section -->
        <div class="flex-1 px-4">
          <h2 class="text-[32px] font-semibold text-hc-black mb-6">Friends</h2>
          <div
            class="flex flex-col gap-4 overflow-y-auto no-scrollbar"
            style="max-height: 500px"
          >
            <div
              v-for="friend in friends"
              :key="friend.id"
              class="flex items-center justify-between p-4 bg-hc-white/50 rounded-[10px] shadow-sm"
            >
              <div class="flex items-center gap-4">
                <img
                  :src="friend.profileImage"
                  :alt="friend.username"
                  class="w-12 h-12 rounded-full"
                />
                <div>
                  <p class="text-xl font-semibold">{{ friend.username }}</p>
                  <p class="text-base text-gray-600">{{ friend.bio }}</p>
                </div>
              </div>
              <Button
                @click="toggleFollow(friend)"
                :variant="friend.isFollowing ? 'regular' : 'filled'"
                size="xl"
              >
                {{ friend.isFollowing ? "팔로잉" : "팔로우" }}
              </Button>
            </div>
          </div>
        </div>

        <!-- All Users Section -->
        <div class="flex-1 px-4 pt-4">
          <h2 class="text-[32px] font-semibold text-hc-black mb-6">
            All users
          </h2>
          <div
            class="flex flex-col gap-4 overflow-y-auto no-scrollbar"
            style="max-height: 500px"
          >
            <div
              v-for="user in allUsers"
              :key="user.id"
              class="flex items-center justify-between p-4 bg-hc-white/50 rounded-[10px] shadow-sm"
            >
              <div class="flex items-center gap-4">
                <img
                  :src="user.profileImage"
                  :alt="user.username"
                  class="w-12 h-12 rounded-full"
                />
                <div>
                  <p class="text-xl font-semibold">{{ user.username }}</p>
                  <p class="text-base text-hc-black">{{ user.bio }}</p>
                </div>
              </div>
              <Button
                @click="toggleFollow(user)"
                :variant="user.isFollowing ? 'regular' : 'filled'"
                size="xl"
              >
                {{ user.isFollowing ? "팔로잉" : "팔로우" }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* 스크롤바 숨기기 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
