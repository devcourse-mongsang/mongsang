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
export const uploadDiaryImage = async (diaryId, base64Image) => {
  try {
    const fileName = `${diaryId}.png`; // 일기 ID 기반 파일명
    const filePath = `dream_img/${diaryId}/${fileName}`; // 폴더 경로

    // Base64 -> Blob 변환
    const blob = await (await fetch(base64Image)).blob();

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from("MongSang_Img")
      .upload(filePath, blob, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) throw new Error(error.message);

    // 업로드된 이미지의 URL 가져오기
    const { data: publicUrlData } = supabase.storage
      .from("MongSang_Img")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("이미지 업로드 실패:", error.message);
    throw error;
  }
};
