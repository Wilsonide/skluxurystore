import axios from "axios";

export async function uploadImage(file: File, folder: string) {
  const formData = new FormData();

  formData.append("file", file);

  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

  formData.append("folder", folder);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData,
  );

  return {
    url: response.data.secure_url,
    public_id: response.data.public_id,
  };
}
