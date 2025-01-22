import supabase from "@/config/supabase";

export const getUserById = async (userId) => {
  try {
    let query = supabase.from("profiles").select("*");

    if (userId) {
      query = query.eq("id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("사용자 정보 조회 실패:", error.message);
      return null;
    }
    return data || null;
  } catch (error) {
    console.error("에러 발생:", error);
    return null;
  }
};
