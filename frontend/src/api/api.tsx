import API from "./apiClient";
import { Album, AlbumResponse, Song } from "@/utils/types";

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

export const createEmptyPlaylist = async (): Promise<any> => {
  return await API.post("/playlist/create")
}

export const createPlaylistFromAlbum = async (albumID: string): Promise<any> => {
  const response = await API.post("/playlist/create-from-album", { albumID });
  return response;
};


export const getPlaylistById = async (playlistId: string): Promise<any> => {
  const data = await API.get(`/playlist/${playlistId}`);
  return data;
};

export const deletePlaylist = async (playlistId: string): Promise<any> => {
  const response = await API.delete(`/playlist/delete/${playlistId}`);
  return response;
};

export const updatePlaylist = async (
  playlistId: string,
  data: {
    name?: string;
    themeColor?: string;
    coverImage?: string;
    description?: string;
  }
): Promise<any> => {
  try {
    // PATCH /playlist/update/:id
    const res = await API.patch(`/playlist/update/${playlistId}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  // This will handle both: if the interceptor failed OR not
  return API.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then((res: any) => {
    // If res.imageUrl exists, return it. If not, maybe it's an AxiosResponse (from a test, etc)
    if (res && typeof res === "object" && "imageUrl" in res) return res.imageUrl;
    if (res && res.data && "imageUrl" in res.data) return res.data.imageUrl;
    throw new Error("Unexpected response from uploadImage");
  });
};


export const addSongToPlaylist = async (
  playlistId: string,
  songId: string
): Promise<any> => {
  try {

    const res = await API.patch(`/playlist/add-songs/${playlistId}`, {
      songID: songId,
    });

    return res;
  } catch (error) {
    throw error;
  }
};

export const uploadSong = (audioFile: File) => {
  const formData = new FormData();
  formData.append("audio", audioFile);

  return API.post("/upload/audio", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then((res: any) => {
    // Defensive: handle both cases (interceptor hit or miss)
    if (res && typeof res === "object" && "audioUrl" in res && "duration" in res) {
      return res; // API returned only data (interceptor hit)
    }
    if (res && res.data && "audioUrl" in res.data && "duration" in res.data) {
      return res.data; // AxiosResponse (no interceptor)
    }
    throw new Error("Unexpected response from uploadSong");
  });
};


export const createSong = async (data: Song) => {
  return API.post("/songs/create", data);

};


export const editSong = async (songId: string, data: Partial<Song>): Promise<any> => {
  try {
    const res = await API.patch(`/songs/${songId}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteSong = async (songId: string): Promise<any> => {
  try {
    const res = await API.delete(`/songs/${songId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createAlbum = async (data: Album): Promise<any> => {
  return await API.post("/album/create", data);
};


// EDIT album (PATCH /album/update/:id)
export const editAlbum = async (
  albumId: string,
  data: Partial<Album>
): Promise<any> => {
  try {
    const res = await API.patch(`/album/update/${albumId}`, data);
    return res;
  } catch (error) {
    throw error;
  }
};

// DELETE album (DELETE /album/delete/:id)
export const deleteAlbum = async (albumId: string): Promise<any> => {
  try {
    const res = await API.delete(`/album/delete/${albumId}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async (): Promise<any> => {
  const res = await API.get("/user/get");
  return res
};


export const logout = async (): Promise<any> => {
  return await API.get("/auth/logout");
};


export const getAllUsers = async (): Promise<any> => {
  try {
    const res = await API.get("/user/all");
    return res;
  } catch (error) {
    throw error;
  }
};


export const createConversation = async (
  participants: string[]
): Promise<any> => {
  try {
    const response = await API.post("/conversation/create", { participants });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllConversations = async (): Promise<any> => {
  try {
    return await API.get("/conversation/all");
  } catch (error) {
    throw error;
  }
};

export const getConversationByID = async (id: string): Promise<any> => {
  try {
    return await API.get(`/conversation/${id}`);
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async (
  conversationId: string,
  content: string,
  recipient: string
): Promise<{ message: any; newMessage: any }> => {
  return await API.post(`/message/create/${conversationId}`, { content, recipient });
};

export const getMessagesByConversationID = async (conversationId: string): Promise<any[]> => {
  return await API.get(`/message/conversation/${conversationId}`);
};

export const updateUser = async (data: {
  image?: string;
  username?: string;
  bio?: string;
  email?: string;
}): Promise<any> => {
  try {
    const res = await API.patch("/user/update", data);
    return res;
  } catch (error) {
    throw error;
  }
};


export const getUserById = async (id: string): Promise<any> => {
  try {
    const res = await API.get(`/user/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};
export const getPlaylistsByUserId = async (userId: string): Promise<any> => {
  try {
    const res= await API.get(`/playlist/get-by-user/${userId}`);
    console.log("Playlists by user ID:", res);
    return res;
  } catch (error) {
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<any> => {
  try {
    const res = await API.post("/auth/account-recovery", { email });
    return res; // It includes: message, resetUrl, emailId
  } catch (error) {
    throw error;
  }
};


export const resetPassword = async ({
  password,
  verificationCode,
}: {
  password: string;
  verificationCode: string;
}): Promise<any> => {
  try {
    const res = await API.post("/auth/reset-password", { password, verificationCode });
    return res; // contains: { message: "password reset successful." }
  } catch (error) {
    throw error;
  }
};