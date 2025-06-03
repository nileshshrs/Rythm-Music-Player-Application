import React from "react";

interface PlaylistImageProps {
    coverImage: string;
}

const PlaylistImage: React.FC<PlaylistImageProps> = ({ coverImage }) => {
    return (
        <div className="playlist-image-wrap">
            <div
                className="playlist-image"
                style={{ backgroundImage: `url(${coverImage})` }}
            >
                <div className="playlist-image-overlay-1"></div>
                <div className="playlist-image-overlay-2"></div>
            </div>
        </div>
    );
};

export default PlaylistImage;
