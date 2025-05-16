import { ReactNode, createContext, useContext, useState } from "react"

type MusicContextType = {
    songs: any[]; // Replace 'any' with the actual type of your song objects
    albums: any[]; // Replace 'any' with the actual type of your album objects
    // Add more properties as needed
}


const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicContextProvider = ({ children }: { children: ReactNode }) => {
   const [songs, setSongs]= useState([])
   const [albums, setAlbums]= useState([])
    return (
        <MusicContext.Provider value={{songs, albums}} >
            {children}
        </MusicContext.Provider>
    );
};


export const useMusicContext =()=>{
    const context = useContext(MusicContext)
    if(!context) throw new Error("useMusicContext must be used within a MusicContextProvider")
}