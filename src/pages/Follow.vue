<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { useFollowStore } from "@/store/followStore";
import { useLoadingStore } from "@/store/loadingStore";
import Button from "@/components/common/Button.vue";
import SkeletonFollow from "@/components/community/SkeletonFollow.vue";

// 스토어 설정
const authStore = useAuthStore();
const followStore = useFollowStore();
const loadingStore = useLoadingStore();

const route = useRoute();
const router = useRouter();

const viewType = route.query.viewType; // "followers" 또는 "following"
const profileUserId = route.params.id; // 현재 보고 있는 프로필 주인의 ID
const loggedInUserId = ref(null); // 로그인한 사용자 ID
const profileUsername = ref(""); // 현재 보고 있는 프로필 유저 이름

// 현재 리스트 (followers 또는 following)
const currentList = computed(() => {
  return viewType === "followers"
    ? followStore.followers
    : followStore.profileFollowing;
});

// All Users (로그인한 사용자 제외)
const allUsers = computed(() => {
  return followStore.allUsers.filter(
    (user) => user.id !== loggedInUserId.value
  );
});

// 초기 데이터 로드
const initializeData = async () => {
  loadingStore.startLoading(); // 로딩 시작
  try {
    loggedInUserId.value = authStore.profile.id;

    // 전체 사용자 데이터
    await followStore.fetchAllUsers();

    // 프로필 유저 이름 가져오기
    const profileUser = followStore.allUsers.find(
      (user) => user.id === profileUserId
    );
    profileUsername.value = profileUser ? profileUser.username : "Unknown";

    // 로그인한 유저의 팔로우 데이터
    await followStore.fetchLoggedInUserFollowing(loggedInUserId.value);

    // 프로필 주인의 팔로워/팔로잉 데이터
    await followStore.fetchFollowData(profileUserId);
  } finally {
    loadingStore.stopLoading(); // 로딩 종료
  }
};

// 팔로우 토글
const toggleFollow = async (user) => {
  await followStore.toggleFollow(loggedInUserId.value, user);

  // 현재 보고 있는 프로필이 로그인 유저의 프로필인지 확인
  if (loggedInUserId.value === profileUserId) {
    // Following 목록에 실시간으로 추가/삭제 반영
    if (followStore.isUserFollowed(user.id)) {
      followStore.profileFollowing.push(user); // 팔로잉 추가
    } else {
      followStore.profileFollowing = followStore.profileFollowing.filter(
        (u) => u.id !== user.id
      ); // 팔로잉 제거
    }
  }
};

// 프로필 이동
const goToProfile = (id) => {
  router.push(`/mypage/profile/${id}`);
};

onMounted(() => {
  initializeData();
});
</script>

<template>
  <div
    class="w-full max-w-[642px] flex flex-col justify-center items-center min-h-screen"
  >
    <!-- 로고 -->
    <div class="hidden mb-8 sm:block">
      <img
        src="/assets/imgs/big_logo.png"
        alt="Logo"
        class="block h-36 dark:hidden"
      />
      <img
        src="/assets/imgs/big_logo_dark.png"
        alt="Logo"
        class="hidden h-36 dark:block"
      />
    </div>

    <!-- 로딩 중 스켈레톤 -->
    <SkeletonFollow v-if="loadingStore.isLoading" />

    <!-- 메인 카드 -->
    <div
      v-else
      class="w-full h-[1250px] bg-hc-blue/20 sm:border-[7px] border-hc-white/50 sm:rounded-[20px] shadow-blue dark:shadow-dark-blue relative p-8 dark:bg-hc-beige/10"
    >
      <div class="flex flex-col h-full">
        <!-- 현재 리스트 (Followers / Following) -->
        <div class="flex-1 px-4">
          <h2
            class="text-2xl sm:text-[32px] font-semibold text-hc-black mb-2.5 sm:mb-6 dark:text-hc-white"
          >
            @{{ profileUsername }}'s
            {{ viewType === "followers" ? "Followers" : "Following" }}
          </h2>
          <div
            class="block mb-5 border-t border-hc-blue sm:hidden dark:border-hc-dark-blue"
          ></div>
          <div
            v-if="currentList.length > 0"
            class="flex flex-col gap-4 overflow-y-auto no-scrollbar"
            style="max-height: 500px"
          >
            <div
              v-for="user in currentList"
              :key="user.id"
              class="flex items-center justify-between p-4 bg-hc-white/50 rounded-[10px] shadow-sm"
            >
              <div
                class="flex items-center gap-4 cursor-pointer"
                @click="goToProfile(user.id)"
              >
                <img
                  :src="user.profile_url"
                  :alt="user.username"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p
                    class="font-semibold text-xm sm:text-xl dark:text-hc-dark-blue"
                  >
                    @{{ user.username }}
                  </p>
                  <p
                    class="mr-4 text-base text-gray-600 dark:text-hc-dark-blue"
                  >
                    {{ user.profile_bio }}
                  </p>
                </div>
              </div>
              <!-- 로그인 유저의 팔로우 여부 표시 -->
              <Button
                v-if="user.id !== loggedInUserId"
                @click.stop="toggleFollow(user)"
                :variant="
                  followStore.isUserFollowed(user.id) ? 'regular' : 'filled'
                "
                size="xl"
                class="max-w-16 sm:max-w-32"
              >
                {{ followStore.isUserFollowed(user.id) ? "팔로잉" : "팔로우" }}
              </Button>
            </div>
          </div>
          <div v-else class="flex flex-col items-center mt-16">
            <p class="text-lg text-gray-500">
              {{
                viewType === "followers"
                  ? "팔로워한 유저가 없습니다."
                  : "팔로잉한 유저가 없습니다."
              }}
            </p>
          </div>
        </div>

        <!-- All Users -->
        <div class="flex-1 px-4 sm:pt-4">
          <h2
            class="text-2xl sm:text-[32px] font-semibold text-hc-black mb-2.5 sm:mb-6 dark:text-hc-white"
          >
            All Users
          </h2>
          <div
            class="block mb-5 border-t border-hc-blue sm:hidden dark:border-hc-dark-blue"
          ></div>
          <div
            v-if="allUsers.length > 0"
            class="flex flex-col gap-4 overflow-y-auto no-scrollbar"
            style="max-height: 500px"
          >
            <div
              v-for="user in allUsers"
              :key="user.id"
              @click="goToProfile(user.id)"
              class="flex items-center justify-between p-4 rounded-[10px]"
              style="background-color: rgba(255, 255, 255, 0.5) !important"
            >
              <div class="flex items-center gap-4">
                <img
                  :src="user.profile_url"
                  :alt="user.username"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p
                    class="text-xm sm:text-xl font-semibold dark:text-hc-dark-blue"
                  >
                    @{{ user.username }}
                  </p>
                  <p
                    class="mr-4 text-base text-hc-black dark:text-hc-dark-blue"
                  >
                    {{ user.profile_bio }}
                  </p>
                </div>
              </div>
              <Button
                @click.stop="toggleFollow(user)"
                :variant="
                  followStore.isUserFollowed(user.id) ? 'regular' : 'filled'
                "
                size="xl"
                class="max-w-16 sm:max-w-32"
              >
                {{ followStore.isUserFollowed(user.id) ? "팔로잉" : "팔로우" }}
              </Button>
            </div>
          </div>
          <div v-else class="flex flex-col items-center mt-16">
            <p class="text-lg text-gray-500">표시할 유저가 없습니다.</p>
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
@media (min-width: 768px) {
}

.object-cover {
  object-fit: cover;
}
</style>
