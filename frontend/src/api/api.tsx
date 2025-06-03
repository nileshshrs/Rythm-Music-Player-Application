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

export const getAllSongs = async (): Promise<any> => {
  try {
    // API.get returns Song[] because of the generi
    return await API.get("/songs/all");
  } catch (error) {
    throw error;
  }
};

export const getAllAlbums = async (): Promise<any> => {
  try {
    return await API.get("/album/all");
  } catch (error) {
    throw error;
  }
};

export const getSongsByID = async (id: string): Promise<any> => {
  try {
    return await API.get(`/songs/${id}`);
  } catch (error) {
    throw error;
  }
}

export const getPlayistsByUser = async (): Promise<any> => {
  try {
    return await API.get("playlist/get-by-user");
  } catch (error) {
    throw error;
  }
}