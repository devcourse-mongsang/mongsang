import supabase from "@/config/supabase";

export const getPostLikeCount = async (postId) => {
  const { count, error } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) {
    console.error("Error fetching like count:", error.message);
    return 0;
  }

  return count || 0;
};

export const getUserLikeForPost = async (postId, userId) => {
  try {
    const { data, error } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    console.log("지금 로그인한 유저의 좋아요", data);
    return data;
  } catch (err) {
    console.error("Error fetching like data:", err.message);
    return null;
  }
};

export const likePost = async (like) => {
  const { data, error } = await supabase
    .from("post_likes")
    .insert(like)
    .select();
  if (error) throw error;
  return data;
};

export const unlikePost = async (likeId) => {
  const { data, error } = await supabase
    .from("post_likes")
    .delete()
    .eq("id", likeId);
  if (error) throw error;
  return data;
};
