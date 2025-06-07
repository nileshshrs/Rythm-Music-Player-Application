import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/api/api";

export const useUploadImage = () => {
  return useMutation<string, Error, File>({
    mutationFn: uploadImage,
  });
};