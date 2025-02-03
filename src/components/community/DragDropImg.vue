<script setup>
const { handleInputChange, addImages, imageUrls } = defineProps([
  "handleInputChange",
  "addImages",
  "imageUrls",
]);

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
</script>
<template>
  <p class="pl-2 text-xl font-semibold dark:text-hc-white">이미지 업로드</p>
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
      class="mt-4 rounded-md cursor-pointer bg-hc-blue hover:scale-[105%] w-[100px] dark:bg-hc-dark-blue"
    >
      <div
        class="px-4 py-2 text-center text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        파일 선택
      </div>
    </label>
  </div>
</template>
<style scoped></style>
