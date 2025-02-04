<script setup>
import Button from "@/components/common/Button.vue";
import { ref, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import supabase from "@/config/supabase";
import { useModalStore } from "@/store/modalStore";

// 라우트에서 사용자 ID 가져오기
const route = useRoute();
const router = useRouter();
const userId = ref(route.params.id); // URL에서 유저 ID 추출
const modalStore = useModalStore();

// 인증된 사용자 정보
const authStore = useAuthStore();
const loggedInUserId = authStore.profile?.id ?? null; // 로그인하지 않았을 때 null 설정

// 사용자 데이터
const userData = ref({
  profile_url: "",
  username: "",
  profile_bio: "",
  posts_count: 0,
  followers_count: 0,
  following_count: 0,
});

// 게시물 데이터
const posts = ref([]);

// 팔로우 상태
const isFollowing = ref(false);

// 사용자 정보 가져오기
const fetchUserData = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, profile_bio, profile_url, created_at, updated_at")
      .eq("id", userId.value) // ref로 변경된 userId 사용
      .single();

    if (error) throw error;

    const { count: posts_count } = await supabase
      .from("community")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userId.value);

    const { count: followers_count } = await supabase
      .from("follow")
      .select("*", { count: "exact", head: true })
      .eq("followed_userid", userId.value); // followed_userid 기준으로 팔로워 수를 조회

    const { count: following_count } = await supabase
      .from("follow")
      .select("*", { count: "exact", head: true })
      .eq("follower_userid", userId.value); // follower_userid 기준으로 팔로잉 수를 조회

    userData.value = { ...data, posts_count, followers_count, following_count };
  } catch (error) {
    console.error("사용자 정보 로드 실패:", error.message);
  }
};

// 팔로우 상태 확인 (로그인한 경우만 실행)
const checkFollowStatus = async () => {
  if (!loggedInUserId) return;

  try {
    const { data, error } = await supabase
      .from("follow")
      .select("*")
      .eq("follower_userid", loggedInUserId)
      .eq("followed_userid", userId.value);

    if (error) throw error;

    isFollowing.value = data.length > 0;
  } catch (error) {
    console.error("팔로우 상태 확인 실패:", error.message);
  }
};

// 팔로우 토글 (로그인 여부 체크)
const toggleFollow = async () => {
  if (!loggedInUserId) {
    modalStore.addModal({
      title: "로그인",
      content: "로그인 후 이용해주세요.",
      btnText: "로그인",
      isOneBtn: false,
      onClick: () => {
        modalStore.modals = []; // 모든 모달 닫기
        router.push({ name: "login" });
      },
    });

    return;
  }

  try {
    if (isFollowing.value) {
      // 언팔로우 처리
      const { error } = await supabase
        .from("follow")
        .delete()
        .eq("follower_userid", loggedInUserId)
        .eq("followed_userid", userId.value);

      if (error) throw error;
    } else {
      // 팔로우 처리
      const { error } = await supabase.from("follow").insert({
        follower_userid: loggedInUserId,
        followed_userid: userId.value,
      });

      if (error) throw error;
    }

    isFollowing.value = !isFollowing.value;
    await fetchUserData(); // 팔로워 수 업데이트
  } catch (error) {
    console.error("팔로우 토글 실패:", error.message);
  }
};

// 게시물 가져오기
const fetchPosts = async () => {
  try {
    const { data, error } = await supabase
      .from("community")
      .select("id, created_at, category") // category 추가
      .eq("author_id", userId.value);

    if (error) throw error;

    // 이미지 URL 가져오기
    const postsWithImages = await Promise.all(
      data.map(async (post) => {
        const { data: imageList, error: imageError } = await supabase.storage
          .from("MongSang_Img")
          .list(`community_img/${post.id}`);

        if (imageError) {
          console.error(`이미지 가져오기 실패 (${post.id}):`, imageError);
          return { ...post, img_url: null };
        }

        const imageUrl =
          imageList.length > 0
            ? supabase.storage
                .from("MongSang_Img")
                .getPublicUrl(`community_img/${post.id}/${imageList[0].name}`)
                .data.publicUrl
            : null;

        return { ...post, img_url: imageUrl };
      })
    );

    posts.value = postsWithImages.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  } catch (error) {
    console.error("게시물 로드 실패:", error.message);
  }
};
// 게시물 클릭 핸들러
const goToPost = (postId, category) => {
  router.push(`/${category}/${postId}`); // 게시물 상세 페이지로 이동
};

const handleFollowClick = (viewType) => {
  if (!loggedInUserId) {
    modalStore.addModal({
      title: "로그인 필요",
      content: "이 기능을 이용하려면 로그인이 필요합니다.",
      btnText: "로그인",
      isOneBtn: false,

      onClick: () => {
        modalStore.modals = []; // 모든 모달 닫기
        router.push({ name: "login" });
      },
    });

    return; // 로그인하지 않았으면 함수 종료 (페이지 이동 X)
  }

  router.push({
    path: `/mypage/username/follow/${userId.value}`,
    query: { viewType }, // 'followers' 또는 'following'
  });
};

// 초기 데이터 로드
onMounted(() => {
  fetchUserData();
  fetchPosts();
  if (loggedInUserId && loggedInUserId !== userId.value) {
    checkFollowStatus();
  }
});

// 라우트 파라미터 변경 감지
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      userId.value = newId; // userId를 새 값으로 갱신
      fetchUserData(); // 사용자 정보 다시 불러오기
      fetchPosts(); // 게시물 다시 불러오기
      if (loggedInUserId && loggedInUserId !== newId) {
        checkFollowStatus(); // 팔로우 상태 다시 확인
      }
    }
  }
);
</script>

<template>
  <div
    class="w-full max-w-[1156px] mx-auto relative pt-[0px] sm:pt-[64px] sm:min-h-screen"
  >
    <div
      class="w-full sm:border-[7px] border-hc-white/50 sm:rounded-[20px] bg-hc-white/30 dark:bg-hc-beige/10 overflow-y-auto no-scrollbar shadow-blue dark:shadow-dark-blue"
    >
      <div
        class="profile-container w-full sm:w-[830px] mx-auto pt-[48px] sm:pt-[138px] px-2 sm:px-0 flex flex-col xm:flex-row items-start gap-16 sm:gap-4 sm:justify-between"
      >
        <div class="flex items-start gap-4 profile-section sm:gap-12">
          <img
            :src="userData.profile_url"
            class="w-[120px] sm:w-[160px] h-[120px] sm:h-[160px] rounded-full object-cover"
          />
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4 sm:gap-8">
              <p class="text-2xl font-semibold sm:text-4xl dark:text-hc-white">
                {{ userData.username || "알 수 없음" }}
              </p>
            </div>
            <p class="text-xm sm:text-[30px] dark:text-hc-white">
              {{ userData.profile_bio || "소개 없음" }}
            </p>
            <div
              class="stats-container flex flex-wrap gap-6 text-xm sm:text-[30px]"
            >
              <div class="flex items-center gap-2 dark:text-hc-white">
                <p>게시물</p>
                <span class="font-semibold">{{ userData.posts_count }}</span>
              </div>
              <div
                class="flex items-center gap-2 cursor-pointer dark:text-hc-white"
                @click="handleFollowClick('followers')"
              >
                <p>팔로워</p>
                <span class="font-semibold w-[20px]">{{
                  userData.followers_count
                }}</span>
              </div>
              <div
                class="flex items-center gap-2 cursor-pointer dark:text-hc-white"
                @click="handleFollowClick('following')"
              >
                <p>팔로잉</p>
                <span class="font-semibold">{{
                  userData.following_count
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-center w-full edit-profile-btn xm:w-auto xm:justify-center sm:justify-end"
        >
          <template v-if="loggedInUserId === userId">
            <router-link
              to="/mypage/profile/edit"
              class="block w-full xm:w-auto"
            >
              <Button
                variant="custom"
                size="md"
                class="edit-button sm:text-hc-black text-hc-white text-xl sm:bg-hc-white bg-hc-blue max-w-full sm:w-[160px] xm:w-[380px] sm:rounded-[20px] rounded-[30px] sm:dark:bg-hc-white/70 sm:dark:text-hc-dark-blue dark:bg-hc-dark-blue dark:text-hc-white"
              >
                프로필 편집
              </Button>
            </router-link>
          </template>
          <template v-else>
            <Button
              variant="custom"
              size="md"
              @click="toggleFollow"
              class="px-6 py-2 w-[550px] sm:w-[160px] xm:w-[380px] sm:rounded-[20px] rounded-[30px] text-xl"
              :class="
                isFollowing
                  ? 'bg-hc-white text-hc-blue'
                  : 'bg-hc-blue text-hc-white'
              "
            >
              {{ isFollowing ? "팔로잉" : "팔로우" }}
            </Button>
          </template>
        </div>
      </div>

      <!-- 구분선 및 게시물 헤더 -->
      <div
        class="w-full sm:w-[830px] mx-auto xm:mt-28 mt-16 relative px-4 sm:px-0"
      >
        <div
          class="hidden mb-6 border-t border-hc-blue sm:block dark:border-hc-dark-blue"
        ></div>
        <div class="flex items-center gap-2">
          <Icon
            icon="mdi:grid"
            width="24"
            height="24"
            class="text-hc-blue dark:text-hc-dark-blue"
          />
          <p class="text-xl sm:text-2xl dark:text-hc-white">게시물</p>
        </div>
      </div>

      <!-- 게시물 그리드 -->
      <div
        class="w-full sm:max-w-[830px] sm:min-w-[640px] sm:w-auto mx-auto mt-8 grid grid-cols-3 sm:gap-[10px] gap-[0px] pb-[0px] sm:pb-[128px] sm:px-4 px-0"
        v-if="posts.length > 0"
      >
        <div
          v-for="post in posts"
          :key="post.id"
          class="relative aspect-square cursor-pointer w-full rounded-none sm:rounded-[20px] overflow-hidden"
          @click="goToPost(post.id, post.category)"
        >
          <img
            :src="post.img_url || '/assets/imgs/img_placeholder.png'"
            class="absolute top-0 left-0 object-cover w-full h-full"
          />
        </div>
      </div>

      <div v-else class="w-full sm:w-[830px] mx-auto text-center mt-20">
        <p
          class="pb-32 text-sm text-gray-500 xm:text-base sm:text-xl dark:text-hc-white"
        >
          아직 게시물이 없습니다. 첫 게시물을 작성해보세요!
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* 기존 스타일 유지 */
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  min-width: 300px;
  max-width: 100%;
}

/* 375px 이하일 때 특별한 스타일 적용 */
@media (max-width: 766px) {
  .profile-container {
    gap: 36px;
  }

  .profile-section {
    gap: 24px; /* 프로필 섹션의 간격도 조정 가능 */
  }

  .stats-container {
    gap: 12px; /* 통계 컨테이너 간격 조정 */
  }

  .edit-profile-btn button {
    width: 360px !important; /* Tailwind 클래스를 덮어쓰기 위해 !important 사용 */
    border-radius: 30px !important;
    background-color: #729ecb;
    color: #ffffff;
  }

  .dark .edit-profile-btn button {
    background-color: #0c3b51; /* 다크 모드 배경색 */
    color: #ffffff; /* 다크 모드 텍스트 색상 */
  }
}

/* 기존 미디어 쿼리 유지 */
@media (min-width: 768px) {
  .profile-container {
    flex-direction: row;
  }
}

/* 스크린 크기가 width가 640px에서 766px 사이일 때 버튼 너비 조정 */
@media (min-width: 640px) and (max-width: 766px) {
  .edit-profile-btn button {
    width: 70vw !important; /* 화면 너비의 90%로 설정 */
    max-width: 100%;
  }
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
