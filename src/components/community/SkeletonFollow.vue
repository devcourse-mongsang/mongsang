<template>
  <div class="flex flex-col justify-center items-center min-h-screen">
    <!-- 메인 카드 스켈레톤 -->
    <div
      class="w-[642px] h-[1250px] bg-hc-blue/20 border-[7px] border-hc-white/50 rounded-[20px] relative p-8"
      style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
    >
      <div class="flex flex-col h-full">
        <!-- 현재 리스트 스켈레톤 -->
        <div class="flex-1 px-4">
          <div class="skeleton-header mb-6"></div>
          <div
            class="flex flex-col gap-4 overflow-y-auto no-scrollbar"
            style="max-height: 500px"
          >
            <div
              v-for="i in 6"
              :key="`currentList-skeleton-${i}`"
              class="flex items-center justify-between p-4 bg-hc-white/50 rounded-[10px] shadow-sm"
            >
              <div class="flex items-center gap-4">
                <div class="skeleton-profile"></div>
                <div class="flex flex-col gap-2">
                  <div class="skeleton-line skeleton-short"></div>
                  <div class="skeleton-line skeleton-long"></div>
                </div>
              </div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>

        <!-- All Users 스켈레톤 -->
        <div class="flex-1 px-4 pt-4">
          <div class="skeleton-header mb-6"></div>
          <div
            class="flex flex-col gap-4 overflow-y-auto no-scrollbar"
            style="max-height: 500px"
          >
            <div
              v-for="i in 6"
              :key="`allUsers-skeleton-${i}`"
              class="flex items-center justify-between p-4 bg-hc-white/50 rounded-[10px] shadow-sm"
            >
              <div class="flex items-center gap-4">
                <div class="skeleton-profile"></div>
                <div class="flex flex-col gap-2">
                  <div class="skeleton-line skeleton-short"></div>
                  <div class="skeleton-line skeleton-long"></div>
                </div>
              </div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Skeleton Logo */
.skeleton-logo {
  height: 144px; /* Height of h-36 */
  width: 144px;
  background-color: #e0e0e0;
  border-radius: 50%;
  animation: pulse 1.5s infinite ease-in-out;
}

/* Skeleton Header */
.skeleton-header {
  height: 32px; /* Header font size */
  width: 50%;
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

/* Skeleton Profile */
.skeleton-profile {
  height: 48px; /* Height of w-12 h-12 */
  width: 48px;
  background-color: #e0e0e0;
  border-radius: 50%;
  animation: pulse 1.5s infinite ease-in-out;
}

/* Skeleton Lines */
.skeleton-line {
  height: 16px;
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-short {
  width: 40%;
}

.skeleton-long {
  width: 80%;
}

/* Skeleton Button */
.skeleton-button {
  width: 80px;
  height: 32px;
  background-color: #e0e0e0;
  border-radius: 16px;
  animation: pulse 1.5s infinite ease-in-out;
}

/* Pulse Animation */
@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #f0f0f0;
  }
  100% {
    background-color: #e0e0e0;
  }
}

/* No Scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
