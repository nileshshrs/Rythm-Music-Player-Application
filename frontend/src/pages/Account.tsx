import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useUploadImage } from "@/hooks/useImage";

const Account = () => {
    const { user } = useAuth();
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const uploadImageMutation = useUploadImage();
    const updateUserMutation = useUpdateUser();

    // For instant local image preview
    const [localImage, setLocalImage] = React.useState<string | null>(null);

    function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Save current image in case of revert
        const prevImage = user?.image || "";

        // 1. Show local preview instantly
        const reader = new FileReader();
        reader.onload = () => {
            setLocalImage(reader.result as string);

            // 2. Start upload
            uploadImageMutation.mutate(file, {
                onSuccess: (imageUrl: string) => {
                    // 3. PATCH user with new image URL
                    updateUserMutation.mutate(
                        { image: imageUrl },
                        {
                            onSuccess: () => {
                                setLocalImage(null); // Clear preview, context will rerender with actual image
                            },
                            onError: () => {
                                setLocalImage(prevImage); // Revert on user update fail
                            }
                        }
                    );
                },
                onError: () => {
                    setLocalImage(prevImage); // Revert on upload fail
                }
            });
        };
        reader.readAsDataURL(file);
    }

    // Use localImage as override, else user.image from context
    const imageToShow = localImage !== null ? localImage : (user?.image?.trim() ? user.image : "/Note.jpg");

    return (
        <div className="h-[80.1vh] overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-md">
            <ScrollArea className="h-full overflow-y-auto rounded-md">
                <div className="relative min-h-full pb-40">
                    <div
                        className="absolute inset-0 bg-gradient-to-b via-zinc-900/80 to-zinc-900 pointer-events-none"
                        style={{
                            backgroundImage: `linear-gradient(to bottom, #5038aacc, rgba(24,24,27,0.8), #18181b)`,
                        }}
                    />

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6 pt-10 pb-8">
                            {/* Profile/Cover image */}
                            <div className="relative group w-[200px] h-[200px] md:w-[240px] md:h-[240px] shadow-2xl rounded-lg overflow-hidden">
                                <img
                                    src={imageToShow}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <div
                                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5l-4 1 1-4L16.5 3.5z" />
                                    </svg>
                                    <span className="mt-2 text-white font-semibold text-sm drop-shadow">Change cover</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="absolute inset-0 opacity-0 z-20 cursor-pointer"
                                    style={{ display: "none" }}
                                    onChange={handleCoverImageChange}
                                    aria-label="Change profile cover image"
                                />
                            </div>

                            {/* Details */}
                            <div className="text-zinc-300 text-center md:text-left space-y-4">
                                <p className="text-sm uppercase text-zinc-400 font-medium">Account</p>
                                <h1 className="text-4xl md:text-6xl font-bold leading-tight">{user?.username}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-zinc-200 font-medium">
                                    <span className="text-zinc-300 font-semibold">{user?.email}</span>
                                    <span>&bull;</span>
                                    <span className="capitalize">{user?.role}</span>
                                </div>
                                {user?.bio && (
                                    <p className="text-base text-zinc-400 max-w-xl mx-auto md:mx-0 break-words whitespace-pre-line">
                                        {user?.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default Account;
