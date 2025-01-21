import supabase from "@/config/supabase";

export const createPost = async (post) => {
  const { data, error } = await supabase.from("community").insert(post);
  if (error) throw error;
  return data;
};

export const getPostById = async (id) => {
  const { data, error } = await supabase
    .from("community")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const updatePost = async (id, updates) => {
  const { data, error } = await supabase
    .from("community")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const deletePost = async (id) => {
  const { data, error } = await supabase
    .from("community")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const getPostByCategory = async (selectedCategory, supabaseClient) => {
  try {
    let query = supabaseClient.from("community").select("*");

    if (selectedCategory) {
      query = query.eq("category", selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error("카테고리별 게시물 조회 실패:", error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("에러 발생:", error);
    return [];
  }
};
