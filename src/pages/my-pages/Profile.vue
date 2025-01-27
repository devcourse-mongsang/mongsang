<script setup>
import Button from "@/components/common/Button.vue";
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import supabase from "@/config/supabase";

// 라우트에서 사용자 ID 가져오기
const route = useRoute();
const router = useRouter();
const userId = route.params.id; // URL에서 유저 ID 추출

// 인증된 사용자 정보
const authStore = useAuthStore();
const loggedInUserId = authStore.profile.id;

// 사용자 데이터
const userData = ref(null);

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
      .eq("id", userId) // URL에서 가져온 유저 ID로 조회
      .single();

    if (error) throw error;

    const { count: posts_count } = await supabase
      .from("community")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userId);

    const { count: followers_count } = await supabase
      .from("follow")
      .select("*", { count: "exact", head: true })
      .eq("followed_userid", userId); // followed_userid 기준으로 팔로워 수를 조회

    const { count: following_count } = await supabase
      .from("follow")
      .select("*", { count: "exact", head: true })
      .eq("follower_userid", userId); // follower_userid 기준으로 팔로잉 수를 조회

    userData.value = { ...data, posts_count, followers_count, following_count };
  } catch (error) {
    console.error("사용자 정보 로드 실패:", error.message);
  }
};

// 팔로우 상태 확인
const checkFollowStatus = async () => {
  try {
    const { data, error } = await supabase
      .from("follow")
      .select("*")
      .eq("follower_userid", loggedInUserId)
      .eq("followed_userid", userId);

    if (error) throw error;

    isFollowing.value = data.length > 0;
  } catch (error) {
    console.error("팔로우 상태 확인 실패:", error.message);
  }
};

// 팔로우 토글
const toggleFollow = async () => {
  try {
    if (isFollowing.value) {
      // 언팔로우 처리
      const { error } = await supabase
        .from("follow")
        .delete()
        .eq("follower_userid", loggedInUserId)
        .eq("followed_userid", userId);

      if (error) throw error;
    } else {
      // 팔로우 처리
      const { error } = await supabase.from("follow").insert({
        follower_userid: loggedInUserId,
        followed_userid: userId,
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
      .eq("author_id", userId);

    if (error) throw error;

    // 이미지 URL 가져오기
    const postsWithImages = await Promise.all(
      data.map(async (post) => {
        const { data: imageList, error: imageError } = await supabase.storage
          .from("MongSang_Img")
          .list(`community_img/${post.id}`);

        if (imageError) {
          console.error(
            `Error fetching images for post ${post.id}:`,
            imageError
          );
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
  router.push({
    path: `/mypage/username/follow/${userId}`,
    query: { viewType }, // type: 'followers' or 'following'
  });
};

// 초기 데이터 로드
onMounted(() => {
  fetchUserData();
  fetchPosts();
  if (loggedInUserId !== userId) {
    checkFollowStatus();
  }
});
</script>

<template>
  <div class="w-full max-w-[1156px] mx-auto relative pt-[143.5px]">
    <div
      class="w-full h-[80vh] border-[7px] border-hc-white/50 rounded-[20px] bg-hc-white/30 overflow-y-auto no-scrollbar"
      style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
    >
      <!-- 프로필 섹션 -->
      <div class="w-[830px] mx-auto pt-[138px] relative">
        <template v-if="loggedInUserId === userId">
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

        <template v-else>
          <Button
            variant="custom"
            size="md"
            @click="toggleFollow"
            class="absolute right-0 top-[138px] px-6 py-2 rounded-[20px] text-xl"
            :class="
              isFollowing
                ? 'bg-hc-white text-hc-aquaBlue'
                : 'bg-hc-blue text-white'
            "
          >
            {{ isFollowing ? "팔로잉" : "팔로우" }}
          </Button>
        </template>

        <div class="flex items-start gap-10" v-if="userData">
          <img
            :src="userData.profile_url"
            class="w-[160px] h-[160px] rounded-full object-cover"
          />
          <div class="flex flex-col gap-4">
            <p class="text-4xl font-semibold">@{{ userData.username }}</p>
            <p class="text-[32px]">{{ userData.profile_bio }}</p>
            <div class="flex gap-12 text-[32px]">
              <p>
                게시물
                <span class="font-semibold">{{ userData.posts_count }}</span>
              </p>
              <p class="cursor-pointer" @click="handleFollowClick('followers')">
                팔로워
                <span class="font-semibold">{{
                  userData.followers_count
                }}</span>
              </p>
              <p class="cursor-pointer" @click="handleFollowClick('following')">
                팔로잉
                <span class="font-semibold">{{
                  userData.following_count
                }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

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
        v-if="posts.length > 0"
      >
        <img
          v-for="post in posts"
          :key="post.id"
          :src="post.img_url || '/assets/imgs/img_placeholder.png'"
          class="cursor-pointer w-[270px] h-[270px] rounded-[20px] object-cover"
          @click="goToPost(post.id, post.category)"
        />
      </div>
      <div v-else class="w-[830px] mx-auto text-center mt-20">
        <p class="text-xl text-gray-500">
          아직 게시물이 없습니다. 첫 게시물을 작성해보세요!
        </p>
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
