import { defineStore } from "pinia";
import supabase from "@/config/supabase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // 사용자 정보
    isLoggedIn: false, // 로그인 상태
    profile: null, // 프로필 정보
  }),

  actions: {
    // 인증 상태 리스너 초기화
    initAuthListener() {
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          console.log("Auth Event:", event);
          await this.setUser(session.user.id); // 사용자 정보 설정
        } else {
          this.clearState(); // 로그아웃 시 상태 초기화
        }
      });
    },

    // 사용자 데이터 설정
    async setUser(userId) {
      try {
        // 세션 가져오기
        const { data: session, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw new Error(sessionError.message);

        if (session?.session?.user) {
          this.user = session.session.user;
          this.isLoggedIn = true;

          // 유저 정보 가져오기
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

          console.log("profileData", profileData);
          if (profileError) {
            console.warn(
              "유저 정보를 가져오는 데 실패했습니다:",
              profileError.message
            );
            this.profile = null;
          } else {
            this.profile = profileData; // 유저 데이터 저장
          }
        } else {
          this.clearState();
        }
      } catch (error) {
        console.error(error.message);
        this.clearState();
      }
    },

    // 로그아웃 처리
    async logout() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);

        this.clearState();
        return true;
      } catch (error) {
        console.error("로그아웃 실패:", error.message);
        return false;
      }
    },

    // 상태 초기화
    clearState() {
      this.user = null;
      this.isLoggedIn = false;
      this.profile = null;
    },

    // 세션 복구
    async restoreSession() {
      try {
        const { data: session, error } = await supabase.auth.getSession();
        if (error || !session?.session?.user) {
          this.clearState();
        } else {
          await this.setUser(session.session.user.id);
        }
      } catch (error) {
        console.error("세션 복구 실패:", error.message);
        this.clearState();
      }
    },
  },
});
