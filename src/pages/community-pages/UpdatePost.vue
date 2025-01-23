<script setup>
import { getPostById, updatePost } from "@/api/api-community/api";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  deleteImagesFromFolder,
  fetchImagesFromSupabase,
  uploadImagesToSupabase,
} from "@/api/api-community/imgsApi";
import { Icon } from "@iconify/vue";
import supabase from "@/config/supabase";
import DragDropImg from "@/components/community/DragDropImg.vue";
import { useAuthStore } from "@/store/authStore";

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const postId = ref(route.params.postId); // path에서 뽑아낸 게시글의 고유 ID
const postData = ref({}); // postId를 가지고 수퍼베이스에 요청을 보내 얻어낸 기존 게시글 데이터
const imageUrls = ref([]); // postId를 가지고 수퍼베이스 스토리지에서 가져온 기존 이미지 배열
const imageFiles = ref([]);
const isLoading = ref(false);

const fetchData = async (id) => {
  if (!id) return;
  isLoading.value = true;
  try {
    const data = await getPostById(id);
    postData.value = data || {};

    const fetchedImages = await fetchImagesFromSupabase(id);
    imageUrls.value = fetchedImages || [];
  } catch (error) {
    console.error("Error fetching post or images:", error);
    alert("데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.");
  } finally {
    isLoading.value = false;
  }
};

const onImgPreviewDeleted = (url, index) => {
  imageUrls.value.splice(index, 1);
  imageFiles.value.splice(index, 1);
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
    imageFiles.value = Array.from(files);
  }
};

const resetStorage = async () => {};

const fetchUpdatedImage = async (postId) => {
  if (!imageFiles) return;
  if (postId) {
    console.log(imageFiles.value);
    const uploadedImageUrls = await uploadImagesToSupabase(
      imageFiles.value,
      postId
    );
    console.log("Uploaded image URLs:", uploadedImageUrls); // 업로드된 이미지 URL 로그 출력
    router.push({ name: "communityBoard" });
  }
};

const fetchUpdatedData = async (title, content, author_id, category) => {
  try {
    if (authStore.isLoggedIn && authStore.profile) {
      const updatedData = {
        title,
        content,
        author_id,
        category,
      };

      const updateResponse = await updatePost(postId.value, updatedData);
      const newPostId = updateResponse[0].id;

      await deleteImagesFromFolder(postId.value);
      await fetchUpdatedImage(newPostId);
    }

    console.log("updataed data successfully fetched");
  } catch (error) {
    alert("이미지 업로드에 실패하였습니다.");
    console.error(error);
  }
};

// const fetchPostData = async (id) => {
//   if (!id) return;
//   isLoading.value = true;
//   try {
//     const fetchedPost = await getPostById(id);
//     post.value = fetchedPost || {};

//     const fetchedImages = await fetchImagesFromSupabase(id);
//     imageUrls.value = fetchedImages;
//   } catch (error) {
//     console.error("Error fetching post or images:", error);
//     alert("데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.");
//   } finally {
//     isLoading.value = false;
//   }
// };

// const syncImgWithSupabase = async (file) => {
//   const filePath = `community_img/${postId.value}/${Date.now()}`;
//   try {
//     const { error } = await supabase.storage
//       .from("MongSang_Img")
//       .upload(filePath, file);
//     if (error) throw error;

//     console.log(filePath);

//     const { publicURL, error: urlError } = supabase.storage
//       .from("MongSang_Img")
//       .getPublicUrl(filePath);
//     if (urlError) throw urlError;

//     console.log(publicURL);
//     // imageUrls.value.push(publicURL);
//   } catch (error) {
//     console.error("Error syncing image with Supabase:", error);
//     alert("이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
//   }
// };

// const deleteImageFromSupabase = async (url, index) => {
//   const filePath = url.split(
//     `/storage/v1/object/public/MongSang_Img/community_img/${postId.value}/`
//   )[1];
//   if (!filePath) return;

//   try {
//     const { error } = await supabase.storage
//       .from("MongSang_Img")
//       .remove([`community_img/${postId.value}/${filePath}`]);
//     if (error) throw error;

//     imageUrls.value.splice(index, 1);
//   } catch (error) {
//     console.error("Error deleting image from Supabase:", error);
//     alert("이미지 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
//   }
// };

// const addImages = (files) => {
//   Array.from(files).forEach((file) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       imageUrls.value.push(reader.result);
//     };
//     reader.readAsDataURL(file);
//   });
// };

watch(
  () => route.params.postId,
  (newId, oldId) => {
    if (newId !== oldId) {
      postId.value = newId;
      fetchData(newId);
    }
  }
);

onMounted(() => {
  fetchData(postId.value);
  console.log("postId:", postId.value);
  console.log("postData:", postData.title);
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
            v-model="postData.title"
          />
          <textarea
            placeholder="여기에 글을 작성해주세요"
            class="w-full min-h-[462px] h-auto outline-none resize-none"
            v-model="postData.content"
          ></textarea>
        </div>

        <div class="m-[25px] flex flex-col gap-[10px]">
          <p>{{ postData.title }}</p>
          <DragDropImg
            :handleInputChange="handleInputChange"
            :imageUrls="imageUrls"
            :addImages="addImages"
          />
          <!--           <p class="pl-2 text-xl font-semibold">이미지 업로드</p>
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
          </div> -->

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
              <!-- <button
                @click="deleteImageFromSupabase(url, index)"
                class="absolute top-[10px] right-[10px] p-1 text-white bg-hc-gray/30 bg-opacity-50 rounded-full hover:scale-105 hover:bg-hc-gray"
              >
                <Icon
                  icon="material-symbols-light:delete-forever-rounded"
                  width="16"
                  height="16"
                />
              </button> -->
              <button
                @click="onImgPreviewDeleted(url, index)"
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
        @click="
          fetchUpdatedData(
            postData.title,
            postData.content,
            postData.author_id,
            postData.category
          )
        "
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
