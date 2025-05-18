"use client";
import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Edit, Loader } from "lucide-react";
import { getUserProfile, updateProfile, deleteUserAccount } from "@/api";
import { placeholder } from "@/hooks/utilConsts";
import axios from "axios";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    password: "",
    address: [""],
    phoneNo: "",
    isActive: false,
    alergy: [],
    avatar: "",
    notifications: {
      email: true,
      push: true,
      sms: false,
      promotions: true,
    },
  });

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfileData({
        ...data,
        notifications: {
          email: true,
          push: true,
          sms: false,
          promotions: true,
        },
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...profileData.address];
    newAddresses[index] = value;
    setProfileData((prev) => ({
      ...prev,
      address: newAddresses,
    }));
  };

  const handleAddAddress = () => {
    setProfileData((prev) => ({
      ...prev,
      address: [...prev.address, ""],
    }));
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = profileData.address.filter((_, i) => i !== index);
    setProfileData((prev) => ({
      ...prev,
      address: newAddresses,
    }));
  };

  const handleAllergyChange = (index: number, value: string) => {
    const newAllergies: any = [...profileData.alergy];
    newAllergies[index] = value;
    setProfileData((prev) => ({
      ...prev,
      alergy: newAllergies,
    }));
  };

  const handleAddAllergy = () => {
    setProfileData((prev: any) => ({
      ...prev,
      alergy: [...prev.alergy, ""],
    }));
  };

  const handleRemoveAllergy = (index: number) => {
    const newAllergies = profileData.alergy.filter((_, i) => i !== index);
    setProfileData((prev) => ({
      ...prev,
      alergy: newAllergies,
    }));
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked,
      },
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'user_profile_photos');
  
      const cloudinaryRes = await axios.post(
        'https://api.cloudinary.com/v1_1/dxhzkog1c/image/upload',
        data
      );
  
      setProfileData(prev => ({
        ...prev,
        avatar: cloudinaryRes.data.secure_url
      }));
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile(profileData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteUserAccount();
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  

  console.log(profileData)

  return (
    <div className="space-y-6">
      {/* Profile Information Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-800">
                <Image
                  src={profileData.avatar ?  profileData.avatar : placeholder}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                />
                <button 
                  onClick={() => document.getElementById('avatar')?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold">{profileData.username}</h3>
              <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>
            </div>
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={profileData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={profileData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                id="phoneNo"
                name="phoneNo"
                type="tel"
                value={profileData.phoneNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
             <div className="space-y-2 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              {profileData.address.map((addr, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={addr}
                    onChange={(e) => handleAddressChange(index, e.target.value)}
                    placeholder={`Address Line ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => handleRemoveAddress(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddAddress}
                className="text-purple-500 hover:text-purple-700"
              >
                Add Address
              </button>
            </div> 
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Allergies</label>
              {profileData.alergy.map((allergy, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={allergy}
                    onChange={(e) => handleAllergyChange(index, e.target.value)}
                    placeholder={`Allergy ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => handleRemoveAllergy(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddAllergy}
                className="text-purple-500 hover:text-purple-700"
              >
                Add Allergy
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 py-4  dark:bg-gray-750 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-800 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Notification Preferences Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive order updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profileData.notifications.email}
                  onChange={(e) => handleNotificationChange("email", e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive real-time updates on your device</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profileData.notifications.push}
                  onChange={(e) => handleNotificationChange("push", e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive text messages for important updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profileData.notifications.sms}
                  onChange={(e) => handleNotificationChange("sms", e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Marketing & Promotions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive special offers and promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profileData.notifications.promotions}
                  onChange={(e) => handleNotificationChange("promotions", e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-red-200 dark:border-red-900">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-500">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}