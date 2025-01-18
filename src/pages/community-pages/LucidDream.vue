<script setup>
import PostItem from "../../components/custom-hook/PostItem.vue";

const posts = [
  {
    userName: "@user_name1",
    title: "나는 오늘도 마라탕을 먹으면서 ..",
    date: "2025년 / 01월 / 20일",
    image:
      "https://cdn.pixabay.com/photo/2023/12/30/21/14/fields-8478994_1280.jpg",
  },
  {
    userName: "@user_name2",
    title: "오늘은 커피 한 잔과 함께 ..",
    date: "2025년 / 01월 / 21일",
    image:
      "https://cdn.pixabay.com/photo/2023/12/30/21/14/fields-8478994_1280.jpg",
  },
  {
    userName: "@user_name3",
    title: "하루의 끝은 책과 함께 ..",
    date: "2025년 / 01월 / 22일",
    image:
      "https://cdn.pixabay.com/photo/2023/12/30/21/14/fields-8478994_1280.jpg",
  },
];
</script>

<template>
  <div>
    <ul>
      <li v-for="(post, index) in posts" :key="index">
        <PostItem :post="post" />
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
