"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { activateAccount, resendOTP } from "@/api";
import { getCurrentUserRole } from "@/config";


export default function ActivationPage() {
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams: any = useSearchParams(); 
  const email = searchParams.get("email");
  const role = searchParams.get("role");


  console.log("role",role);
  
  const handleSubmitOtp = async () => {
    if (!otp.trim()) {
      setErrors("Please enter the OTP.");
      return;
    }
  
    if (!role) {
      setErrors("Role is missing.");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await activateAccount(email, otp, role);  // role must be passed
      if (response.success) {
        const role = getCurrentUserRole();
        if (role === "driver") {
          window.location.href = "/driver"; // or your intended driver dashboard route
        } else {
          window.location.href = "/restaurantOwner";
        }
      } else {
        throw new Error(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      setErrors(error.message || "An error occurred while verifying OTP.");
    } finally {
      setIsLoading(false);
    }
  };
  

   const handleResendOTP = async () => {
    
      setIsLoading(true);
      try {
        const response = await resendOTP(email);
        if(response) {
            setMessage(response.message);
        }  
      } catch (error: any) {
        console.error("resend otp failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/50 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800">
      <Navbar />
      <div className="container relative flex-1 flex items-center justify-center py-12 px-4 mt-10 mx-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              Activate Your Account
            </h1>
            <p className="text-muted-foreground dark:text-white">
              Enter the OTP sent to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden p-6 space-y-6">
            
            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setErrors(null);
                }}
                placeholder="Enter your OTP"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
              />
              {errors && (
                <p className="text-red-500 text-sm">{errors}</p>
              )}
            </div>

            <button
              onClick={handleSubmitOtp}
              disabled={isLoading}
              className="w-full py-2 px-4 bg-primary-600 text-white rounded-full font-medium transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg
                    className="inline mr-2 h-4 w-4 animate-spin"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="text-center text-sm cursor-pointer text-gray-600 dark:text-gray-400">
              Didn't receive the OTP?{" "}
              <p
              onClick={handleResendOTP}
                className="text-primary-600 hover:underline font-medium"
              >
                Resend OTP
              </p>
              {message }
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}