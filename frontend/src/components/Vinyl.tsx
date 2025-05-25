import React from "react";

interface VinylProps {
  coverImage: string;
  isPlaying: boolean;
}

const Vinyl: React.FC<VinylProps> = ({ coverImage, isPlaying }) => {
  return (
    <div className="vinyl-wrap">
      <div
        className={`vinyl-disc ${isPlaying ? "spin-out" : ""}`}
      >
        <div className="vinyl-disc-overlay"></div>
        <div className="vinyl-label"></div>
      </div>
      <div
        className="vinyl-cover"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="vinyl-cover-label"></div>
      </div>
    </div>
  );
};

export default Vinyl;
