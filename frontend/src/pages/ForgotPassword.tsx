import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { sendPasswordResetEmail } from "@/api/api";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (email: string) => sendPasswordResetEmail(email),
    onSuccess: (data) => {
      setSuccessMessage("Password reset email sent successfully.");
      setErrorMessage(null);
      reset();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Something went wrong.";
      setErrorMessage(msg);
      setSuccessMessage(null);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data.email);
  };

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
          Forgot your password?
        </h2>

        <p className="text-zinc-400 text-sm text-center mt-2">
          Enter your email and we’ll send you a reset link.
        </p>

        <form className="w-full mt-8 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Label htmlFor="reset_email" className="text-xs text-zinc-300 font-medium mb-2">
              Email address
            </Label>
            <Input
              id="reset_email"
              type="email"
              placeholder="Enter your email"
              autoComplete="off"
              {...register("email")}
              className="w-full rounded-md border-none bg-[#18181b] text-white/80 placeholder-zinc-400 py-3 px-4 text-base focus:outline-none"
              style={{ boxShadow: "none" }}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
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
            disabled={isSubmitting || mutation.isPending}
            className="w-full mt-2 bg-green-500 hover:bg-green-500 active:bg-green-500 text-white rounded-md py-3 font-medium text-base shadow-none border-none focus:outline-none"
            style={{ boxShadow: "none" }}
          >
            {mutation.isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <div className="mt-6">
          <a
            href="/sign-in"
            className="text-zinc-400 text-sm underline hover:text-white transition-colors"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
