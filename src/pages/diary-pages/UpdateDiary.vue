<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import DiaryWrite from "./DiaryWrite.vue";
import { getDiaryById, updateDiary } from "@/api/api-diary/api";

const router = useRouter();
const route = useRoute();
const diaryId = route.params.id;
const diaryData = ref(null);

onMounted(async () => {
  try {
    const data = await getDiaryById(diaryId);
    if (data) {
      diaryData.value = {
        title: data.title,
        content: data.content,
        condition: data.condition,
        weather: data.weather,
        dreamAnalysis: data.dream_analysis,
        imgUrl: data.img_url,
        youtubeUrl: data.youtube_url,
        createdAt: new Date(data.created_at),
      };
    }
  } catch (error) {
    console.error("일기 불러오기 실패:", error);
  }
});

const handleUpdate = async (updatedData) => {
  try {
    await updateDiary(diaryId, {
      title: updatedData.title,
      content: updatedData.content,
      condition: updatedData.condition,
      weather: updatedData.weather,
    });
    router.push(`/diary/${diaryId}`);
  } catch (error) {
    console.error("일기 수정 실패:", error);
  }
};
</script>

<template>
  <DiaryWrite
    v-if="diaryData"
    :initial-data="diaryData"
    :is-update-mode="true"
    @submit="handleUpdate"
  />
</template>
