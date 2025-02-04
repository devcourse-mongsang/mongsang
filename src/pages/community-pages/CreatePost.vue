<script setup>
import { createPost } from "@/api/api-community/api";
import { uploadImagesToSupabase } from "@/api/api-community/imgsApi";
import DropDownNewPost from "@/components/common/DropDownNewPost.vue";
import { useAuthStore } from "@/store/authStore";
import { useDropDownStore } from "@/store/dropDownStore";
import { useModalStore } from "@/store/modalStore";
import { Icon } from "@iconify/vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const menuItems = [
  { title: "자유게시판" },
  { title: "초현실몽" },
  { title: "예지몽" },
  { title: "반복몽" },
  { title: "자각몽" },
  { title: "악몽" },
  { title: "길몽" },
  { title: "해몽" },
];
const router = useRouter();
const authStore = useAuthStore();
const modalStore = useModalStore();
const dropdownStore = useDropDownStore();
const imageFiles = ref([]);
const imageUrls = ref([]);
const title = ref("");
const content = ref("");
const selectedCategory = ref(
  getEnglishKeyword(dropdownStore.$state.currentCategory)
);

function getEnglishKeyword(koreanKeyword) {
  const keywordMap = {
    자유게시판: "free-board",
    초현실몽: "surreal-dream",
    예지몽: "prophetic-dream",
    반복몽: "recurrent-dream",
    자각몽: "lucid-dream",
    악몽: "nightmare",
    길몽: "good-dream",
    해몽: "dream-interpretation",
  };

  return keywordMap[koreanKeyword] || null;
}

watch(
  () => dropdownStore.currentCategory,
  (newCategory) => {
    selectedCategory.value = getEnglishKeyword(newCategory);
  }
);

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

const handleDrop = (event) => {
  event.preventDefault();
  if (event.dataTransfer.files) {
    addImages(event.dataTransfer.files);
    imageFiles.value = Array.from(event.dataTransfer.files);
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
};

const removeImage = (index) => {
  imageUrls.value.splice(index, 1);
  imageFiles.value.splice(index, 1);
};

const validateInput = () => {
  if (!title.value.trim()) {
    showAlertModal("제목을 입력해 주세요.");
    return false;
  }
  if (!content.value.trim()) {
    showAlertModal("내용을 입력해 주세요.");
    return false;
  }
  return true;
};

const showAlertModal = (message) => {
  modalStore.addModal({
    title: "알림",
    content: message,
    btnText: "확인",
    isOneBtn: true,
    onClick: () => {
      modalStore.modals = [];
    },
  });
};

const createNewPost = async () => {
  if (!validateInput()) return;

  modalStore.addModal({
    title: "알림",
    content: "게시물 작성을 마치시겠습니까?",
    btnText: "포스팅",
    isOneBtn: false,
    onClick: async () => {
      modalStore.modals = [];
      try {
        if (authStore.isLoggedIn && authStore.profile) {
          const newPostData = {
            title: title.value,
            content: content.value,
            author_id: authStore.profile.id,
            category: selectedCategory.value,
          };
          const postResponse = await createPost(newPostData);
          const postId = postResponse[0].id;

          if (postId) {
            const uploadedImageUrls = await uploadImagesToSupabase(
              imageFiles.value,
              postId
            );

            router.push({ name: "communityBoard" });
          }
        }
      } catch (error) {
        modalStore.addModal({
          title: "실패",
          content: "이미지 업로드에 실패하였습니다.",
          btnText: "확인",
          isOneBtn: true,
        });
        console.error(error);
      }
    },
  });
};

const handleEnter = (event) => {};
</script>

<template>
  <div class="flex flex-col w-full gap-[10px] sm:mt-[-100px]">
    <div class="flex px-4 sm:px-[0px]">
      <DropDownNewPost
        :items="menuItems"
        :buttonText="dropdownStore.currentCategory"
        class="text-xl text-hc-black"
      />
    </div>
    <div
      class="bg-hc-white/30 rounded-[20px] px-[25px] py-[22px] relative shadow-lg backdrop-blur-lg"
    >
      <div class="bg-hc-white rounded-[20px] p-[25px] flex flex-col gap-[10px]">
        <input
          id="newPostTitle"
          placeholder="제목 없음"
          type="text"
          class="w-full text-lg outline-none sm:text-2xl"
          v-model="title"
        />
        <textarea
          placeholder="여기에 글을 작성해주세요"
          name="포스팅 내용"
          id="newPostContent"
          class="w-full min-h-[462px] h-auto outline-none text-sm sm:text-base resize-none"
          v-model="content"
          @keydown.enter.exact="handleEnter"
        />
      </div>
      <div class="m-[25px] flex flex-col gap-[10px]">
        <p class="pl-2 text-xl font-semibold dark:text-hc-white">
          이미지 업로드
        </p>

        <div
          @drop="handleDrop"
          @dragover="handleDragOver"
          class="flex flex-col w-auto sm:h-[200px] border-dashed rounded-lg sm:items-center sm:justify-center sm:w-full xm:border-0 sm:border-2 border-hc-gray/50 hover:border-hc-gray bg-gray-50"
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
            class="mt-4 rounded-md cursor-pointer bg-hc-blue hover:scale-[105%] w-[100px] dark:bg-hc-dark-blue transition-all duration-300"
          >
            <div
              class="px-4 py-2 text-center text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              파일 선택
            </div>
          </label>
        </div>

        <div v-if="imageUrls.length" class="flex flex-wrap gap-4 mt-4">
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
              @click="removeImage(index)"
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
      </div>
    </div>
  </div>
  <div
    class="fixed bottom-[20px] right-[10px] z-30 bg-hc-white dark:bg-hc-dark-blue aspect-square w-[3.5rem] rounded-full shadow-lg hover:scale-105 transition-colors duration-300"
  >
    <div
      class="flex items-center justify-center w-full h-full"
      @click="createNewPost"
    >
      <Icon
        icon="ic:round-arrow-forward"
        width="30"
        height="30"
        class="text-hc-blue dark:text-hc-white"
      />
    </div>
  </div>
</template>

<style scoped>
button {
  cursor: pointer;
}
</style>
