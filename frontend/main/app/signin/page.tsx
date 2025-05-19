"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { ReusableForm } from "@/components/common/form";
import { validateLogin } from "@/utils/validation";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/api";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    emailOrUsername: "",
    password: "",
    general: "",
  });

  // Validation function for login form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      emailOrUsername: "",
      password: "",
      general: "",
    };

    if (!formData.emailOrUsername) {
      newErrors.emailOrUsername = "Email or username is required";
      isValid = false;
    } else if (formData.emailOrUsername.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailOrUsername)) {
        newErrors.emailOrUsername = "Invalid email format";
        isValid = false;
      }
    } else if (formData.emailOrUsername.length < 3) {
      newErrors.emailOrUsername = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await login(formData);

      if (response.data.message === "Session already active on this device") {
        setErrors((prev) => ({
          ...prev,
          general: "You are already logged in on this device.",
        }));
        router.push("/restaurants");
        return;
      }

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed. Please try again.");
      }

      // Save token in local storage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userProfile", JSON.stringify(response.data.user));
      console.log('====================================');
      console.log("Login successful:", response.data);
      console.log('====================================');
      localStorage.setItem("isLoggedIn", "true");

      // Redirect to the restaurants page
      router.push("/restaurants");
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrors((prev) => ({
        ...prev,
        general: error.message || "An error occurred while logging in.",
      }));
      if(error.message === 'Session already active on this device') {
        router.push("/restaurants");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/50 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800">
      <Navbar />
      <div className="container mx-auto flex-1 flex items-center justify-center py-12 px-4 mt-10 relative">
        <div className="w-full max-w-md space-y-8">
          {/* Header Section */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link
              href="/"
              className="absolute font-bold top-10 left-2 inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 dark:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to home
            </Link>
            <h1 className="text-3xl flex items-center gap-3 mt-5 font-bold text-primary-600 dark:text-primary-400">
              Welcome back
              <div className="flex items-center justify-center p-2 rounded-full bg-primary-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                  />
                </svg>
              </div>
            </h1>
            <p className="text-muted-foreground dark:text-white">
              Sign in to your QuickBite account
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <ReusableForm
                onSubmit={handleSubmit}
                buttonText="Sign In"
                validate={validateLogin}
                className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden p-6"
              >
                {/* Email or Username Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="emailOrUsername"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email or Username
                  </label>
                  <input
                    id="emailOrUsername"
                    name="emailOrUsername"
                    type="text"
                    value={formData.emailOrUsername}
                    onChange={handleChange}
                    placeholder="vihanganethusara00@gmail.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
                  />
                  {errors.emailOrUsername && (
                    <p className="text-red-500 text-sm">{errors.emailOrUsername}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="* * * * * *"
                      className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 dark:text-white" />
                      ) : (
                        <Eye className="h-5 w-5 dark:text-white" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* General Error Message */}
                {errors.general && (
                  <div className="bg-red-100 text-red-700 text-sm p-3 rounded-md">
                    {errors.general}
                  </div>
                )}

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-dark-700"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-normal text-gray-700 dark:text-gray-300"
                  >
                    Remember me for 30 days
                  </label>
                </div>
              </ReusableForm>
            </div>

            {/* Footer Section */}
            <div className="px-6 pb-6">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary-600 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}