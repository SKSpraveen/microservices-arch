'use client';
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { getDriverProfileById } from "@/api";



const ProfilePage = () => {
  // State to hold the user data and loading/error states
  const [user, setUser] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(true); // Track activation state
  const email = sessionStorage.getItem("userEmail");


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getDriverProfileById(email);
        console.log(response);
        
        const fetchedUser = response.data;
        setUser(fetchedUser);
        setIsActive(fetchedUser.isActive);

      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Function to delete the user account
  const deleteAccount = () => {
    sessionStorage.removeItem("user"); // Remove user from sessionStorage
    // Optionally, make a request to the backend to delete the user
    console.log("Account deleted");

    // Redirect to the home page or login page after deletion
    window.location.href = "/";
  };

  // If user data is not loaded yet, display a loading message
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center items-center mb-6">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover mr-6"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
                <p className="text-lg text-gray-500">{user.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Member Since:</p>
              <p className="font-semibold text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-lg text-gray-700">Email</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-700">Address</h2>
                <p className="text-gray-600">{user.address[0] || "Not provided"}</p>
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-700">NIC</h2>
                <p className="text-gray-600">{user.NIC || "Not provided"}</p>
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-700">Current Order</h2>
                <p className="text-gray-600">{user.currentOrder || "No active order"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-lg text-gray-700">Status</h2>
             
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-700">Authorization</h2>
                <p className={`text-white px-4 py-2 rounded-full ${user.isAuthorized ? "bg-green-500" : "bg-yellow-500"}`}>
                  {user.isAuthorized ? "Authorized" : "Not Authorized"}
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated Section */}
          <div className="mt-6 text-right">
            <p className="text-sm text-gray-500">Last Updated:</p>
            <p className="font-semibold text-gray-700">{new Date(user.updatedAt).toLocaleDateString()}</p>
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
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold text-center text-gray-800">Are you sure you want to delete your account?</h2>
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
