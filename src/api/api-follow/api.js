import supabase from "@/config/supabase";

export const insertFollow = async (follower_userid, followed_userid) => {
  try {
    const { data, error } = await supabase
      .from("follow")
      .insert([{ follower_userid, followed_userid }])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Error inserting follow record:", err.message);
    return null;
  }
};
