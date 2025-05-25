import API from "./apiClient";
import { AlbumResponse } from "@/utils/types";

export const getAlbumsByID = async (id: string): Promise<AlbumResponse> => {
  try {
    const res = await API.get(`/album/${id}`);
    return res as AlbumResponse; // ✅ Explicit cast
  } catch (error) {
    throw error;
  }
};
