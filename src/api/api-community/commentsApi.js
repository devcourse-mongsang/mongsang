import supabase from "@/config/supabase";

export const createComment = async (comment) => {
  const { data, error } = await supabase
    .from("comment")
    .insert(comment)
    .select();
  if (error) throw error;
  return data;
};

export const getCommentById = async (postId) => {
  const { data, error } = await supabase
    .from("comment")
    .select("*")
    .eq("post_id", postId);
  if (error) throw error;
  return data;
};

export const updateComment = async (id, updates) => {
  const { data, error } = await supabase
    .from("comment")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const deleteComment = async (id) => {
  const { data, error } = await supabase
    .from("comment")
    .delete()
    .eq("id", id)
    .select();
  if (error) throw error;
  return data;
};
