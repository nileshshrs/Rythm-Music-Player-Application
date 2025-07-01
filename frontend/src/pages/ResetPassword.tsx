import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { resetPassword } from "@/api/api";

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const verificationCode = searchParams.get("code");
  const expiresAt = searchParams.get("exp");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: ({ password }: { password: string }) =>
      resetPassword({ password, verificationCode: verificationCode || "" }),

    onSuccess: () => {
      setSuccessMessage("Password reset successful. Redirecting to login...");
      setErrorMessage(null);
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    },

    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to reset password.";
      setErrorMessage(msg);
      setSuccessMessage(null);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({ password: data.password });
  };

  // Redirect if invalid or expired link
  useEffect(() => {
    if (!verificationCode || !expiresAt) {
      navigate("/forgot-password", { replace: true });
      return;
    }
    const exp = parseInt(expiresAt);
    if (isNaN(exp) || Date.now() > exp) {
      navigate("/forgot-password", { replace: true });
    }
  }, [verificationCode, expiresAt, navigate]);

  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-gradient-to-b from-zinc-800 to-zinc-900 px-10 py-12 flex flex-col items-center">
        <div className="mb-5">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-20 h-20 aspect-square object-contain rounded-xl"
          />
        </div>

        <h2 className="font-bold text-2xl text-white text-center leading-tight">
          Reset your password
        </h2>

        <p className="text-zinc-400 text-sm text-center mt-2">
          Enter a new password for your account.
        </p>

        <form
          className="w-full mt-8 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <Label htmlFor="password" className="text-xs text-zinc-300 font-medium mb-2">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              {...register("password")}
              className="w-full rounded-md border-none bg-[#18181b] text-white/80 placeholder-zinc-400 py-3 px-4 text-base focus:outline-none"
              style={{ boxShadow: "none" }}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-400 text-xs mt-1">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-400 text-xs mt-1">{successMessage}</p>
          )}

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full mt-2 bg-green-500 hover:bg-green-500 active:bg-green-500 text-white rounded-md py-3 font-medium text-base shadow-none border-none focus:outline-none"
            style={{ boxShadow: "none" }}
          >
            {mutation.isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <div className="mt-6">
          <a
            href="/login"
            className="text-zinc-400 text-sm underline hover:text-white transition-colors"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
