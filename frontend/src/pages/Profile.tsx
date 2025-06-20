import { useNavigate, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserById } from "@/hooks/useUserByID";
import Loader from "@/components/Loader";
import PlaylistCard from "@/components/PlaylistCard";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const fallbackImg = "/Note.jpg";

const Profile = () => {
    const { id } = useParams<{ id: string }>();
    const { user: authUser } = useAuth();
    const { data: user, isLoading } = useUserById(id || "");
    const navigate = useNavigate();

    // Redirect to /account if the profile belongs to the current logged-in user
    useEffect(() => {
        if (authUser && id === authUser._id) {
            navigate("/account", { replace: true });
        }
    }, [authUser, id, navigate]);

    if (isLoading) {
        return <Loader />;
    }
    if (!user) {
        return (
            <div className="h-[80.1vh] flex items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-md">
                <span className="text-zinc-400 text-lg">User not found.</span>
            </div>
        );
    }

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
                            {/* Profile Image */}
                            <div className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] shadow-2xl rounded-lg overflow-hidden flex items-center justify-center bg-zinc-900">
                                <img
                                    src={user.image?.trim() ? user.image : fallbackImg}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-lg"
                                    draggable={false}
                                />
                            </div>
                            {/* Details */}
                            <div className="text-zinc-300 text-center md:text-left space-y-4">
                                <p className="text-sm uppercase text-zinc-400 font-medium">Profile</p>
                                <h1 className="text-4xl md:text-6xl font-bold leading-tight">{user.username}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-zinc-200 font-medium">
                                    <span className="text-zinc-300 font-semibold">{user.email}</span>
                                    <span>&bull;</span>
                                    <span className="capitalize">{user.role}</span>
                                </div>
                                {user.bio && (
                                    <p className="text-base text-zinc-400 max-w-xl mx-auto md:mx-0 break-words whitespace-pre-line">
                                        {user.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <PlaylistCard />
            </ScrollArea>
        </div>
    );
};

export default Profile;
