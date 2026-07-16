// app/(auth)/register/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";

const registerSchema = z
    .object({
        invitationCode: z.string().min(1, "Invitation code is required"),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must be at most 30 characters"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Enter a valid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setError("");
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    invitationCode: data.invitationCode,
                    username: data.username,
                    email: data.email,
                    password: data.password,
                }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message || "Registration failed. Please try again.");
            }

            // Registration successful – redirect to login with success query
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="w-full max-w-4xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-none transition-colors">
            {/* Header */}
            <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Request access to KCS
            </h1>
            <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
                Enter your invitation code and create your account.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Invitation code */}
                <div className="space-y-1.5 w-full">
                    <label
                        htmlFor="invitationCode"
                        className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
                    >
                        Invitation code <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="invitationCode"
                        type="text"
                        {...register("invitationCode")}
                        placeholder="e.g. KCS‑2026‑XXXX"
                        className={`w-full rounded-none border bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-0 transition-colors
              ${errors.invitationCode
                                ? "border-red-500"
                                : "border-zinc-300 dark:border-zinc-700 focus:border-red-500"
                            }
            `}
                    />
                    {errors.invitationCode && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.invitationCode.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Username */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="username"
                            className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
                        >
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            {...register("username")}
                            placeholder="Your preferred username"
                            className={`w-full rounded-none border bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-0 transition-colors
              ${errors.username
                                    ? "border-red-500"
                                    : "border-zinc-300 dark:border-zinc-700 focus:border-red-500"
                                }
            `}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
                        >
                            Email address <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="you@example.com"
                            className={`w-full rounded-none border bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-0 transition-colors
              ${errors.email
                                    ? "border-red-500"
                                    : "border-zinc-300 dark:border-zinc-700 focus:border-red-500"
                                }
            `}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Password */}
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
                                placeholder="At least 8 characters"
                                className={`w-full rounded-none border bg-white dark:bg-zinc-900 px-3 py-2.5 pr-10 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-0 transition-colors
                ${errors.password
                                        ? "border-red-500"
                                        : "border-zinc-300 dark:border-zinc-700 focus:border-red-500"
                                    }
              `}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="cursor-pointer absolute right-4 top-3.5 text-zinc-400 hover:text-red-500 transition-colors"
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

                    {/* Confirm password */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-zinc-700 dark:text-zinc-400"
                        >
                            Confirm password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                placeholder="Re-enter your password"
                                className={`w-full rounded-none border bg-white dark:bg-zinc-900 px-3 py-2.5 pr-10 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-0 transition-colors
                ${errors.confirmPassword
                                        ? "border-red-500"
                                        : "border-zinc-300 dark:border-zinc-700 focus:border-red-500"
                                    }
              `}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="cursor-pointer absolute right-4 top-3.5 text-zinc-400 hover:text-red-500 transition-colors"
                                aria-label={
                                    showConfirmPassword ? "Hide password" : "Show password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
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
                    className="w-full rounded-none cursor-pointer bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating account…
                        </>
                    ) : (
                        "Create account"
                    )}
                </button>
            </form>

            {/* Sign in redirect */}
            <p className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-4 text-center text-sm text-zinc-500 dark:text-zinc-400 transition-colors">
                If You Are A Member{" "}
                <Link
                    href="/signin"
                    className="font-semibold text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400 hover:underline transition-colors"
                >
                    Get In
                </Link>
            </p>
        </div>
    );
}