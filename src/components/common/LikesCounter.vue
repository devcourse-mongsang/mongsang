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
import { useModalStore } from "@/store/modalStore";
import supabase from "@/config/supabase";

// props를 제대로 받을 수 있도록 수정
const props = defineProps({
  postId: Number,
  authorId: Number,
});

const modalStore = useModalStore();
const authStore = useAuthStore();
const likesDisplay = ref(0);
const isLiked = ref(false);
const isLoggedIn = computed(() => authStore.isLoggedIn);

const fetchLikes = async (userId = null) => {
  try {
    likesDisplay.value = await getPostLikeCount(props.postId);
    if (!userId) return;
    const userLike = await getUserLikeForPost(props.postId, userId);
    isLiked.value = !!userLike;
  } catch (error) {
    console.error("Error fetching likes:", error.message);
  }
};

const onLikeButtonClick = () => {
  if (isLoggedIn.value) {
    handleLike(props.postId, authStore.profile.id);
  } else {
    modalStore.addModal({
      title: "",
      content: "로그인 후 이용해주세요.",
      btnText: "로그인",
      isOneBtn: false,
      onClick: () => {
        modalStore.modals = []; // 모든 모달 닫기
        router.push({ name: "login" });
      },
    });
  }
};

const createNotification = async (senderId, recipientId, postId) => {
  const kstNow = new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })
    .replace(" ", "T");
  const newNotification = {
    sender_id: senderId,
    recipient_id: recipientId,
    type: "like",
    reference_id: postId,
    content: "새로운 좋아요가 있었습니다.",
    is_read: false,
    createdat: kstNow, // 한국 시간 추가
  };

  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert([newNotification]);

    if (error) throw error;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const handleLike = async (postId, userId) => {
  try {
    const res = await getUserLikeForPost(postId, userId);
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

      // 좋아요가 생성되면 알림도 생성
      createNotification(authStore.profile.id, props.authorId, postId);
    } else if (res) {
      // db에서 가져온 좋아요 결과가 있으면
      likesDisplay.value -= 1; // 화면에 보이는 좋아요 -1 하고
      isLiked.value = false; //좋아요 안했음 표시 하고
      await unlikePost(res.id); // 서버에 좋아요 삭제 요청하기
    }
  } catch (error) {
    console.error("Error handling like:", error);
  }
};

onMounted(() => {
  if (authStore.isLoggedIn) {
    fetchLikes(authStore.profile.id);
  } else {
    fetchLikes(null);
  }
});
</script>

<template>
  <div class="flex flex-col items-center">
    <button @click="onLikeButtonClick">
      <Icon
        v-if="!isLiked"
        class="transition-colors duration-300 cursor-pointer text-hc-blue dark:text-hc-dark-blue"
        icon="stash:heart-light"
        width="35"
        height="35"
      />
      <Icon
        v-else
        class="transition-colors duration-300 cursor-pointer dark:text-hc-dark-blue text-hc-blue"
        icon="stash:heart-solid"
        width="35"
        height="35"
      />
    </button>
    <p class="text-lg font-semibold transition-colors duration-300 text-hc-blue dark:text-hc-dark-blue">
      {{ likesDisplay }}
    </p>
  </div>
</template>
<style scoped></style>
