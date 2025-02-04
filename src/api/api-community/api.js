import supabase from "@/config/supabase";

export const createPost = async (post) => {
  try {
    const { data, error } = await supabase
      .from("community")
      .insert(post)
      .select();
    if (error) throw new Error(error.message); // Error 메시지 처리
    return data;
  } catch (error) {
    console.error("게시물 생성 실패:", error.message); // 에러 로깅
    throw error; // 에러를 외부로 던짐
  }
};

export const getPostById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("community")
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

export const updatePost = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from("community")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) throw new Error(error.message); // Error 메시지 처리
    return data;
  } catch (error) {
    console.error("게시물 업데이트 실패:", error.message); // 에러 로깅
    throw error; // 에러를 외부로 던짐
  }
};

export const deletePost = async (id) => {
  try {
    const { data, error } = await supabase
      .from("community")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message); // Error 메시지 처리
    return data;
  } catch (error) {
    console.error("게시물 삭제 실패:", error.message); // 에러 로깅
    throw error; // 에러를 외부로 던짐
  }
};

export const getPostByCategory = async (selectedCategory, supabaseClient) => {
  try {
    let query = supabaseClient.from("community").select("*");

    if (selectedCategory) {
      query = query.eq("category", selectedCategory);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message); // Error 메시지 처리

    return data || [];
  } catch (error) {
    console.error("카테고리별 게시물 조회 실패:", error.message); // 에러 로깅
    return []; // 빈 배열 반환
  }
};
