<template>
  <div
    v-for="modal in modals"
    :key="modal.id"
    class="fixed top-0 left-0 bottom-0 right-0 bg-black/50 items-center justify-center z-[9999] flex"
  >
    <article
      class="w-full max-w-[260px] md:max-w-[425px] h-[180px] md:h-[230px] bg-white rounded-[15px] md:rounded-[20px] p-4 md:p-6 flex flex-col items-center justify-center shadow-lg"
    >
      <!-- 제목 -->
      <div
        class="text-[20px] md:text-[24px] font-bold text-center mb-2 text-black"
      >
        {{ modal.title }}
      </div>

      <!-- 내용 -->
      <div
        class="text-[16px] md:text-[20px] text-center mb-4 md:mb-6"
        v-html="modal.content"
      ></div>

      <!-- 버튼 -->
      <template v-if="modal.isOneBtn">
        <button
          class="w-[100px] md:w-[125px] h-[40px] md:h-[45px] bg-hc-blue dark:bg-hc-dark-blue text-white text-base md:text-lg rounded-[15px] md:rounded-[20px] font-normal"
          @click="modal.onClick ? modal.onClick() : closeModal(modal.id)"
        >
          {{ modal.btnText }}
        </button>
      </template>
      <template v-else>
        <div class="flex items-center gap-3 md:gap-4">
          <button
            class="w-[100px] md:w-[125px] h-[40px] md:h-[45px] border border-hc-blue dark:border-hc-dark-blue text-base md:text-lg rounded-[15px] md:rounded-[20px] text-hc-blue font-normal"
            style="border-color: #729ecb !important"
            @click="closeModal(modal.id)"
          >
            취소
          </button>

          <button
            class="w-[100px] md:w-[125px] h-[40px] md:h-[45px] border border-hc-blue dark:border-hc-dark-blue text-base md:text-lg bg-hc-blue dark:bg-hc-dark-blue text-white rounded-[15px] md:rounded-[20px] font-normal"
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
