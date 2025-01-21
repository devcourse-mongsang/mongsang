<script setup>
import Button from "@/components/common/Button.vue";
import { ref } from "vue";
import { Icon } from "@iconify/vue";

// 사용자 더미데이터
const userData = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "@Mala_love",
  profile_bio: "저는 마라를 사랑합니다",
  profile_url: "/assets/imgs/unknownUser.png", // 프로필 이미지가 없는 경우 기본 이미지 사용
  posts_count: 10,
  followers_count: 20,
  following_count: 24,
  created_at: "2025-01-18T12:00:00Z",
  updated_at: "2025-01-18T12:30:00Z",
};

// 게시물 더미데이터
const posts = [
  {
    id: 1,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 2,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 3,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 4,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 5,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 6,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 7,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 8,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 9,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 10,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 11,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 12,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 13,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 14,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
  {
    id: 15,
    image_url: "/assets/imgs/img_placeholder.png",
    created_at: "2025-01-18T11:57:00Z",
  },
];

const buttonType = "edit";
const isFollowing = ref(false);

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value;
};

const handleFollowClick = () => {
  alert("팔로워 / 팔로잉 페이지로 이동!");
};
</script>

<template>
  <div class="w-full max-w-[1156px] mx-auto relative pt-[143.5px]">
    <div
      class="w-full h-[80vh] border-[7px] border-hc-white/50 rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] bg-hc-white/30 overflow-y-auto no-scrollbar"
      style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
    >
      <!-- 프로필 섹션 -->
      <div class="w-[830px] mx-auto pt-[138px] relative">
        <!-- 버튼 컴포넌트 사용 -->
        <template v-if="buttonType === 'edit'">
          <router-link to="/mypage/profile/edit">
            <Button
              variant="custom"
              size="md"
              class="absolute right-0 top-[138px] text-xl bg-hc-white"
            >
              프로필 편집
            </Button>
          </router-link>
        </template>

        <template v-else-if="buttonType === 'follow'">
          <button
            @click="toggleFollow"
            class="absolute right-0 top-[138px] px-6 py-2 rounded-[20px] text-xl"
            :class="
              isFollowing ? 'bg-gray-400 text-white' : 'bg-hc-blue text-white'
            "
          >
            {{ isFollowing ? "팔로잉" : "팔로우" }}
          </button>
        </template>

        <!-- 프로필 내용 -->
        <div class="flex items-start gap-10">
          <img
            :src="userData.profile_url || imgPlaceholder"
            class="w-[160px] h-[160px] rounded-full object-cover"
          />
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-8">
              <p class="text-4xl font-semibold">{{ userData.username }}</p>
            </div>
            <p class="text-[32px]">{{ userData.profile_bio }}</p>
            <div class="flex gap-12 text-[32px]">
              <p>
                게시물
                <span class="font-semibold">{{ userData.posts_count }}</span>
              </p>
              <p class="cursor-pointer" @click="handleFollowClick">
                팔로워
                <span class="font-semibold">{{
                  userData.followers_count
                }}</span>
              </p>
              <p class="cursor-pointer" @click="handleFollowClick">
                팔로잉
                <span class="font-semibold">{{
                  userData.following_count
                }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 구분선 및 게시물 헤더 -->
      <div class="w-[830px] mx-auto mt-28 relative">
        <div class="border-t border-hc-blue mb-6"></div>
        <div class="flex items-center gap-2">
          <!-- Iconify 아이콘 -->
          <Icon icon="mdi:grid" width="24" height="24" class="text-hc-blue" />
          <p class="text-2xl sm:text-xl lg:text-2xl">게시물</p>
        </div>
      </div>

      <!-- 게시물 그리드 -->
      <div
        class="w-[830px] mx-auto mt-8 grid grid-cols-3 gap-[10px] pb-[128px]"
      >
        <img
          v-for="post in posts"
          :key="post.id"
          :src="post.image_url"
          class="cursor-pointer w-[270px] h-[270px] rounded-[20px] object-cover"
        />
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
