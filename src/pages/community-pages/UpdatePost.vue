<script setup>
import { getPostById, updatePost } from "@/api/api-community/api";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  deleteImagesFromFolder,
  deleteRemovedImages,
  fetchImagesFromSupabase,
  uploadImagesToSupabase,
} from "@/api/api-community/imgsApi";
import { Icon } from "@iconify/vue";
import DragDropImg from "@/components/community/DragDropImg.vue";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const modalStore = useModalStore();
const postId = ref(route.params.postId); // path에서 뽑아낸 게시글의 고유 ID
const boardType = ref(route.params.boardType);
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
  } finally {
    isLoading.value = false;
  }
};

const onImgPreviewDeleted = (index) => {
  imageUrls.value.splice(index, 1);
  imageFiles.value.splice(index, 1);
};

const addImages = (files) => {
  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      imageUrls.value.push(event.target.result);
    };
    reader.readAsDataURL(file);
    imageFiles.value.push(file); // 🟢 imageFiles에도 추가
  });
};

const handleInputChange = (event) => {
  const files = event.target.files;
  if (files) {
    addImages(files);
  }
};

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

const fetchUpdatedData = async () => {
  modalStore.addModal({
    title: "알림",
    content: "게시글 수정을 완료하시겠습니까?",
    btnText: "완료하기",
    isOneBtn: false,
    onClick: async () => {
      modalStore.modals = []; // 모든 모달 닫기
      try {
        if (!authStore.isLoggedIn || !authStore.profile) return;

        const { title, content, author_id, category } = postData.value;
        const updatedData = { title, content, author_id, category };

        const updateResponse = await updatePost(postId.value, updatedData);
        if (
          !updateResponse ||
          !Array.isArray(updateResponse) ||
          !updateResponse.length
        ) {
          throw new Error("게시글 업데이트 실패");
        }

        const newPostId = updateResponse[0]?.id;
        if (!newPostId) throw new Error("업데이트된 게시글 ID 없음");

        // 🔵 삭제된 이미지만 개별 삭제
        await deleteRemovedImages(postId.value, imageUrls.value);

        if (imageFiles.value.length > 0) {
          await fetchUpdatedImage(newPostId);
        } else {
          router.push({
            name: "postDetail",
            params: {
              boardType: boardType.value,
              postId: postId.value,
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
};

onMounted(() => {
  fetchData(postId.value);
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
          <DragDropImg
            :handleInputChange="handleInputChange"
            :imageUrls="imageUrls"
            :addImages="addImages"
          />
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
                @click="onImgPreviewDeleted(index)"
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

      <div
        class="fixed bottom-[20px] right-[10px] z-30 bg-hc-white dark:bg-hc-dark-blue aspect-square w-[3.5rem] rounded-full shadow-lg hover:scale-105 transition-colors duration-300"
      >
        <div
          class="flex items-center justify-center w-full h-full"
          @click="fetchUpdatedData(
            postData.title,
            postData.content,
            postData.author_id,
            postData.category
          )"
        >
          <Icon
            icon="ic:round-arrow-forward"
            width="30"
            height="30"
            class="text-hc-blue dark:text-hc-white"
          />
        </div>
      </div>

      
    </div>
  </div>
</template>

<style scoped>
.loader {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: conic-gradient(#3498db 0deg, #3498db 90deg, #f3f3f3 90deg);
  animation: rotate 1s linear infinite;
  mask: radial-gradient(circle, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 1) 56%);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
