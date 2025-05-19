"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { ReusableForm } from "@/components/common/form";
import { validateSignIn } from "@/utils/validation";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "@/api";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    general: "",
  });
  const [passwordVisibility, setPasswordVisibiliy] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      address: "",
      general: "",
    };

    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
        isValid = false;
      }
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibiliy((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault;
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const response = await signup(formData);
      if (response?.data?.email) {
        localStorage.setItem("userProfile", JSON.stringify(response.data));
        router.push(`/activation?email=${response.data.email}`);
      } else {
        throw new Error("Unexpected response from the server");
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      setErrors((prev) => ({
        ...prev,
        general: error.message || "An error occurred while signing you up.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/50 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800">
      <Navbar />
      <div className="container relative flex-1 flex items-center justify-center py-12 px-4 mt-10 mx-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2 text-center ">
            <Link
              href="/"
              className="absolute top-10 left-3 inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 dark:text-white"
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

            <h1 className="flex items-center gap-3 mt-5 text-3xl font-bold text-primary-600 dark:text-primary-400">
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
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <ReusableForm
                onSubmit={handleSubmit}
                buttonText="Sign Up"
                validate={validateSignIn}
                className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden p-6"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Vihanga Mallawaarachchi"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vihanganethusara00@gmail.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="074 331 8215"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <span>Password</span>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="focus:outline-none text-sm"
                    >
                      {!passwordVisibility ? (
                        <Eye className="dark:text-white text-primary-600 text-sm" />
                      ) : (
                        <EyeOff className="dark:text-white text-primary-600 text-sm" />
                      )}
                    </button>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={passwordVisibility ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="* * * * * *"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="No 32/E/1, pore, athurugiriya"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
                  ></textarea>
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                </div>

                {errors.general && (
                  <div className="bg-red-100 text-red-700 text-sm p-3 rounded-md">
                    {errors.general}
                  </div>
                )}
              </ReusableForm>
            </div>
            <div className="px-6 pb-6">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                have an account?{" "}
                <Link
                  href="/signin"
                  className="text-primary-600 hover:underline font-medium"
                >
                  Sign in
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
