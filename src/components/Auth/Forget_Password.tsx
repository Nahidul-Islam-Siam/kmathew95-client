"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import ForgetPassImg from "@/assets/img/Forgot password-amico 1.png";
import Link from "next/link";

export interface ForgotPasswordProps {
  onSubmit?: (email: string) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPassword({
  onSubmit,
  isLoading = false,
  className = "",
}: ForgotPasswordProps) {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(email);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isLoading || isSubmitting || !email.trim();

  return (
    <div
      className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${className}`}
    >
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex justify-center">
          <div className="relative w-full max-w-md">
            <Image
              src={ForgetPassImg}
              alt="Forgot password illustration showing a person next to a computer screen"
              width={400}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Right side - Forgot Password Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Forgot Password?
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@gmail.com"
                  required
                  disabled={isLoading || isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={isButtonDisabled}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E57931] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Reset your password"
                )}
              </button>
            </form>

			<p className="text-sm text-center text-gray-600 mt-6">
              Remember Your Password!{" "}
              <Link
                href="/login"
                className="text-[#E57931] hover:text-[#d49b7c] font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
