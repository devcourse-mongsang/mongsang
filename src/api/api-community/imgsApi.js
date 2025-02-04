import supabase from "@/config/supabase";
import { v4 as uuidv4 } from "uuid";

export const uploadImagesToSupabase = async (files, postId) => {
  const bucketName = "MongSang_Img";
  const imageUrls = [];
  const uploadPromises = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = `community_img/${postId}/${uuidv4()}`;

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

export const deleteImagesFromFolder = async (postId) => {
  try {
    const folderPath = `community_img/${postId}`; // postId에 해당하는 폴더 경로 설정

    // 폴더 내의 모든 이미지 파일 목록 가져오기
    const { data, error } = await supabase.storage
      .from("MongSang_Img") // 스토리지 버킷 이름
      .list(folderPath);

    if (error) {
      throw new Error(`Error fetching files: ${error.message}`);
    }

    if (data.length === 0) {
      return;
    }

    // 파일 하나씩 삭제
    const deletePromises = data.map((file) => {
      return supabase.storage
        .from("MongSang_Img")
        .remove([`${folderPath}/${file.name}`]); // 파일 삭제
    });

    // 모든 삭제 작업이 끝날 때까지 기다림
    const deleteResults = await Promise.all(deletePromises);

    // 삭제 결과 확인
    deleteResults.forEach(({ error }, index) => {
      if (error) {
        console.error(
          `Error deleting file ${data[index].name}: ${error.message}`
        );
      }
    });
  } catch (error) {
    console.error("Error deleting images:", error);
  }
};

// 🔹 특정 이미지 파일을 Supabase에서 삭제하는 함수
export const deleteSingleImage = async (postId, fileName) => {
  try {
    const filePath = fileName.split(
      "supabase.co/storage/v1/object/public/MongSang_Img/"
    )[1];
    const { data, error } = await supabase.storage
      .from("MongSang_Img")
      .remove([`${filePath}`]);

    if (error) throw error;
  } catch (err) {
    console.error("❌ 이미지 삭제 오류:", err);
  }
};

// 🔹 삭제된 이미지 목록을 찾아 개별 삭제하는 함수
export const deleteRemovedImages = async (postId, remainingImages) => {
  try {
    const originalImages = await fetchImagesFromSupabase(postId);
    const deletedImages = originalImages.filter(
      (img) => !remainingImages.includes(img)
    );

    if (deletedImages.length > 0) {
      for (const img of deletedImages) {
        await deleteSingleImage(postId, img);
      }
    }
  } catch (error) {
    console.error("❌ 삭제할 이미지 처리 중 오류 발생:", error);
  }
};
