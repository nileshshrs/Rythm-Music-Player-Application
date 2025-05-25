export const formatDuration = (durationInSeconds: number) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = String(durationInSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
};
