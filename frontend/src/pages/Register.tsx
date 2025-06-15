import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Register = () => (
    <div className="min-h-screen bg-[#000] flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl shadow-xl bg-gradient-to-b from-zinc-800 to-zinc-900 px-10 py-12 flex flex-col items-center">
            {/* Logo */}
            <div className="mb-7">
                {/* Use your logo here */}
                <div className="w-20 h-20 rounded-xl flex items-center justify-center">
                    <img src="/logo.png" alt="" className="w-20 h-20 aspect-square object-contain" />
                </div>
            </div>
            {/* Title */}
            <h2 className="font-bold text-2xl text-white text-center leading-tight">
                Sign up to<br />start listening
            </h2>
            {/* Inputs */}
            <form
                className="w-full mt-8 flex flex-col gap-4"
                autoComplete="off"
            >
                {/* Hidden dummy input to prevent Chrome autofill */}
                <input type="text" name="fakeusernameremembered" autoComplete="off" className="hidden" />
                <input type="password" name="fakepasswordremembered" autoComplete="off" className="hidden" />

                <div>
                    <Label
                        htmlFor="signup_email"
                        className="text-xs text-zinc-300 font-medium mb-2"
                    >
                        Email address
                    </Label>
                    <Input
                        id="signup_email"
                        name="signup_email"
                        type="email"
                        placeholder="name@domain.com"
                        autoComplete="off"
                        className="w-full rounded-md border-none bg-[#18181b] text-white/80 placeholder-zinc-400 py-3 px-4 text-base focus:outline-none focus:ring-0 focus:border-none focus:bg-[#18181b] hover:bg-[#18181b] active:bg-[#18181b]"
                        style={{ boxShadow: "none" }}
                    />
                </div>
                <div>
                    <Label
                        htmlFor="signup_username"
                        className="text-xs text-zinc-300 font-medium mb-2"
                    >
                        Username
                    </Label>
                    <Input
                        id="signup_username"
                        name="signup_username"
                        type="text"
                        placeholder="username"
                        autoComplete="off"
                        className="w-full rounded-md border-none bg-[#18181b] text-white/80 placeholder-zinc-400 py-3 px-4 text-base focus:outline-none focus:ring-0 focus:border-none focus:bg-[#18181b] hover:bg-[#18181b] active:bg-[#18181b]"
                        style={{ boxShadow: "none" }}
                    />
                </div>
                <div>
                    <Label
                        htmlFor="signup_password"
                        className="text-xs text-zinc-300 font-medium mb-2"
                    >
                        Password
                    </Label>
                    <Input
                        id="signup_password"
                        name="signup_password"
                        type="password"
                        placeholder="password"
                        autoComplete="new-password"
                        className="w-full rounded-md border-none bg-[#18181b] text-white/80 placeholder-zinc-400 py-3 px-4 text-base focus:outline-none focus:ring-0 focus:border-none focus:bg-[#18181b] hover:bg-[#18181b] active:bg-[#18181b]"
                        style={{ boxShadow: "none" }}
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full mt-2 bg-green-500 hover:bg-green-500 active:bg-green-500 text-white rounded-md py-3 font-medium text-base shadow-none border-none focus:outline-none focus:ring-0"
                    style={{ boxShadow: "none" }}
                >
                    Sign Up
                </Button>
            </form>
            {/* Divider */}
            <div className="flex items-center w-full my-5">
                <div className="flex-1 h-px bg-zinc-700"></div>
                <span className="mx-4 text-zinc-400 text-sm">or</span>
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
            <div className="text-zinc-400 text-sm">
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
                    className="text-zinc-400 text-sm underline hover:text-white transition-colors"
                >
                    Back to home
                </a>
            </div>
        </div>
    </div>
);

export default Register;
