import supabase from "@/config/supabase";

export const createDiary = async (diary) => {
  try {
    const { data, error } = await supabase
      .from("dream_journal")
      .insert(diary)
      .select();

    if (error) throw new Error(error.message);

    console.log(data);
    return data;
  } catch (error) {
    console.error("일기 저장 실패:", error.message);
    throw error;
  }
};

export const getDiaryCreatedAt = async (author_id) => {
  try {
    const { data, error } = await supabase
      .from("dream_journal")
      .select("created_at")
      .eq("author_id", author_id)
      .single();

    if (error) {
      console.error("created_at 조회 실패:", error.message);
      return null;
    }

    return data ? data.created_at : null;
  } catch (error) {
    console.error("에러 발생:", error);
    return null;
  }
};

export const getDiaryByCreatedAt = async (author_id, created_at) => {
  try {
    const { data, error } = await supabase
      .from("dream_journal")
      .select("*")
      .eq("author_id", author_id)
      .filter("created_at::date", "eq", created_at)
      .single();

    if (error) {
      console.error("일기 조회 실패:", error.message);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error("에러 발생:", error);
    return null;
  }
};

export const getDiaryById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("dream_journal")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error("게시물 조회 실패:", error.message);
    throw error;
  }
};

export const getMonthlyDiaryImages = async (year, month) => {
  try {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

    const { data, error } = await supabase
      .from("dream_journal")
      .select("id, created_at, img_url")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (error) throw error;

    const imageMap = {};
    data.forEach((diary) => {
      const date = new Date(diary.created_at);
      const day = date.getDate();
      imageMap[day] = {
        id: diary.id,
        imgUrl: diary.img_url,
      };
    });

    return imageMap;
  } catch (error) {
    console.error("월별 이미지 조회 실패:", error.message);
    return {};
  }
};
