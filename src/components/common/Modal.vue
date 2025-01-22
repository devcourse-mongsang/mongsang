<template>
  <div
    v-for="modal in modals"
    :key="modal.id"
    class="fixed top-0 left-0 bottom-0 right-0 bg-black/50 items-center justify-center z-[9999] hidden md:flex"
  >
    <article
      class="w-full max-w-[425px] h-[230px] bg-white rounded-[20px] p-6 flex flex-col items-center justify-center shadow-lg"
    >
      <!-- 제목 -->
      <div class="text-lg font-bold text-center mb-2 text-black">
        {{ modal.title }}
      </div>
      <!-- 내용 -->
      <div class="text-lg text-center mb-6">
        {{ modal.content }}
      </div>
      <!-- 버튼 -->
      <template v-if="modal.isOneBtn">
        <button
          class="w-[125px] h-[45px] bg-hc-blue text-white text-lg rounded-[20px] font-normal"
          @click="modal.onClick ? modal.onClick() : closeModal(modal.id)"
        >
          {{ modal.btnText }}
        </button>
      </template>
      <template v-else>
        <div class="flex items-center gap-4">
          <button
            class="w-[125px] h-[45px] border border-hc-blue text-lg rounded-[20px] text-hc-blue font-normal"
            style="border-color: #729ecb !important"
            @click="closeModal(modal.id)"
          >
            취소
          </button>

          <button
            class="w-[125px] h-[45px] border border-hc-blue text-lg bg-hc-blue text-white rounded-[20px] font-normal"
            @click="modal.onClick"
          >
            {{ modal.btnText }}
          </button>
        </div>
      </template>
    </article>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useModalStore } from "@/store/modalStore";

const modalStore = useModalStore();
const modals = computed(() => modalStore.modals);

const closeModal = (id) => {
  modalStore.removeModal(id);
};
</script>

<style scoped></style>
