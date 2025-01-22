import supabase from "@/config/supabase";

export const uploadImagesToSupabase = async (files, postId) => {
  const bucketName = "MongSang_Img";
  const imageUrls = [];
  const uploadPromises = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = `community_img/${postId}/${Date.now()}-${file.name}`;

    const uploadPromise = supabase.storage
      .from(bucketName)
      .upload(fileName, file)
      .then(({ data, error }) => {
        if (error) {
          console.error(`이미지 업로드 실패: ${error.message}`);
          return null;
        }

        const { publicURL, error: urlError } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        if (urlError) {
          console.error(`이미지 URL 조회 실패: ${urlError.message}`);
          return null;
        }

        return publicURL;
      });

    uploadPromises.push(uploadPromise);
  }

  const results = await Promise.all(uploadPromises);

  results.forEach((url) => {
    if (url) {
      imageUrls.push(url);
    }
  });

  return imageUrls;
};

export const fetchImagesFromSupabase = async (postId) => {
  try {
    const folderPath = `community_img/${postId}`;
    const { data, error } = await supabase.storage
      .from("MongSang_Img")
      .list(folderPath);

    if (error) {
      throw new Error(`Error fetching images: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log("No images found for this postId.");
      return [];
    }

    const imageUrls = data.map((file) => {
      const { data: publicURLData } = supabase.storage
        .from("MongSang_Img")
        .getPublicUrl(`${folderPath}/${file.name}`);
      return publicURLData.publicUrl;
    });
    return imageUrls;
  } catch (error) {
    console.error("Error fetching images from Supabase:", error);
    return [];
  }
};
