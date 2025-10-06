/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import ForgetPassImg from "@/assets/img/Forgot password-amico 1.png";
import Link from "next/link";
import { useForgatPasswordMutation } from "@/redux/service/auth/authApi";
import { toast } from "sonner";

// --- Types ---
export interface ForgotPasswordProps {
  className?: string;
}

export default function ForgotPassword({ className = "" }: ForgotPasswordProps) {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false); // Track success state
  const [forgotPassword] = useForgatPasswordMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();   
    setErrorMessage(null);
    setSuccess(false);

    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await forgotPassword({ email }).unwrap();

      if (res?.success) {
        setSuccess(true);
        toast.success(res.message || "Password reset link sent!");
      } else {
        toast.error(res?.message || "Failed to send reset link.");
      }

      // Optionally call onSubmit callback
      // onSubmit?.(email);
    } catch (error: any) {
      const errorMsg = error?.data?.message || "Failed to send reset link. Please try again.";
      setErrorMessage(errorMsg);
      console.error("Password reset error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || !email.trim();

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 ${className}`}>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex justify-center">
          <div className="relative w-full max-w-md">
  <Link href="/">
            <Image
              src={ForgetPassImg}
              alt="Forgot password illustration"
              width={400}
              height={400}
              className="w-full h-auto object-contain"
              priority
            />
  </Link>
          </div>
        </div>

        {/* Right Side - Content (Form or Success) */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
            {!success ? (
              /* --- Forgot Password Form --- */
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Forgot Your Password?</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter your email and we&apos;ll send you a link to reset it.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane.doe@gmail.com"
                      required
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 text-sm transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isButtonDisabled}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                        Sending Reset Link...
                      </>
                    ) : (
                      "Reset Your Password"
                    )}
                  </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-6">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-orange-600 hover:text-orange-800 transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </>
            ) : (
              /* --- Success Confirmation Screen --- */
              <div className="text-center space-y-5">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-gray-900">Check Your Email</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-semibold text-gray-800">{email}</span>.
                  <br />
                  Please check your inbox and click the link to reset your password.
                </p>

                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                >
                  Back to reset form
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}