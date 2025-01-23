<script setup>
import { useDropDownStore } from "@/store/dropDownStore";
import { Icon } from "@iconify/vue";
import { ref, watch, defineEmits } from "vue";

const emit = defineEmits(["update:images"]);

const dropdownStore = useDropDownStore();
const imageFiles = ref([]);
const imageUrls = ref([]);
const selectedCategory = ref(
  getEnglishKeyword(dropdownStore.$state.currentCategory)
);

console.log(selectedCategory.value);

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
      emit("update:images", imageFiles.value); // 이미지를 부모에게 전달
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
  emit("update:images", imageFiles.value); // 부모에게 변경된 이미지 파일 리스트 전달
};
</script>

<template>
  <div class="m-[25px] flex flex-col gap-[10px]">
    <p class="pl-2 text-xl font-semibold">이미지 업로드</p>

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
        class="mt-4 rounded-md cursor-pointer bg-hc-blue hover:scale-[105%] w-[100px]"
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
</template>
