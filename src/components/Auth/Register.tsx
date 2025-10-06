/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import SignUpImg from "@/assets/img/Sign up-bro 1.png";
import { useRegisterUserMutation } from "@/redux/service/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import VerificationModal from "../VerificationModal/VerificationModal";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth";

type FormValues = {
  username: string;
  email: string;
  description: string;
  contactNo: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Optional: "Remember Me"

  const [registerUser] = useRegisterUserMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const password = watch("password");

  const onSubmit = async (data: FormValues) => {
    const { confirmPassword, ...rest } = data;

    const payload = {
      username: rest.username,
      email: rest.email,
      description: rest.description,
      contactNo: rest.contactNo,
      password: rest.password,
      trader: {
        fastName: rest.firstName,
        lastName: rest.lastName,
      },
    };

    try {
      const res = await registerUser(payload).unwrap();

      console.log("Registration Response:", res);

      if (res?.success) {
        const { access_token, refresh_token, user } = res.data;

        // ✅ Dispatch full user + tokens
        dispatch(
          setUser({
            user, // full user object from API
            accessToken: access_token,
            refreshToken: refresh_token || "", // fallback
          })
        );

        // 🍪 Save tokens to cookies
        const tokenExpiry = rememberMe ? 30 : 7;
        Cookies.set("accessToken", access_token, { expires: tokenExpiry });

        if (refresh_token) {
          Cookies.set("refreshToken", refresh_token, { expires: rememberMe ? 60 : 14 });
        }

        // 🔐 Handle "Remember Me"
        if (rememberMe) {
          Cookies.set("rememberMe", "true", { expires: 30 });
        } else {
          Cookies.remove("rememberMe");
        }

        toast.success(res.message || "Registration successful!");
        setIsModalVisible(true);
      } else {
        toast.error(res?.message || "Registration failed.");
      }
    } catch (error: any) {
      const errorMsg = error?.data?.message || "Something went wrong during registration.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Image (Hidden on mobile) */}
        <div className="hidden lg:flex justify-center">
          <div className="relative w-full max-w-md">
            <Link href="/">
            
            <Image
              src={SignUpImg}
              alt="Signup illustration"
              width={400}
              height={400}
              className="w-full h-auto"
              priority
            />
            </Link>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Register</h1>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-center text-gray-600 text-base font-medium">
              Sign up to your account
            </p>

            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  {...register("firstName", { required: "First name is required" })}
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E57931] outline-none"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  {...register("lastName", { required: "Last name is required" })}
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E57931] outline-none"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                {...register("username", { required: "Username is required" })}
                id="username"
                type="text"
                placeholder="trader_jon"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E57931] outline-none"
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Email is not valid",
                  },
                })}
                id="email"
                type="email"
                placeholder="jane.doe@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E57931] outline-none"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Contact No */}
            <div>
              <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">
                Contact No
              </label>
              <input
                {...register("contactNo", { required: "Contact number is required" })}
                id="contactNo"
                type="tel"
                placeholder="+8801772593924"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E57931] outline-none"
              />
              {errors.contactNo && (
                <p className="text-sm text-red-500 mt-1">{errors.contactNo.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                {...register("description", { required: "Description is required" })}
                id="description"
                type="text"
                placeholder="System administrator for the platform"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E57931] outline-none"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>   

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E57931] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#E57931]"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E57931] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#E57931]"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#E57931] focus:ring-[#E57931] border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#E57931] text-white text-sm font-medium rounded-md shadow-sm hover:bg-[#d49b7c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E57931]"
            >
              Continue
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#E57931] hover:text-[#d49b7c] font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalVisible && (
        <VerificationModal
          open={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            // Optional: redirect after verification
            // router.push("/dashboard");
          }}
        />
      )}
    </div>
  );
}