"use client";

import Image from "next/image";
import React, { useState, FormEvent } from "react";
// Replace this import path with your actual OTP illustration image path
import otpImg from "@/assets/img/Email campaign-rafiki 1.png";
import Link from "next/link";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading] = useState(false);

  const isButtonDisabled = isLoading || isSubmitting || otp.trim().length === 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp.trim()) return;

    setIsSubmitting(true);   

    try {
      // Replace this with your actual verification logic
      console.log("Verifying OTP:", otp);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("OTP verified successfully!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4`}>
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex justify-center">
          <div className="relative w-full max-w-md">
<Link href="/">

            <Image
              src={otpImg}
              alt="Forgot password illustration showing a person next to a computer screen"
              width={400}
              height={400}
              className="w-full h-auto"
              priority
            />
</Link>
          </div>
        </div>

        {/* Right side - OTP Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verify Your Email</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
