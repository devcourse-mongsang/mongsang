<script setup>
import unknownUser from "../../../public/assets/imgs/unknownUser.png";
import { createComment, getCommentById } from "@/api/api-community/commentsApi";
import { useAuthStore } from "@/store/authStore";
import { getUserById } from "@/api/api-user/api";
import CommentList from "./CommentList.vue";

import { Icon } from "@iconify/vue";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useModalStore } from "@/store/modalStore";
import supabase from "@/config/supabase";

const modalStore = useModalStore();
const props = defineProps({
  postId: Number,
  authorId: Number,
});

const router = useRouter();
const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const comments = ref([]);
const userCache = new Map();

const fetchComments = async (id) => {
  try {
    const res = await getCommentById(id);
    comments.value = await Promise.all(
      res.map(async (comment) => {
        if (!userCache.has(comment.author_id)) {
          const user = (await getUserById(comment.author_id))[0];
          userCache.set(comment.author_id, user);
        }
        return { ...comment, user: userCache.get(comment.author_id) };
      })
    );
  } catch (err) {
    err.value = "댓글을 불러오는 중 오류가 발생했습니다.";
    console.error(err);
  }
};

const onIsloggedOut = () => {
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
};

const newComment = ref("");

// 낙관적 업데이트에 사용되는 임시 ID를 포함한 newCommentPayload
const createOptimisticPayload = (content) => ({
  id: Date.now(), // 임시 ID 생성
  author_id: authStore.profile.id,
  post_id: props.postId,
  content: content,
  user: {
    id: authStore.profile.id,
    username: authStore.profile.username,
    profile_url: authStore.profile.profile_url,
  },
});

// 실제 DB 요청에 보내는 payload
const createServerPayload = (content) => ({
  author_id: authStore.profile.id,
  post_id: props.postId,
  content: content,
});

// 알림 생성 함수 추가
const createNotification = async (senderId, recipientId, postId) => {
  const kstNow = new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })
    .replace(" ", "T");
  const newNotification = {
    sender_id: senderId,
    recipient_id: recipientId,
    type: "comment",
    reference_id: postId,
    content: "새로운 댓글이 달렸습니다.",
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

// 낙관적 업데이트: UI에서 임시 ID로 댓글 추가
const fetchNewComments = async () => {
  const newCommentPayload = createOptimisticPayload(newComment.value);

  comments.value = [newCommentPayload, ...comments.value];

  // 서버에 실제로 보낼 payload
  const serverPayload = createServerPayload(newComment.value);

  try {
    const res = await createComment(serverPayload);

    // 서버에서 받은 ID로 UI 업데이트
    const index = comments.value.findIndex(
      (c) => c.id === newCommentPayload.id
    );
    if (index !== -1) {
      comments.value[index].id = res[0].id; // 서버에서 받은 ID로 교체
    }

    // 댓글 작성 후 알림 생성
    createNotification(authStore.profile.id, props.authorId, props.postId);
  } catch (error) {
    console.error("댓글 작성 실패: ", error);
    comments.value = comments.value.filter(
      (c) => c.id !== newCommentPayload.id
    );
  }
};

const inputRef = ref(null);

const onCommentButtonClick = (e) => {
  e.preventDefault();
  if (!newComment.value.trim()) return;

  fetchNewComments();
  newComment.value = "";
  inputRef.value.focus();
};

onMounted(() => {
  fetchComments(props.postId);
});
</script>

<template>
  <div class="flex gap-[10px] items-center my-[10px]">
    <div
      v-if="isLoggedIn"
      class="flex gap-[10px] items-center mx-4 sm:mx-[0px] w-full"
    >
      <img
        :src="authStore.profile.profile_url || unknownUser"
        alt=""
        class="w-[40px] h-[40px] rounded-full shadow-lg"
      />
      <form
        @submit.prevent="onCommentButtonClick"
        class="flex w-full rounded-[20px] shadow-lg items-center h-[45px] justify-between pl-[20px] pr-[10px] bg-hc-white"
      >
        <input
          type="text"
          class="w-full outline-none"
          placeholder="댓글을 입력하세요"
          v-model="newComment"
          ref="inputRef"
        />
        <button type="submit">
          <Icon icon="material-symbols:send-rounded" width="30" height="30" />
        </button>
      </form>
    </div>
    <div
      v-else
      class="flex gap-[10px] items-center mx-4 sm:mx-[0px] w-full cursor-pointer"
      @click.stop="onIsloggedOut"
    >
      <img
        :src="unknownUser"
        alt=""
        class="w-[40px] h-[40px] rounded-full shadow-lg"
      />
      <form
        @submit.prevent="onCommentButtonClick"
        class="flex w-full rounded-[20px] shadow-lg items-center h-[45px] justify-between pl-[20px] pr-[10px] bg-hc-white"
      >
        <input
          type="text"
          class="w-full outline-none pointer-events-none"
          placeholder="로그인 후 댓글을 작성해 보세요."
          v-model="newComment"
          ref="inputRef"
          :disabled="true"
        />
        <button type="submit">
          <Icon icon="material-symbols:send-rounded" width="30" height="30" />
        </button>
      </form>
    </div>
  </div>

  <CommentList :comments="comments" />
</template>
