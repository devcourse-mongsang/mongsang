<script setup>
import Button from "@/components/common/Button.vue";
import { ref } from "vue";
import { Icon } from "@iconify/vue";

// 사용자 더미데이터
const userData = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "@Mala_love",
  profile_bio: "저는 마라를 사랑합니다다다다다",
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
  <div
    class="w-full max-w-[1156px] mx-auto relative pt-[0px] sm:pt-[64px] sm:min-h-screen"
  >
    <div
      class="w-full sm:border-[7px] border-hc-white/50 sm:rounded-[20px] bg-hc-white/30 overflow-y-auto no-scrollbar"
      style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
    >
      <!-- 프로필 섹션과 버튼을 묶는 컨테이너 -->
      <div
        class="profile-container w-full sm:w-[830px] mx-auto pt-[48px] sm:pt-[138px] px-2 sm:px-0 flex flex-col xm:flex-row items-start gap-16 sm:gap-4"
      >
        <!-- 프로필 섹션 -->
        <div class="profile-section flex gap-4 sm:gap-12 items-start">
          <!-- 프로필 사진 -->
          <img
            :src="userData.profile_url || imgPlaceholder"
            class="w-[120px] sm:w-[160px] h-[120px] sm:h-[160px] rounded-full object-cover"
          />
          <!-- 프로필 정보 -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4 sm:gap-8">
              <p class="text-2xl sm:text-4xl font-semibold">
                {{ userData.username }}
              </p>
            </div>
            <p class="text-xm sm:text-[32px]">{{ userData.profile_bio }}</p>
            <!-- 게시물, 팔로워, 팔로잉을 묶는 컨테이너 -->
            <div class="stats-container flex gap-6 text-xm sm:text-[30px]">
              <div class="flex items-center gap-2">
                <p>게시물</p>
                <span class="font-semibold">{{ userData.posts_count }}</span>
              </div>
              <div
                class="flex items-center gap-2 cursor-pointer"
                @click="handleFollowClick"
              >
                <p>팔로워</p>
                <span class="font-semibold">{{
                  userData.followers_count
                }}</span>
              </div>
              <div
                class="flex items-center gap-2 cursor-pointer"
                @click="handleFollowClick"
              >
                <p>팔로잉</p>
                <span class="font-semibold">{{
                  userData.following_count
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 프로필 편집 버튼 -->
        <div
          class="edit-profile-btn w-full xm:w-auto flex justify-center items-center"
        >
          <template v-if="buttonType === 'edit'">
            <router-link
              to="/mypage/profile/edit"
              class="w-full xm:w-auto block"
            >
              <Button
                variant="custom"
                size="md"
                class="sm:text-hc-black text-hc-white text-xl sm:bg-hc-white bg-hc-blue w-[550px] sm:w-[160px] xm:w-[380px] sm:rounded-[20px] rounded-[30px]"
              >
                프로필 편집
              </Button>
            </router-link>
          </template>
          <template v-else-if="buttonType === 'follow'">
            <button
              @click="toggleFollow"
              class="px-6 py-2 rounded-[20px] text-xl"
              :class="
                isFollowing ? 'bg-gray-400 text-white' : 'bg-hc-blue text-white'
              "
            >
              {{ isFollowing ? "팔로잉" : "팔로우" }}
            </button>
          </template>
        </div>
      </div>

      <!-- 구분선 및 게시물 헤더 -->
      <div
        class="w-full sm:w-[830px] mx-auto xm:mt-28 mt-16 relative px-4 sm:px-0"
      >
        <div class="border-t border-hc-blue mb-6 hidden sm:block"></div>
        <div class="flex items-center gap-2">
          <!-- Iconify 아이콘 -->
          <Icon icon="mdi:grid" width="24" height="24" class="text-hc-blue" />
          <p class="text-xl sm:text-2xl">게시물</p>
        </div>
      </div>

      <!-- 게시물 그리드 -->
      <div
        class="w-full sm:w-[830px] mx-auto mt-8 grid grid-cols-3 sm:gap-[10px] gap-[0px] pb-[0px] sm:pb-[128px] sm:px-4 px-0"
      >
        <div v-for="post in posts" :key="post.id" class="aspect-w-1 aspect-h-1">
          <img
            :src="post.image_url"
            class="cursor-pointer w-full h-full rounded-[0px] sm:rounded-[20px] object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 반응형 스타일 */
.profile-container {
  display: flex;
  flex-direction: column; /* 기본적으로 세로 배치 */
  align-items: center; /* 내부 요소 가운데 정렬 */
  gap: 36px; /* 더 작은 간격 */
}

@media (min-width: 768px) {
  .profile-container {
    flex-direction: row; /* 큰 화면에서는 가로 배치 */
  }
}

.profile-section {
  display: flex;
  flex-direction: row; /* 프로필 사진과 정보는 가로 정렬 */
  align-items: flex-start;
  gap: 42px; /* 사진과 정보 사이 간격 */
}

.stats-container {
  display: flex;
  flex-direction: row; /* 게시물, 팔로워, 팔로잉을 가로 정렬 */
  gap: 20px; /* 요소들 사이 간격 */
}

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
