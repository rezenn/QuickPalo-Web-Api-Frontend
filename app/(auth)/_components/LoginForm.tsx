"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginData, loginSchema } from "../schema";
import { startTransition, useTransition } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [pending, setTransition] = useTransition();

  const submit = async (values: LoginData) => {
    setTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard");
    });
    console.log("login", values);
  };

  return (
    <div className=" w-full max-w-md px-6 py-6">
      <h1 className="text-black/80 text-3xl font-extrabold text-center mb-8 ">
        Login
      </h1>
      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        {/* Email  */}
        <div>
          <label className="block text-md w-lg text-black/60 font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="h-12 w-full rounded-md border border-black/30 bg-white px-4 text-black focus:outline-none focus:border-black/60"
            {...register("email")}
            placeholder="example@mail.com"
          />
          {errors.email?.message && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        {/* password */}
        <div>
          <label className="block text-md text-black/60 font-semibold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="h-12 w-full rounded-md border border-black/30 bg-white px-4 text-black focus:outline-none focus:border-black/60"
              {...register("password")}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="
        absolute right-3 top-1/2 -translate-y-1/2
        text-gray-600 hover:text-purple-700
        focus:outline-none
      "
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password?.message && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* submit button */}
        <button
          type="submit"
          disabled={isSubmitting || pending}
          className=" h-12 w-full mt-10 text-xl text-bold bg-purple-700  rounded-xl"
        >
          {isSubmitting || pending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
