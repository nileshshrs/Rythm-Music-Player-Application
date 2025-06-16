import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import API from "@/api/apiClient";
import { AuthContextType, LoginRequest, LoginResponse, User } from "@/utils/types";
import { useGetUser } from "@/hooks/useGetUser";
import { deepEqual } from "@/utils/deepEqual";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                return JSON.parse(stored) as User;
            } catch {
                return null;
            }
        }
        return null;
    });

    const hasUserInStorage = !!localStorage.getItem("user");
    const { refetch } = useGetUser({ enabled: hasUserInStorage });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // LOGIN
    const loginMutation = useMutation({
        mutationFn: async (data: LoginRequest) => {
            const res: LoginResponse = await API.post("/auth/sign-in", data);
            return res.user;
        },
        onSuccess: (user: User) => {
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
        },
    });

    // REGISTER
    const registerMutation = useMutation({
        mutationFn: async (data: { email: string; username: string; password: string }) => {
            // Use "as" to tell TS the correct type
            const res = await API.post("/auth/sign-up", data) as { user: User; message: string };
            return res;
        },
        onSuccess: (res) => {
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
        },
        onError: (error: any) => {
            console.error("Registration failed:", error);
        }
    });


    // LOGOUT
    const { mutate: logout } = useMutation({
        mutationFn: () => API.get("/auth/logout"),
        onSuccess: () => {
            localStorage.removeItem("user");
            setUser(null);
            queryClient.clear();
            navigate("/sign-in", { replace: true });
            window.location.reload();
        },
        onError: (error) => {
            console.error("Logout failed:", error);
        }
    });

    // Sync user from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                setUser(null);
            }
        }
    }, []);

    // Storage/user mismatch logic (as before)
    useEffect(() => {
        function handleStorageChange(e: StorageEvent) {
            if (e.key === "user") {
                const storedUser = localStorage.getItem("user");
                const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;

                refetch().then((result) => {
                    const backendUser = result.data;
                    const isEqual = deepEqual(backendUser, parsedStoredUser);
                    if (!isEqual) {
                        // Handle user mismatch here
                    }
                });
            }
        }

        window.addEventListener("storage", handleStorageChange);

        let prevUser = localStorage.getItem("user");
        const interval = setInterval(() => {
            const currentUser = localStorage.getItem("user");
            if (currentUser !== prevUser) {
                const parsedStoredUser = currentUser ? JSON.parse(currentUser) : null;

                refetch().then((result) => {
                    const backendUser = result.data;
                    const isEqual = deepEqual(backendUser, parsedStoredUser);
                    if (!isEqual) {
                        logout();
                    }
                });
            }
            prevUser = currentUser;
        }, 1000);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, [refetch, logout]);

    // CONTEXT VALUE
    const value: AuthContextType = {
        user,
        login: async (data: LoginRequest) => {
            await loginMutation.mutateAsync(data);
        },
        register: async (data: { email: string; username: string; password: string }) => {
            await registerMutation.mutateAsync(data);
        },
        logout,
        isAuthenticated: !!user,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
