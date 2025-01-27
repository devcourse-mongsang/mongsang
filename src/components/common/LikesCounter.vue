<script setup>
import { Icon } from "@iconify/vue";
import { useAuthStore } from "@/store/authStore";
import { computed, onMounted, ref } from "vue";
import {
  getPostLikeCount,
  getUserLikeForPost,
  likePost,
  unlikePost,
} from "../../api/api-like/api";
import router from "@/router";

const { postId } = defineProps({
  postId: Number,
});

const authStore = useAuthStore();
const likesDisplay = ref(0);
const isLiked = ref(false);
const isLoggedIn = computed(() => authStore.isLoggedIn);

const fetchLikes = async (userId) => {
  try {
    likesDisplay.value = await getPostLikeCount(postId);
    const res = await getUserLikeForPost(postId, userId);
    if (res !== null) {
      isLiked.value = true;
    }
  } catch (error) {
    console.error("Error fetching likes:", error);
  }
};

const onLikeButtonClick = () => {
  if (isLoggedIn) {
    handleLike(postId, authStore.profile.id);
    console.log(postId);
  } else {
    alert("로그인 후 이용해주세요.");
    router.push({ name: "login" });
  }
};

const handleLike = async (postId, userId) => {
  try {
    const res = await getUserLikeForPost(postId, userId);
    console.log(res);
    if (res === null) {
      // db에서 가져온 좋아요 결과가 없으면
      likesDisplay.value += 1; // 화면에 보이는 좋아요 +1 하고
      isLiked.value = true; // 좋아요 했음 표시 하고
      const newLike = {
        // 실제로 보낼 좋아요 데이터 포장해서
        user_id: authStore.profile.id,
        post_id: postId,
      };
      const likeRes = await likePost(newLike); // 생성 요청한다.
      console.log(likeRes);
    } else if (res) {
      // db에서 가져온 좋아요 결과가 있으면
      likesDisplay.value -= 1; // 화면에 보이는 좋아요 -1 하고
      isLiked.value = false; //좋아요 안했음 표시 하고
      await unlikePost(res.id); // 서버에 좋아요 삭제 요청하기
    }
  } catch (error) {
    console.error("Error handling like:", error);
  }

  console.log(isLiked.value);
};

onMounted(() => {
  fetchLikes(authStore.profile.id);
});
</script>
<template>
  <div class="flex flex-col items-center">
    <button @click="onLikeButtonClick">
      <Icon
        v-if="!isLiked"
        class="cursor-pointer"
        icon="stash:heart-light"
        width="35"
        height="35"
        style="color: #729ecb"
      />
      <Icon
        v-else
        class="cursor-pointer"
        icon="stash:heart-solid"
        width="35"
        height="35"
        style="color: #729ecb"
      />
    </button>
    <p class="text-lg font-semibold text-hc-blue">
      {{ likesDisplay }}
    </p>
  </div>
</template>
<style scoped></style>
