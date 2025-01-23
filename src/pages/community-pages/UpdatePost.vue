<script setup>
import { getPostById, updatePost } from "@/api/api-community/api";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchImagesFromSupabase } from "@/api/api-community/imgsApi";
import { Icon } from "@iconify/vue";
import supabase from "@/config/supabase";

const router = useRouter();
const route = useRoute();
const postId = ref(route.params.postId);
const post = ref({});
const imageUrls = ref([]);
const isLoading = ref(false);

const fetchPostData = async (id) => {
  if (!id) return;

  isLoading.value = true;
  try {
    // 게시글 데이터 로드
    const fetchedPost = await getPostById(id);
    post.value = fetchedPost || {};

    // 이미지 데이터 로드
    const fetchedImages = await fetchImagesFromSupabase(id);
    imageUrls.value = fetchedImages;
  } catch (error) {
    console.error("Error fetching post or images:", error);
    alert("데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.");
  } finally {
    isLoading.value = false;
  }
};

const syncImgWithSupabase = async (file) => {
  const filePath = `community_img/${postId.value}/${Date.now()}`;
  try {
    const { error } = await supabase.storage
      .from("MongSang_Img")
      .upload(filePath, file);
    if (error) throw error;

    console.log(filePath);

    const { publicURL, error: urlError } = supabase.storage
      .from("MongSang_Img")
      .getPublicUrl(filePath);
    if (urlError) throw urlError;

    console.log(publicURL);
    // imageUrls.value.push(publicURL);
  } catch (error) {
    console.error("Error syncing image with Supabase:", error);
    alert("이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
};

const deleteImageFromSupabase = async (url, index) => {
  const filePath = url.split(
    `/storage/v1/object/public/MongSang_Img/community_img/${postId.value}/`
  )[1];
  if (!filePath) return;

  try {
    const { error } = await supabase.storage
      .from("MongSang_Img")
      .remove([`community_img/${postId.value}/${filePath}`]);
    if (error) throw error;

    imageUrls.value.splice(index, 1);
  } catch (error) {
    console.error("Error deleting image from Supabase:", error);
    alert("이미지 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
};

const addImages = (files) => {
  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      imageUrls.value.push(reader.result);
    };
    reader.readAsDataURL(file);
  });
};

const handleInputChange = (event) => {
  const files = event.target.files;
  if (files) {
    addImages(files);
    Array.from(files).forEach((file) => {
      syncImgWithSupabase(file);
    });
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files) {
    Array.from(files).forEach((file) => {
      if (!imageUrls.value.some((url) => url.includes(file.name))) {
        syncImgWithSupabase(file);
      }
    });
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
};

const fetchUpdatedPost = async () => {
  try {
    const updatedData = {
      title: post.value.title,
      content: post.value.content,
      author_id: post.value.author_id,
      category: post.value.category,
    };
    const updateResponse = await updatePost(postId.value, updatedData);
    console.log("Post updated successfully:", updateResponse);
    router.push({ name: "communityBoard" });
  } catch (error) {
    console.error("Error updating post:", error);
    alert("게시글 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
};

// 라우트 변경 감지 및 처리
watch(
  () => route.params.postId,
  (newId, oldId) => {
    if (newId !== oldId) {
      postId.value = newId;
      fetchPostData(newId);
    }
  }
);

// 초기 데이터 로드
onMounted(() => {
  fetchPostData(postId.value);
});
</script>

<template>
  <div class="flex flex-col w-full gap-[10px] sm:mt-[-100px]">

    <div v-if="isLoading" class="flex items-center justify-center h-40">
      <div class="loader"></div>
      <p class="ml-2 font-semibold text-gray-500">
        데이터를 불러오는 중입니다...
      </p>
    </div>

    <div v-else>
      <div
        class="bg-hc-white/30 rounded-[20px] px-[25px] py-[22px] relative shadow-lg backdrop-blur-lg"
      >
        <div
          class="bg-hc-white rounded-[20px] p-[25px] flex flex-col gap-[10px]"
        >
          <input
            id="newPostTitle"
            placeholder="제목 없음"
            type="text"
            class="w-full text-2xl outline-none"
            v-model="post.title"
          />
          <textarea
            placeholder="여기에 글을 작성해주세요"
            class="w-full min-h-[462px] h-auto outline-none resize-none"
            v-model="post.content"
          ></textarea>
        </div>

        <div class="m-[25px] flex flex-col gap-[10px]">
          <p class="pl-2 text-xl font-semibold">이미지 업로드</p>
          <div
            @drop="handleDrop"
            @dragover="handleDragOver"
            class="flex flex-col w-auto sm:h-[200px] border-dashed rounded-lg sm:items-center sm:justify-center sm:w-full border-2 border-hc-gray/50 hover:border-hc-gray bg-gray-50"
          >
            <p class="hidden text-center text-hc-gray sm:flex">
              이미지를 드래그 앤 드롭하거나 클릭하세요
            </p>
            <input
              id="fileInput"
              type="file"
              class="hidden"
              @change="handleInputChange"
              multiple
            />
            <label
              for="fileInput"
              class="mt-4 rounded-md cursor-pointer bg-hc-blue hover:scale-[105%] w-[100px]"
            >
              <div
                class="px-4 py-2 text-center text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                파일 선택
              </div>
            </label>
          </div>

          <div class="flex flex-wrap gap-4 mt-4" v-if="imageUrls.length">
            <div
              v-for="(url, index) in imageUrls"
              :key="index"
              class="relative w-[150px]"
            >
              <img
                :src="url"
                alt="Preview"
                class="aspect-square w-full rounded-[20px] object-cover"
              />
              <button
                @click="deleteImageFromSupabase(url, index)"
                class="absolute top-[10px] right-[10px] p-1 text-white bg-hc-gray/30 bg-opacity-50 rounded-full hover:scale-105 hover:bg-hc-gray"
              >
                <Icon
                  icon="material-symbols-light:delete-forever-rounded"
                  width="16"
                  height="16"
                />
              </button>
            </div>
          </div>
          <p v-else>이미지가 없습니다.</p>
        </div>
      </div>

      <v-fab
        icon="$mdi-plus"
        class="fixed bottom-[50px] right-[70px] scale-[110%] z-30"
        color="#729ECB"
        @click="fetchUpdatedPost"
      >
        <Icon icon="ic:round-arrow-forward" width="24" height="24" />
      </v-fab>
    </div>
  </div>
</template>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
