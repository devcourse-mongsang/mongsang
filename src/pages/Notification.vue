<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { useNotificationsStore } from "@/store/notificationsStore";
import supabase from "@/config/supabase";
import { Icon } from "@iconify/vue";
import Button from "@/components/common/Button.vue";

const router = useRouter();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();

const currentUserId = computed(() => authStore.user?.id);

// 알림 삭제 핸들러
async function handleDeleteAllNotifications() {
  if (confirm("모든 알림을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
    await notificationsStore.deleteAllNotifications(currentUserId.value);
  }
}
// Function to format date
function formatNotificationDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(async () => {
  while (!currentUserId.value) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  await notificationsStore.fetchNotifications(currentUserId.value);
});

// 게시글로 이동
async function navigateToPost(notification) {
  try {
    const { data: categoryData, error } = await supabase
      .from("community")
      .select("category")
      .eq("id", notification.reference_id)
      .single();

    if (error || !categoryData) {
      console.error("Category fetch error:", error);
      return;
    }

    const boardType = categoryData.category;
    const postId = notification.reference_id;

    router.push({ name: "postDetail", params: { boardType, postId } });
  } catch (err) {
    console.error("Error navigating to post:", err);
  }
}

// 프로필로 이동
function navigateToProfile(notification) {
  const userId = notification.sender_id;
  router.push({ name: "userProfile", params: { userId } });
}

// 알림 클릭 핸들러
function handleNotificationClick(notification) {
  // 알림 항목 읽음 처리
  if (!notification.is_read) {
    notification.is_read = true; // UI 상태 업데이트
    notificationsStore.markNotificationAsRead(notification.id); // 서버 업데이트
  }

  if (notification.type === "like" || notification.type === "comment") {
    navigateToPost(notification);
  } else if (notification.type === "follow") {
    navigateToProfile(notification);
  }
}

async function handleMarkAllRead() {
  const updatedNotifications = notificationsStore.notifications.map(
    (notification) => ({
      ...notification,
      is_read: true, // 새 객체를 생성하여 반응성을 유지
    })
  );

  notificationsStore.notifications = updatedNotifications; // 새 배열로 업데이트
  await notificationsStore.markAllNotificationsAsRead(currentUserId.value);
}
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <!-- 로고 섹션 -->
    <div class="mb-8">
      <img src="/assets/imgs/big_logo.png" alt="Logo" class="h-36" />
    </div>

    <div
      class="w-full sm:w-[642px] h-[900px] bg-hc-white/30 border-[7px] border-hc-white/50 rounded-[20px] relative p-4 sm:p-8"
      style="box-shadow: -4px 4px 50px 0 rgba(114, 158, 203, 0.7)"
    >
      <div class="flex flex-col h-full">
        <!-- 알림 섹션 -->
        <div class="flex items-center justify-between px-2 sm:px-4 mb-4">
          <!-- '모두 읽음' 버튼 (오른쪽 정렬) -->
          <button
            @click="handleMarkAllRead"
            class="text-hc-black hover:text-hc-blue font-regular text-lg ml-auto"
          >
            모두 읽음
          </button>
        </div>

        <div
          class="flex flex-col gap-2 overflow-y-auto no-scrollbar flex-grow"
          style="max-height: 780px"
        >
          <template v-if="notificationsStore.notifications.length">
            <template
              v-for="notification in notificationsStore.notifications"
              :key="notification.id"
            >
              <div
                class="notification-item group cursor-pointer bg-hc-white/50 rounded-lg px-6 sm:px-6 py-4"
                @click="handleNotificationClick(notification)"
              >
                <p
                  v-if="notification.type === 'follow'"
                  :class="[notification.is_read ? 'text-hc-gray' : '']"
                  class="text-lg"
                >
                  <span class="font-semibold"
                    >@{{ notification.sender.username }}</span
                  >
                  님이 회원님을 팔로우 했습니다.
                </p>
                <p
                  v-else-if="notification.type === 'like'"
                  :class="[notification.is_read ? 'text-hc-gray' : '']"
                  class="text-lg"
                >
                  <span class="font-semibold"
                    >@{{ notification.sender.username }}</span
                  >
                  님이 회원의 게시글에 좋아요를 눌렀습니다.
                </p>
                <p
                  v-else-if="notification.type === 'comment'"
                  :class="[notification.is_read ? 'text-hc-gray' : '']"
                  class="text-lg"
                >
                  <span class="font-semibold"
                    >@{{ notification.sender.username }}</span
                  >
                  님이 회원의 게시글에 댓글을 남겼습니다.
                </p>
                <!-- 날짜 표시 -->
                <p class="text-right text-2xs sm:text-2sm text-hc-gray mt-2">
                  {{ formatNotificationDate(notification.createdat) }}
                </p>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="flex justify-center items-center h-full">
              <p class="text-hc-gray text-lg">알림이 없습니다</p>
            </div>
          </template>
        </div>

        <!-- '휴지통' 버튼 -->
        <div class="flex justify-center mt-4">
          <!-- Added a div to center the button -->
          <Button
            variant="shadowed"
            size="sm"
            @click="handleDeleteAllNotifications"
          >
            <Icon
              icon="mdi:trash-can-outline"
              class="w-6 h-6 transform items-center text-hc-white"
            />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.notification-item {
  @apply hover:bg-hc-blue/50 hover:rounded-lg transition-all duration-300 ease-in-out;
}

.notification-item p {
  margin: 0;
}

.notification-item p + p {
  margin-top: 8px; /* 알림과 날짜 사이 간격 */
}

.notification-text {
  transition: color 0.3s ease-in-out;
}
</style>
