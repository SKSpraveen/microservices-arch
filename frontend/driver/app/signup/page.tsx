"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "@/api";
import { setCurrentUserRole } from "@/config";

export default function SignUpPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"driver" | "restaurantOwner">("driver");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const [driverForm, setDriverForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
  });

  const [ownerForm, setOwnerForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    restaurantName: "",
    restaurantAddress: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleDriverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDriverForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const validateForm = () => {
    let isValid = true;
    const newErrors: any = {};

    if (activeTab === "driver") {
      const { username, email, phoneNumber, password, address } = driverForm;
      if (!username || username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
        isValid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Invalid email";
        isValid = false;
      }
      if (!/^\d{10}$/.test(phoneNumber)) {
        newErrors.phoneNumber = "Phone must be 10 digits";
        isValid = false;
      }
      if (!password || password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      if (!address) {
        newErrors.address = "Address is required";
        isValid = false;
      }
    } else {
      const { username, email, phoneNumber, password, restaurantName, restaurantAddress } = ownerForm;
      if (!username || username.length < 3) {
        newErrors.username = "Owner name must be at least 3 characters";
        isValid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Invalid email";
        isValid = false;
      }
      if (!/^\d{10}$/.test(phoneNumber)) {
        newErrors.phoneNumber = "Phone must be 10 digits";
        isValid = false;
      }
      if (!password || password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      if (!restaurantName) {
        newErrors.restaurantName = "Restaurant name is required";
        isValid = false;
      }
      if (!restaurantAddress) {
        newErrors.restaurantAddress = "Restaurant address is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: any) => {
    console.log("Submitting...");
    e.preventDefault();
  
    // Simple validation
    const form = activeTab === "driver" ? driverForm : ownerForm;
    if (!form.email || !form.password || !form.username || !form.phoneNumber) {
      setErrors((prev: any) => ({
        ...prev,
        general: "Please fill all required fields.",
      }));
      return;
    }
  
    if (!["driver", "restaurantOwner"].includes(activeTab)) {
      setErrors((prev: any) => ({
        ...prev,
        general: "Invalid role selected.",
      }));
      return;
    }
  
    setIsLoading(true);
    try {
      const dataToSubmit = {
        ...form,
        role: activeTab,
      };
  
      console.log("Submitting form data", dataToSubmit);
  
      const response = await signup(dataToSubmit);
      if (response?.data?.email && response?.data?.role) {
        router.push(`/activation?email=${response.data.email}&role=${response.data.role}`);
        localStorage.setItem("userRole", response.data.role);
        setCurrentUserRole(response.data.role);
        localStorage.setItem("userProfile", JSON.stringify(response.data));
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (err: any) {
      setErrors((prev: any) => ({
        ...prev,
        general: err.message || "Signup failed.",
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderInput = (
    label: string,
    name: string,
    value: string,
    role: "driver" | "restaurantOwner",
    type: string = "text"
  ) => {
    const onChange = role === "driver" ? handleDriverChange : handleOwnerChange;
  
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none dark:bg-dark-700 dark:text-white"
        />
        {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
      </div>
    );
  };
  const handleTabChange = (tab: "driver" | "restaurantOwner") => {
    setActiveTab(tab);
    setCurrentUserRole(tab);
  };
  
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-dark-900 dark:to-dark-800">
      <Navbar />

      <div className="container mx-auto flex-1 px-4 py-12">
        <div className="max-w-md mx-auto bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-primary-600 dark:text-primary-400">
            Sign Up
          </h2>

          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === "driver" ? "bg-primary-500 text-white" : "bg-gray-200 dark:bg-dark-700 dark:text-white"}`}
              onClick={() => handleTabChange("driver")}
            >
              Driver
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === "restaurantOwner" ? "bg-primary-500 text-white" : "bg-gray-200 dark:bg-dark-700 dark:text-white"}`}
              onClick={() => handleTabChange("restaurantOwner")}
            >
              Restaurant Owner
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "driver" ? (
              <>
                {renderInput("Username", "username", driverForm.username, "driver")}
                {renderInput("Email", "email", driverForm.email, "driver", "email")}
                {renderInput("Phone Number", "phoneNumber", driverForm.phoneNumber, "driver", "tel")}
                {renderInput("Address", "address", driverForm.address, "driver")}
                {renderInput("Password", "password", driverForm.password, "driver", passwordVisibility ? "text" : "password")}
                <div className="flex justify-end">
                  <button type="button" onClick={() => setPasswordVisibility((p) => !p)} className="text-sm text-primary-600">
                    {passwordVisibility ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </>
            ) : (
              <>
                {renderInput("Owner Name", "username", ownerForm.username, "restaurantOwner")}
                {renderInput("Email", "email", ownerForm.email, "restaurantOwner", "email")}
                {renderInput("Phone Number", "phoneNumber", ownerForm.phoneNumber, "restaurantOwner", "tel")}
                {renderInput("Password", "password", ownerForm.password, "restaurantOwner", passwordVisibility ? "text" : "password")}
                <div className="flex justify-end">
                  <button type="button" onClick={() => setPasswordVisibility((p) => !p)} className="text-sm text-primary-600">
                    {passwordVisibility ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                
              </>
            )}

            {errors.general && <div className="text-red-500 text-sm">{errors.general}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
