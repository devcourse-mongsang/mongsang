<script setup>
import communityHr from "../../../public/assets/icons/community_hr.svg";
defineProps({
  post: {
    type: Object,
    required: true,
    // props의 데이터 형식을 정의합니다
    validator(value) {
      return (
        typeof value.userName === "string" &&
        typeof value.title === "string" &&
        typeof value.date === "string" &&
        typeof value.image === "string"
      );
    },
  },
});
</script>

<template>
  <div class="mb-7">
    <div class="flex justify-between mb-7">
      <div class="flex flex-col mt-6 gap-7">
        <span class="flex items-center gap-[10px]">
          <img
            class="h-[50px] w-[50px] rounded-full"
            :src="post.image"
            alt="User image"
          />
          <p class="text-xl font-semibold">{{ post.userName }}</p>
        </span>

        <span class="flex flex-col gap-[10px]">
          <h2 class="text-2xl font-semibold leading-[140%]">
            {{ post.title }}
          </h2>
          <p class="text-[#757575]">{{ post.date }}</p>
        </span>
      </div>
      <img
        class="w-[180px] h-[180px] rounded-[20px]"
        :src="post.image"
        alt="Post image"
      />
    </div>
    <img :src="communityHr" alt="구분선 이미지" />
  </div>
</template>

<style scoped></style>
