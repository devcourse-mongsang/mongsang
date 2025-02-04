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

export const getPostLike = async (postId) => {
  if (!postId) return;
  try {
    const { data, error } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .select();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Error fetching post likes:", err.message);
    return null;
  }
};

export const getLikeCount = async (postId) => {
  if (!postId) {
    console.error("No PostId provided");
    return 0;
  }

  try {
    const { data, error } = await supabase
      .from("post_likes")
      .select("*", { count: "exact" })
      .eq("post_id", postId);

    if (error) {
      throw new Error(error.message);
    }

    return data?.length || 0;
  } catch (error) {
    console.error("Error fetching post like count:", error.message);
    return 0;
  }
};
