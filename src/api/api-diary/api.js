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
    if (error) throw new Error(error.message); // Error 메시지 처리
    return data;
  } catch (error) {
    console.error("게시물 조회 실패:", error.message); // 에러 로깅
    throw error; // 에러를 외부로 던짐
  }
};

// export const getDiaryWithUserInfo = async (author_id, created_at) => {
//   try {
//     const { data, error } = await supabase
//       .from("dream_journal")
//       .select(
//         `
//         *,
//         profiles:author_id (
//           username
//         )
//       `
//       )
//       .eq("author_id", author_id)
//       .filter("created_at::date", "eq", created_at)
//       .single();

//     if (error) {
//       console.error("일기 조회 실패:", error.message);
//       return null;
//     }

//     if (data) {
//       // created_at을 년/월/일 형식으로 변환
//       const date = new Date(data.created_at);
//       const formattedDate = {
//         year: date.getFullYear(),
//         month: String(date.getMonth() + 1).padStart(2, "0"),
//         day: String(date.getDate()).padStart(2, "0"),
//       };

//       return {
//         ...data,
//         username: data.profiles.username,
//         formattedDate,
//       };
//     }

//     return null;
//   } catch (error) {
//     console.error("에러 발생:", error);
//     return null;
//   }
// };
