'use client';
import React, { useState, useEffect } from "react";
import { getDriverProfileById } from "@/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import AuthenticationDocumentsPage from "./authenticationData";

const VehicleProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const email = sessionStorage.getItem("userEmail");

  const fetchUserData = async () => {
    try {
      const response = await getDriverProfileById(email);
      const fetchedUser = response.data;
      setUser(fetchedUser);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);
  
  if (loading) {
    return <div>Loading vehicle information...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!user || !user.authCertificates) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No vehicle data available</h2>
          <p className="text-gray-600 mb-6">You haven't added any vehicle information yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Add Vehicle
          </button>
    
          {isModalOpen && (
  <div className="w-full pt-10 absolute inset-0 bg-opacity-50 backdrop-blur-sm z-50">
    <AuthenticationDocumentsPage
      onClose={() => setIsModalOpen(false)}
      onSuccess={() => {
        setIsModalOpen(false);
        fetchUserData(); // Reload data after adding
      }}
    />
  </div>
)}

        </div>
      );  }

  const vehicle  = user.authCertificates;
  console.log('Vehicle',vehicle);

  return (
    <div className="flex max-h-screen flex-col bg-gradient-to-b from-background to-muted/50 dark:via-dark-900 dark:to-dark-800">
      <main className="container mx-auto flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="w-full max-w-8xl bg-white dark:bg-dark-800 rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-8">
            Vehicle Details
          </h1>

          <div className="space-y-8">
          <div className="max-w-40">
                <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Authorization</h2>
                <p className={`text-white px-4 py-2 rounded-full ${user.isAuthorized ? "bg-green-500" : "bg-yellow-500"}`}>
                  {user.isAuthorized ? "Authorized" : "Not Authorized"}
                </p>
              </div>
            {/* Row for Plate Number and Vehicle Type */}
            <div className="flex flex-wrap justify-center pt-5 gap-10">
                
              <div className="flex-1 min-w-[250px] text-center">
                <h2 className="font-semibold text-2xl text-gray-700 dark:text-gray-200 mb-2">Plate Number</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">{vehicle.licensePlateNumber || "Not provided"}</p>
              </div>
              <div className="flex-1 min-w-[250px] text-center">
                <h2 className="font-semibold text-2xl text-gray-700 dark:text-gray-200 mb-2">Vehicle Type</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">{vehicle.vehicleType || "Not provided"}</p>
              </div>
            </div>

            {/* Row for Images */}
            <div className="flex flex-wrap justify-center gap-6 mt-20">
              <div className="w-100 ">
                <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-2 text-center">License Image</h2>
                {vehicle.licenseImage ? (
                  <img src={vehicle.licenseImage} alt="License" className="w-full h-70 object-cover rounded-md" />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center">No license image uploaded</p>
                )}
              </div>

              <div className="w-100">
                <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-2 text-center">Insurance Image</h2>
                {vehicle.insuranceImage ? (
                  <img src={vehicle.insuranceImage} alt="Insurance" className="w-full h-70 object-cover rounded-md" />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center">No insurance image uploaded</p>
                )}
              </div>

              <div className="w-100">
                <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-2 text-center">Vehicle Image</h2>
                {vehicle.vehicleImage ? (
                  <img src={vehicle.vehicleImage} alt="Vehicle" className="w-full h-70 object-cover rounded-md" />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center">No vehicle image uploaded</p>
                )}
              </div>
            </div>

            {/* Button to Open Modal */}
            <div className="flex justify-center mt-10">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Change Vehicle
              </button>
            </div>

          </div>
        </div>
        {isModalOpen && (
  <div className="w-full pt-10 absolute inset-0 bg-opacity-50 backdrop-blur-sm z-50">
    <AuthenticationDocumentsPage
      onClose={() => setIsModalOpen(false)}
      onSuccess={() => {
        setIsModalOpen(false);
        fetchUserData(); // Reload data after adding
      }}
    />
  </div>
)}



      </main>
    </div>
  );
};

export default VehicleProfilePage;
