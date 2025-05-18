'use client';
import React, { useState, useEffect } from "react";
import { getDriverProfileById } from "@/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const email = sessionStorage.getItem("userEmail");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getDriverProfileById(email);
        const fetchedUser = response.data;
        setUser(fetchedUser);
        setIsActive(fetchedUser.isActive);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const deleteAccount = () => {
    sessionStorage.removeItem("user");
    console.log("Account deleted");
    window.location.href = "/";
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex max-h-screen flex-col bg-gradient-to-b from-background to-muted/50  dark:via-dark-900 dark:to-dark-800">
      <div className="container mx-auto flex-1 flex items-center justify-center py-10 px-4 mt-10 relative">
        <div className="w-full max-w-4xl bg-white dark:bg-dark-800 rounded-lg p-6 shadow-lg">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover mr-6"
              />
              <div>
                <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">{user.username}</h1>
                <p className="text-lg text-gray-500 dark:text-gray-300">{user.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-300">Member Since:</p>
              <p className="font-semibold text-gray-700 dark:text-gray-100">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Email</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Address</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.address[0] || "Not provided"}</p>
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">NIC</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.NIC || "Not provided"}</p>
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Current Order</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.currentOrder || "No active order"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
               
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Authorization</h2>
                <p className={`text-white px-4 py-2 rounded-full ${user.isAuthorized ? "bg-green-500" : "bg-yellow-500"}`}>
                  {user.isAuthorized ? "Authorized" : "Not Authorized"}
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated Section */}
          <div className="mt-6 text-right">
            <p className="text-sm text-gray-500 dark:text-gray-300">Last Updated:</p>
            <p className="font-semibold text-gray-700 dark:text-gray-100">{new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>

          {/* Danger Zone - Delete Account */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsDeletePopupOpen(true)}
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white dark:bg-dark-800 p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Are you sure you want to delete your account?</h2>
            <div className="mt-4 flex justify-around">
              <button
                onClick={() => setIsDeletePopupOpen(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="bg-red-500 text-white px-6 py-2 rounded-full"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
