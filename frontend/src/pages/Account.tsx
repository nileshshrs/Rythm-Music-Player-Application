import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useUploadImage } from "@/hooks/useImage";
import { Pencil, Check, X } from "lucide-react";

const Account = () => {
    const { user, setUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const uploadImageMutation = useUploadImage();
    const updateUserMutation = useUpdateUser();

    // For instant local image preview
    const [localImage, setLocalImage] = useState<string | null>(null);

    // For editing fields
    const [editingField, setEditingField] = useState<string | null>(null);
    const [fieldValue, setFieldValue] = useState<string>("");
    const [error, setError] = useState<string>("");

    function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const prevImage = user?.image || "";

        const reader = new FileReader();
        reader.onload = () => {
            setLocalImage(reader.result as string);

            uploadImageMutation.mutate(file, {
                onSuccess: (imageUrl: string) => {
                    updateUserMutation.mutate(
                        { image: imageUrl },
                        {
                            onSuccess: (newUser: any) => {
                                setLocalImage(null);
                                setUser?.(newUser);
                            },
                            onError: () => setLocalImage(prevImage)
                        }
                    );
                },
                onError: () => setLocalImage(prevImage)
            });
        };
        reader.readAsDataURL(file);
    }

    function handleEdit(field: string, value: string) {
        setEditingField(field);
        setFieldValue(value);
        setError("");
    }

    function handleSave(field: string) {
        if ((field === "username" || field === "email") && !fieldValue.trim()) {
            setError("You can't leave this field empty.");
            return;
        }
        updateUserMutation.mutate(
            { [field]: fieldValue.trim() },
            {
                onSuccess: (newUser: any) => {
                    setEditingField(null);
                    setFieldValue("");
                    setError("");
                    setUser?.(newUser);
                }
            }
        );
    }

    function handleCancelEdit() {
        setEditingField(null);
        setFieldValue("");
        setError("");
    }

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
                                {/* Username */}
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    {editingField === "username" ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                className="bg-zinc-800 text-zinc-100 px-3 py-1 rounded font-bold text-3xl w-[160px] outline-none"
                                                value={fieldValue}
                                                onChange={e => {
                                                    setFieldValue(e.target.value);
                                                    setError("");
                                                }}
                                                autoFocus
                                                onKeyDown={e => {
                                                    if (e.key === "Enter") handleSave("username");
                                                    if (e.key === "Escape") handleCancelEdit();
                                                }}
                                            />
                                            <Check
                                                className="w-5 h-5 text-green-500 cursor-pointer hover:scale-110 transition"
                                                onClick={() => handleSave("username")}
                                            />
                                            <X
                                                className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110 transition"
                                                onClick={handleCancelEdit}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="text-4xl md:text-6xl font-bold leading-tight">{user?.username}</h1>
                                            <button
                                                className="ml-2 text-zinc-400 hover:text-white"
                                                onClick={() => handleEdit("username", user?.username || "")}
                                                tabIndex={-1}
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {editingField === "username" && error && (
                                    <div className="text-red-500 text-sm mt-1">{error}</div>
                                )}

                                {/* Email */}
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-zinc-200 font-medium">
                                    {editingField === "email" ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded font-medium w-[230px] outline-none"
                                                value={fieldValue}
                                                type="email"
                                                onChange={e => {
                                                    setFieldValue(e.target.value);
                                                    setError("");
                                                }}
                                                autoFocus
                                                onKeyDown={e => {
                                                    if (e.key === "Enter") handleSave("email");
                                                    if (e.key === "Escape") handleCancelEdit();
                                                }}
                                            />
                                            <Check
                                                className="w-5 h-5 text-green-500 cursor-pointer hover:scale-110 transition"
                                                onClick={() => handleSave("email")}
                                            />
                                            <X
                                                className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110 transition"
                                                onClick={handleCancelEdit}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-zinc-300 font-semibold">{user?.email}</span>
                                            <button
                                                className="ml-2 text-zinc-400 hover:text-white"
                                                onClick={() => handleEdit("email", user?.email || "")}
                                                tabIndex={-1}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    <span>&bull;</span>
                                    <span className="capitalize">{user?.role}</span>
                                </div>
                                {editingField === "email" && error && (
                                    <div className="text-red-500 text-sm mt-1">{error}</div>
                                )}

                                {/* Bio */}
                                <div className="flex flex-col gap-2 max-w-xl mx-auto md:mx-0">
                                    {editingField === "bio" ? (
                                        <div className="flex items-center gap-2">
                                            <textarea
                                                className="bg-zinc-800 text-zinc-100 px-3 py-2 rounded w-full outline-none min-h-[50px]"
                                                value={fieldValue}
                                                maxLength={300}
                                                autoFocus
                                                onChange={e => setFieldValue(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === "Enter" && !e.shiftKey) handleSave("bio");
                                                    if (e.key === "Escape") handleCancelEdit();
                                                }}
                                                placeholder="Write something about yourself"
                                            />
                                            <Check
                                                className="w-5 h-5 text-green-500 cursor-pointer hover:scale-110 transition mt-2"
                                                onClick={() => handleSave("bio")}
                                            />
                                            <X
                                                className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110 transition mt-2"
                                                onClick={handleCancelEdit}
                                            />
                                        </div>
                                    ) : user?.bio ? (
                                        <div className="flex items-start gap-2">
                                            <p className="text-base text-zinc-400 break-words whitespace-pre-line">{user?.bio}</p>
                                            <button
                                                className="ml-2 text-zinc-400 hover:text-white mt-1"
                                                onClick={() => handleEdit("bio", user?.bio || "")}
                                                tabIndex={-1}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="text-zinc-500 hover:text-white font-medium text-sm flex items-center gap-1"
                                            onClick={() => handleEdit("bio", "")}
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Add a bio
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default Account;
