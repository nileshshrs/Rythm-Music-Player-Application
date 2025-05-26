import React from "react";

interface LoaderProps {
  themeColor?: string;
}

const normalizeHexWithAlpha = (hex: string, alpha = "cc") => {
  if (!hex.startsWith("#")) return `#000000${alpha}`;
  if (hex.length === 4) {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}${alpha}`;
  }
  if (hex.length === 7) {
    return `${hex}${alpha}`;
  }
  return `#000000${alpha}`;
};

const Loader: React.FC<LoaderProps> = ({ themeColor = "#000" }) => {
  const gradientStart = normalizeHexWithAlpha(themeColor);
  const balancedGreen = "#1edb8c";
  const emeraldGlow = "#10B981";

  return (
    <div className="h-[80.1vh] flex items-center justify-center rounded-md relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${gradientStart}, rgba(24,24,27,0.8), #18181b)`,
        }}
      />

      {/* Bars only — fade + glow */}
      <div className="relative z-10 w-12 h-12">
        {[...Array(8)].map((_, i) => {
          const angle = i * 45;
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 w-1 h-3 rounded-sm origin-center"
              style={{
                transform: `rotate(${angle}deg) translateY(-130%)`,
                animation: "fade 1s linear infinite",
                animationDelay: `${i * 0.125}s`,
                backgroundColor: balancedGreen,
                boxShadow: `0 0 4px ${emeraldGlow}`, // ✅ subtle glow on each bar only
              }}
            />
          );
        })}
      </div>

      <style>
        {`
          @keyframes fade {
            0%, 39%, 100% { opacity: 0.2; }
            40% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
