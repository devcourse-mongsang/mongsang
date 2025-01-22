<script setup>
import imgPlaceholder from "../../../public/assets/imgs/img_placeholder.png";
import dateConverter from "../../utils/dateConveter";
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";

import { register } from "swiper/element/bundle";
import { Icon } from "@iconify/vue";

const post = {
  id: "9b2d60f3-742a-4e1b-9f3e-8b3e21f1e700",
  title: "오늘의 자유로운 이야기",
  content: "오늘 날씨가 정말 좋네요. 다들 기분 좋은 하루 보내세요!",
  author_id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
  img_url:
    "https://cdn.pixabay.com/photo/2023/12/22/12/08/beach-8463642_1280.jpg",
  youtube_url: "",
  category: "free-board",
  created_at: "2025-01-18T11:57:00Z",
  updated_at: "2025-01-18T11:57:00Z",
};

const author = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "dreamer01",
  profile_bio: "저는 꿈 해석 전문가입니다.",
  profile_url:
    "https://cdn.pixabay.com/photo/2017/09/03/15/45/seagull-2710822_1280.jpg",
  created_at: "2025-01-18T12:00:00Z",
  updated_at: "2025-01-18T12:30:00Z",
  time_stamp: "2025-01-18T12:45:00Z",
};

const user = {
  id: "123e4567-e89b-12d3-a456-426614174001",
  username: "dreamer02",
  profile_bio: "마라탕 좋아",
  profile_url: "",
  created_at: "2025-01-17T09:00:00Z",
  updated_at: "2025-01-17T09:30:00Z",
  time_stamp: "2025-01-17T09:45:00Z",
};

const comments = [
  {
    id: "1e6e4f6c-9e90-4e54-a3f5-8e0d490e91f1",
    author_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    post_id: "6b8b4567-5f1e-41b1-b3dd-6bfcd045f201",
    content: "첫 번째 댓글입니다.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2a7e1b92-8e10-4b0d-8e8e-ff3d19d001cc",
    author_id: "4e7d03f2-85f4-43c7-b937-62f8c5b84ef9",
    post_id: "8f14e45f-e8b6-44a9-a5c2-2c12d36b5cc5",
    content: "두 번째 댓글입니다.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3b9e6cda-6f81-4e0d-9f3b-d26f5e92c501",
    author_id: "5d8a74d8-86e7-4edb-8ebd-79e8d0be2f8e",
    post_id: "c9f0f895-5aef-472b-938c-0c0d8e22f001",
    content: "세 번째 댓글입니다.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4c0f65e3-7b92-4a8f-9d93-edfc6c97f403",
    author_id: "6f9b03d2-98f3-42e8-b9eb-8e18d4f8c4ed",
    post_id: "45c48cce-4ad1-4f3b-8191-55d151682501",
    content: "네 번째 댓글입니다.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5d1f85f4-8b03-498f-81e3-dfbd5c5ef901",
    author_id: "7g0c21f3-a9f3-4f7b-b9ec-9e19d5f9c5ef",
    post_id: "6512bd43-1f98-491a-a5bc-406aa2eb5023",
    content: "다섯 번째 댓글입니다.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

register();
</script>
<template>
  <div class="flex items-center justify-between mb-3 xm:px-4 md:px-0">
    <div class="flex items-center gap-[10px]">
      <img
        :src="author.profile_url || imgPlaceholder"
        alt=""
        class="w-[45px] h-[45px] rounded-full"
      />

      <p class="text-base font-semibold">@{{ author.username }}</p>
    </div>
    <Button
      variant="regular"
      size="md"
      class-name="w-[60px] h-[35px] text-xs px-[6px] py-2 md:w-[80px] md:h-[40px] md:text-[14px] lg:w-[128px] lg:h-[45px] lg:text-base"
      >팔로잉</Button
    >
  </div>
  <div>
    <swiper-container
      navigation="true"
      class="mySwiper"
      initial-slide="0"
      pagination="true"
      effect="Fade"
      centered-slides="true"
      slides-per-view="auto"
      speed="450"
    >
      <swiper-slide class="bg-hc-white/50">
        <div class="flex items-center aspect-square">
          <img
            class="object-contain w-full"
            src="https://cdn.pixabay.com/photo/2017/09/03/15/45/seagull-2710822_1280.jpg"
          />
        </div>
      </swiper-slide>
      <swiper-slide class="bg-hc-white/50">
        <div class="flex items-center aspect-square">
          <img
            class="object-contain w-full"
            src="https://cdn.pixabay.com/photo/2017/09/03/15/45/seagull-2710822_1280.jpg"
          />
        </div>
      </swiper-slide>
      <swiper-slide class="bg-hc-white/50">
        <div class="flex items-center aspect-square">
          <img
            class="object-contain w-full"
            src="https://cdn.pixabay.com/photo/2017/09/03/15/45/seagull-2710822_1280.jpg"
          />
        </div>
      </swiper-slide>
      <swiper-slide class="bg-hc-white/50">
        <div class="flex items-center aspect-square">
          <img
            class="object-contain w-full"
            src="https://cdn.pixabay.com/photo/2017/09/03/15/45/seagull-2710822_1280.jpg"
          />
        </div>
      </swiper-slide>
    </swiper-container>

    <div class="mb-6">
      <div class="mt-[45px] xm:px-4 sm:px-[0px]">
        <div class="flex items-center justify-between">
          <h1 class="font-semibold xm:text-xl sm:text-2xl">{{ post.title }}</h1>
          <Icon
            class="cursor-pointer"
            icon="stash:heart-light"
            width="35"
            height="35"
            style="color: #729ecb"
          />
        </div>
        <p>{{ dateConverter(post.created_at) }}</p>
        <p class="hidden pt-6 text-xl sm:flex">{{ post.content }}</p>
      </div>
      <div class="px-4 pt-6 mb-10 sm:hidden">
        {{ post.content }}
      </div>
    </div>

    <div>
      <div class="h-[1px] w-full bg-hc-blue mb-[10px]"></div>
      <!-- 댓글 입력창 -->
      <div class="flex gap-[10px] items-center xm:mx-4 sm:mx-[0px]">
        <img
          :src="user.profile_url || imgPlaceholder"
          alt=""
          class="w-[45px] h-[45px] rounded-full"
        />
        <Input
          variant="custom"
          size="md"
          borderRadius="md"
          placeholder="댓글을 입력해주세요."
          class="w-full"
        />
        <Icon icon="material-symbols:send-rounded" width="24" height="24" />
      </div>
      <!-- 댓글 목록 -->
      <div class="mt-[29px] xm:mx-4 sm:mx-[0px]">
        <ul class="flex flex-col gap-[26px]">
          <li
            v-for="comment in comments"
            :key="comment.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-[10px]">
              <img
                :src="user.profile_url || imgPlaceholder"
                alt=""
                class="w-[50px] h-[50px] rounded-full"
              />
              <div>
                <p class="font-semibold">@{{ user.username }}</p>
                <p>{{ comment.content }}</p>
              </div>
            </div>
            <p class="right-0 text-hc-gray">
              {{ dateConverter(comment.created_at) }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
