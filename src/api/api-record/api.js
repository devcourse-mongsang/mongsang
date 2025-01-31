import supabase from "@/config/supabase";

//일기 작성 페이지 접근 제어
export const checkDiaryExists = async (date) => {
  try {
    const startOfDay = `${date}T00:00:00`;
    const endOfDay = `${date}T23:59:59`;

    const { data, error } = await supabase
      .from("dream_journal")
      .select("created_at")
      .gte("created_at", startOfDay)
      .lte("created_at", endOfDay);

    if (error) {
      console.error("❌오늘 일기 확인 중 에러 발생:", error.message);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("❌API 호출 실패:", error);
    return false;
  }
};
