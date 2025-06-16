import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const USER_REGEX = /^[a-zA-Z0-9-_]{4,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

type RegisterFormData = {
    email: string;
    username: string;
    password: string;
};

const registrationSchema = z.object({
    email: z.string().regex(EMAIL_REGEX, "Invalid email address"),
    username: z.string().regex(USER_REGEX, "4-24 chars, start with letter, letters, numbers, -, _ allowed"),
    password: z.string().regex(PWD_REGEX, "8-24 chars, at least 1 lowercase, 1 uppercase, 1 digit"),
});

const Register = () => {
    const { register: registerUser } = useAuth(); // <-- this is YOUR context function
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registrationSchema),
        mode: "onChange",
    });

    // Show the login countdown after successful registration
    const showLoginCountdown = () => {
        let seconds = 3;
        const style = {
            background: "linear-gradient(90deg, #1db954 0%, #12953b 100%)",
            color: "#fff",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.40)",
            border: "1.5px solid #12813b",
            fontWeight: "bold",
            fontFamily: "'Inter', 'Roboto', Arial, sans-serif",
            letterSpacing: "0.01em",
            minWidth: "320px",
            maxWidth: "90vw",
        };

        const id = toast.success(`Sign up successful. Logging you in in ${seconds}..!`, {
            style,
            descriptionClassName: "text-white/90",
            duration: 5000,
        });

        const interval = setInterval(() => {
            seconds--;
            if (seconds > 0) {
                toast.success(`Sign up successful. Logging you in in ${seconds}..!`, {
                    id,
                    style,
                    descriptionClassName: "text-white/90",
                    duration: 5000,
                });
            } else {
                navigate("/", { replace: true })
                clearInterval(interval);
            }
        }, 1000);
    };

    // On form submit: call your AuthContext's register, then show the toast on success
    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser(data);
            showLoginCountdown();
            reset();
        } catch (err: any) {
            toast.error(
                typeof err === "string"
                    ? err
                    : err?.message || "Registration failed.",
                {
                    style: {
                        background: "#f55b5b",
                        color: "#fff",
                        minWidth: "320px",
                        maxWidth: "90vw",
                        fontWeight: 500,
                    },
                    duration: 3000,
                }
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#000] flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl shadow-xl bg-gradient-to-b from-zinc-800 to-zinc-900 px-10 py-12 flex flex-col items-center">
                {/* Logo */}
                <div className="mb-7">
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-20 h-20 aspect-square object-contain"
                        />
                    </div>
                </div>

                {/* Title */}
                <h2 className="font-bold text-2xl text-white text-center leading-tight">
                    Sign up to<br />start listening
                </h2>

                <form
                    className="w-full mt-8 flex flex-col gap-4"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <Label
                            htmlFor="email"
                            className="text-xs text-zinc-300 font-medium mb-2"
                        >
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@domain.com"
                            autoComplete="off"
                            {...register("email")}
                            className="w-full rounded-md border-none bg-[#18181b] text-white/80 placeholder-zinc-500 py-3 px-4 text-base focus:outline-none focus:ring-0 focus:border-none focus:bg-[#18181b] hover:bg-[#18181b] active:bg-[#18181b]"
                            style={{ boxShadow: "none" }}
                        />
                        {errors.email && (
                            <div className="text-red-400 text-xs mt-1">{errors.email.message}</div>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="username"
                            className="text-xs text-zinc-300 font-medium mb-2"
                        >
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="username"
                            autoComplete="off"
                            {...register("username")}
                            className="w-full rounded-md border-none bg-[#18181b] text-white/80 placeholder-zinc-500 py-3 px-4 text-base focus:outline-none focus:ring-0 focus:border-none focus:bg-[#18181b] hover:bg-[#18181b] active:bg-[#18181b]"
                            style={{ boxShadow: "none" }}
                        />
                        {errors.username && (
                            <div className="text-red-400 text-xs mt-1">{errors.username.message}</div>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="password"
                            className="text-xs text-zinc-300 font-medium mb-2"
                        >
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="password"
                            autoComplete="new-password"
                            {...register("password")}
                            className="w-full rounded-md border-none bg-[#18181b] text-white/80 placeholder-zinc-500 py-3 px-4 text-base focus:outline-none focus:ring-0 focus:border-none focus:bg-[#18181b] hover:bg-[#18181b] active:bg-[#18181b]"
                            style={{ boxShadow: "none" }}
                        />
                        {errors.password && (
                            <div className="text-red-400 text-xs mt-1">{errors.password.message}</div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-2 bg-green-500 hover:bg-green-500 active:bg-green-500 text-white rounded-md py-3 font-medium text-base shadow-none border-none focus:outline-none focus:ring-0"
                        style={{ boxShadow: "none" }}
                    >
                        {isSubmitting ? "Signing up..." : "Sign Up"}
                    </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center w-full my-5">
                    <div className="flex-1 h-px bg-zinc-700"></div>
                    <span className="mx-4 text-zinc-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-zinc-700"></div>
                </div>

                {/* Google Button */}
                <Button
                    variant="outline"
                    className="w-full bg-[#18181b] hover:text-white border border-zinc-700 text-white rounded-md py-3 font-medium text-base mb-6 flex items-center justify-center gap-2 shadow-none hover:bg-[#18181b] active:bg-[#18181b] focus:outline-none focus:ring-0"
                    style={{ boxShadow: "none" }}
                    type="button"
                >
                    Sign up with Google
                </Button>

                {/* Log in */}
                <div className="text-zinc-500 text-sm">
                    Already have an account?{" "}
                    <a
                        href="#"
                        className="text-white underline font-medium hover:text-green-500"
                        tabIndex={0}
                    >
                        Log in here
                    </a>
                </div>

                {/* Back to Home */}
                <div className="mt-3">
                    <a
                        href="/"
                        className="text-zinc-500 text-sm underline hover:text-white transition-colors"
                    >
                        Back to home
                    </a>
                </div>
            </div>
            <Toaster
                duration={3000}
                position="top-right"
            />
        </div>
    );
};

export default Register;
