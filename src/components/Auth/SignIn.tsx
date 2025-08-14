"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLoginUserMutation } from "@/redux/service/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser, UserType } from "@/redux/features/auth";
import LoginImg from "@/assets/img/Login-amico 1.png";
import { jwtDecode, JwtPayload } from "jwt-decode";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      const res = await loginUser(payload).unwrap();
      console.log(res, "result form login");

      if (res?.success) {
        const user: UserType = jwtDecode(res.data.access_token);
        // Redux
        dispatch(
          setUser({
            user: user,
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token,
          })
        );

        // Cookies
        Cookies.set("accessToken", res.data.access_token);
        Cookies.set("refreshToken", res.data.refresh_token);

        if (rememberMe) {
          Cookies.set("rememberMe", "true", { expires: 30 });
        } else {
          Cookies.remove("rememberMe");
        }

        toast.success(res.message || "Login successful");
        router.push("/");
      } else {
        toast.error(res?.message || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Side Image */}
        <div className="hidden lg:flex justify-center">
          <Image
            src={LoginImg}
            alt="Login illustration"
            width={400}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Login
            </h1>
            <p className="text-gray-600 text-base">Sign in to your account</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="jane.doe@gmail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="/forget-password"
                  className="text-sm text-[#E57931] hover:text-[#d49b7c]"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#E57931] focus:border-[#E57931]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#E57931] focus:ring-[#E57931] border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-600 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#E57931] text-white text-sm font-medium rounded-md shadow-sm hover:bg-[#d49b7c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Continue
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or log in with
              </span>
            </div>
          </div>

          <p className="text-sm text-center text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#E57931] hover:text-[#d49b7c] font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
