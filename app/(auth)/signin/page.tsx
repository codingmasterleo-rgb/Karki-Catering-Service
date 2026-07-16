// app/(auth)/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Separator } from "react-resizable-panels";

const loginSchema = z.object({
  login: z.string().min(3, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    const result = await signIn("credentials", {
      email: data.login,
      password: data.password,
    });
    console.log("SignIn result:", result);
    if (result?.error) {
      setError(result.error || "Invalid credentials. Please try again.");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 p-8 shadow-none transition-colors">
      {/* Header */}
      <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Get in to KCS
      </h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        Enter your credentials to access your account.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 border-b py-4">
        {/* Login field (email or username) */}
        <div className="space-y-1.5">
          <label
            htmlFor="login"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
          >
            Email or Username <span className="text-red-500">*</span>
          </label>
          <input
            id="login"
            type="text"
            {...register("login")}
            placeholder="user@example.com"
            className={`w-full rounded-none border bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-0 transition-colors
              ${
                errors.login
                  ? "border-red-500"
                  : "border-zinc-300 dark:border-zinc-700 focus:border-red-500"
              }
            `}
          />
          {errors.login && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.login.message}
            </p>
          )}
        </div>

        {/* Password field with show/hide */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className={`w-full rounded-none border bg-white dark:bg-zinc-900 px-3 py-2.5 pr-10 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-0 transition-colors
                ${
                  errors.password
                    ? "border-red-500"
                    : "border-zinc-300 dark:border-zinc-700 focus:border-red-500"
                }
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-zinc-400 hover:text-red-500 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 border border-red-500 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300 transition-colors">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-none bg-red-600 cursor-pointer px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>

        {/* Forgot password link */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/forgot-password"
            className="font-semibold text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400 underline-offset-4 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </p>
      </form>
      

      {/* Register redirect */}
      <p className=" border-t border-zinc-200 dark:border-zinc-800 pt-4 text-center text-sm text-zinc-500 dark:text-zinc-400 transition-colors">
        Have Invitation Code{" "}
        <Link
          href="/signup"
          className="font-semibold text-red-600 hover:text-red-600 dark:text-red-500 dark:hover:text-red-600 hover:underline transition-colors"
        >
          Create One
        </Link>
      </p>
    </div>
  );
}