import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { updateUser } from "@/api/api";

// Hook for updating user info
export const useUpdateUser = () => {
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (updatedUser) => {
            // Update AuthContext and localStorage
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        },
        onError: (error) => {
            // Optional: handle error (show toast, etc)
            console.error("User update failed:", error);
        }
    });
};
