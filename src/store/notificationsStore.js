import { defineStore } from "pinia";
import supabase from "@/config/supabase";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchNotifications(recipientId) {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          *,
          sender:profiles!notifications_sender_id_fkey(username),
          recipient:profiles!notifications_recipient_id_fkey(username)
        `
        )
        .eq("recipient_id", recipientId)
        .order("createdat", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }
      this.notifications = data;
      this.loading = false;
    },
    async markNotificationAsRead(notificationId) {
      try {
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", notificationId);

        if (error) throw error;

        // 읽기 표시
        this.notifications = this.notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        );
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    },

    async markAllNotificationsAsRead(recipientId) {
      try {
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("recipient_id", recipientId);

        if (error) throw error;

        // 모두 읽음
        this.notifications = this.notifications.map((n) => ({
          ...n,
          is_read: true,
        }));
      } catch (err) {
        console.error("Error marking all notifications as read:", err);
      }
    },

    async deleteAllNotifications(recipientId) {
      try {
        const { error } = await supabase
          .from("notifications")
          .delete()
          .eq("recipient_id", recipientId);

        if (error) throw error;

        // 상태 초기화
        this.notifications = [];
      } catch (err) {
        console.error("Error deleting all notifications:", err);
        this.error = err.message;
      }
    },
  },
});
