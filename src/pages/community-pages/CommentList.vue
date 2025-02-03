<script setup>
import { useAuthStore } from "@/store/authStore";
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";
import { computed, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { deleteComment } from "@/api/api-community/commentsApi";
import { useModalStore } from "@/store/modalStore";

const authStore = useAuthStore();
const modalStore = useModalStore();
const userProfile = computed(() => authStore.profile);
const deletedCommentId = ref();
const { comments } = defineProps({
  comments: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const sortedComments = computed(() => {
  return [...comments].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
});

const onDeleteButtonClick = async (commentId) => {
  modalStore.addModal({
    title: "알림",
    content: "정말 댓글을 삭제하시겠습니까?",
    btnText: "삭제",
    isOneBtn: false,
    onClick: async () => {
      modalStore.modals = []; // 모든 모달 닫기
      try {
        const deletedComment = await deleteComment(commentId);
        deletedCommentId.value = deletedComment[0].id;
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
      }
    },
  });
};

watch(deletedCommentId, (newId) => {
  if (newId) {
    comments.splice(
      comments.findIndex((comment) => comment.id === newId),
      1
    );
    deletedCommentId.value = null;
  }
});
</script>

<template>
  <div class="px-4 sm:px-[0px]">
    <div
      class="mt-10 ml-2 pb-2 border-b-[1px] border-hc-blue flex justify-between"
    >
      <h2 class="text-xl font-semibold">댓글</h2>
    </div>
    <p class="mt-2" v-if="sortedComments.length === 0">아직 댓글이 없습니다.</p>
    <div
      v-for="comment in sortedComments"
      :key="comment.id"
      class="flex gap-[10px] items-start border-b-2 border-hc-blue/30 py-5"
    >
      <RouterLink :to="`/mypage/profile/${comment.user?.id}`">
        <img
          :src="comment.user?.profile_url || imgPlaceholder"
          alt="댓글 작성자 프로필 이미지 입니다."
          class="w-[40px] rounded-full aspect-square"
        />
      </RouterLink>
      <div class="flex flex-col h-auto gap-[2px] w-full">
        <div class="flex items-center justify-between w-full">
          <RouterLink :to="`/mypage/profile/${comment.user?.id}`">
            <p class="font-bold leading-none text-[#18375B]">
              {{ comment.user?.username || "Unknown User" }}
            </p>
          </RouterLink>
          <button
            v-show="userProfile && comment.user?.id === userProfile.id"
            @click="() => onDeleteButtonClick(comment.id)"
          >
            <Icon
              icon="mdi:cancel-bold"
              width="24"
              height="24"
              class="text-hc-gray/30 hover:text-hc-gray"
            />
          </button>
        </div>
        <p>{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
