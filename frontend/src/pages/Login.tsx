import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await login({
        usernameOrEmail: emailRef.current?.value || "",
        password: passwordRef.current?.value || "",
      });
      // Optionally, redirect after login:
      navigate("/", { replace: true })
    } catch (err: any) {
      setError(err?.message || "username or password invalid.!");
    }

  };

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-gradient-to-b from-zinc-800 to-zinc-900 px-10 py-12 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-5">
          <div className="w-20 h-20 rounded-xl flex items-center justify-center">
            <img src="/logo.png" alt="" className="w-20 h-20 aspect-square object-contain" />
          </div>
        </div>
        {/* Title */}
        <h2 className="font-bold text-2xl text-white text-center leading-tight">
          Log in to<br />continue listening
        </h2>
        {/* Inputs */}
        <form
          className="w-full mt-8 flex flex-col gap-4"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {/* Hidden dummy input to prevent Chrome autofill */}
          <input type="text" name="fakeusernameremembered" autoComplete="off" className="hidden" />
          <input type="password" name="fakepasswordremembered" autoComplete="off" className="hidden" />

          <div>
            <Label
              htmlFor="login_email"
              className="text-xs text-zinc-300 font-medium mb-2"
            >
              Email or username
            </Label>
            <Input
              id="login_email"
              name="usernameOrEmail"
              type="text"
              placeholder="Email or username"
              autoComplete="off"
              ref={emailRef}
              className="w-full rounded-md border-none bg-[#18181b] text-white/80 placeholder-zinc-400 py-3 px-4 text-base focus:outline-none focus:ring-0 focus:border-none focus:bg-[#18181b] hover:bg-[#18181b] active:bg-[#18181b]"
              style={{
                boxShadow: "none",
              }}
            />
          </div>
          <div>
            <Label
              htmlFor="login_pwd"
              className="text-xs text-zinc-300 font-medium mb-2"
            >
              Password
            </Label>
            <Input
              id="login_pwd"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              ref={passwordRef}
              className="w-full rounded-md border-none bg-[#18181b] text-white/80 placeholder-zinc-400 py-3 px-4 text-base focus:outline-none focus:ring-0 focus:border-none focus:bg-[#18181b] hover:bg-[#18181b] active:bg-[#18181b]"
              style={{
                boxShadow: "none",
              }}
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full mt-2 bg-green-500 hover:bg-green-500 active:bg-green-500 text-white rounded-md py-3 font-medium text-base shadow-none border-none focus:outline-none focus:ring-0"
            style={{ boxShadow: "none" }}

          >
            Sign in
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
          className="w-full hover:text-white/90 bg-[#18181b] border border-zinc-700 text-white/90 rounded-md py-4 font-medium text-base mb-6 flex items-center justify-center gap-2 shadow-none hover:bg-[#18181b] active:bg-[#18181b] focus:outline-none focus:ring-0"
          style={{ boxShadow: "none" }}
          type="button"
        >
          Continue with Google
        </Button>
        {/* Sign up */}
        <div className="text-zinc-400 text-sm">
          Don't have an account?{" "}
          <a
            href="/sign-up"
            className="text-white underline font-medium hover:text-green-500"
            tabIndex={0}
          >
            Sign up here
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
}
