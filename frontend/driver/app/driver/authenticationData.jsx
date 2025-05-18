"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { addAuthenticationDocuments, addVehicleForDriver, getAuthenticationDocuments } from "@/api"; // assumed

export default function AuthenticationDocumentsPage({onClose, onSuccess}) {
  const [form, setForm] = useState({
    licensePlateNumber: "",
    vehicleType:"",
    vehicleImage: null,
    insuranceImage: null,
    licenseImage: null,
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const email = sessionStorage.getItem('userEmail');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!form.licensePlateNumber.trim()) {
      newErrors.licensePlateNumber = "Number plate is required.";
      isValid = false;
    }
    if (!form.vehicleType.trim()) {
        newErrors.vehicleType = "Vehicle type is required.";
        isValid = false;
      }
      
    // if (!form.vehicleImage) {
    //   newErrors.vehicleImage = "NIC image is required.";
    //   isValid = false;
    // }
    // if (!form.insuranceImage) {
    //   newErrors.insuranceImage = "Insurance image is required.";
    //   isValid = false;
    // }
    // if (!form.licenseImage) {
    //   newErrors.licenseImage = "License image is required.";
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;


    setIsUploading(true);
    try {
        const vehicleImageUrl = form.vehicleImage ? await uploadToCloudinary(form.vehicleImage) : null;
    const insuranceImageUrl = form.insuranceImage ? await uploadToCloudinary(form.insuranceImage) : null;
    const licenseImageUrl = form.licenseImage ? await uploadToCloudinary(form.licenseImage) : null;

      await addVehicleForDriver(email,{
        vehicleType: form.vehicleType,
        licensePlateNumber: form.licensePlateNumber,
        vehicleImage: vehicleImageUrl,
        insuranceImage: insuranceImageUrl,
        licenseImage: licenseImageUrl,
      });
      console.log("Successfully uploaded documents");
      onSuccess(); 
      // Reset form
      setForm({
        numberPlate: "",
        vehicleType:"",
        vehicleImage: null,
        insuranceImage: null,
        licenseImage: null,
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ general: err.message || "Failed to upload documents." });
    } finally {
      setIsUploading(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/dxhzkog1c/image/upload`;  // ← Replace
    const preset = "user_profile_photos"; // ← Replace
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
  
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }
  
    const data = await res.json();
    return data.secure_url; // this is the URL you want
  };
  

  return (
    <div className="w-full">
        <button
  onClick={onClose}
  className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
>
  ✕
</button>

      <main className="container mx-auto flex-1  py-12">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-dark-900 p-8 rounded-2xl shadow-lg">          {/* Upload Form */}
          

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          

          <label htmlFor="nic" className="block text-lg font-medium text-black dark:text-white">
    Vehicle Number
  </label>
  <input
    id="licensePlateNumber"
    name="licensePlateNumber"
    type="text"
    value={form.licensePlateNumber}
    onChange={handleChange}
    placeholder="nw BBG 3413"
    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
  />
          <label
  htmlFor="vehicleType"
  className="block text-lg font-medium text-black dark:text-white"
>
  Vehicle Type
</label>
<select
  id="vehicleType"
  name="vehicleType"
  value={form.vehicleType}
  onChange={handleChange}
  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
>
  <option value="">Select vehicle type</option>
  <option value="Car">Car</option>
  <option value="Van">Van</option>
  <option value="Bike">Bike</option>
  <option value="Three-Wheeler">Three-Wheeler</option>
  <option value="Truck">Truck</option>
</select>

          <div className="space-y-1 border rounded-lg p-4 shadow-sm bg-gray-700 hover:bg-gray-600 transition duration-300">
  <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 ">
    Vehicle Image
  </label>

  <div className="flex flex-col items-center justify-center space-y-2">
    <label
      htmlFor="vehicleImage"
      className="cursor-pointer px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
    >
      Choose File
    </label>
    <span className="text-gray-500 dark:text-gray-400 text-sm">
      {form.vehicleImage ? form.vehicleImage.name : "No file chosen"}
    </span>
  </div>

  <input
    id="vehicleImage"
    type="file"
    accept="image/*"
    name="vehicleImage"
    onChange={handleFileChange}
    className="hidden"
  />

  {errors.vehicleImage && <p className="text-red-500 text-sm text-center">{errors.vehicleImage}</p>}
</div>

<div className="space-y-1 border rounded-lg p-4 shadow-sm bg-gray-700 hover:bg-gray-600 transition duration-300">
  <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 ">
    Insurance Image
  </label>

  <div className="flex flex-col items-center justify-center space-y-2">
    <label
      htmlFor="insuranceImage"
      className="cursor-pointer px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
    >
      Choose File
    </label>
    <span className="text-gray-500 dark:text-gray-400 text-sm">
      {form.insuranceImage ? form.insuranceImage.name : "No file chosen"}
    </span>
  </div>

  <input
    id="insuranceImage"
    type="file"
    accept="image/*"
    name="insuranceImage"
    onChange={handleFileChange}
    className="hidden"
  />

  {errors.insuranceImage && <p className="text-red-500 text-sm text-center">{errors.insuranceImage}</p>}
</div>


<div className="space-y-1 border rounded-lg p-4 shadow-sm bg-gray-700 hover:bg-gray-600 transition duration-300">
  <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 ">
    License Image
  </label>

  <div className="flex flex-col items-center justify-center space-y-2">
    <label
      htmlFor="licenseImage"
      className="cursor-pointer px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
    >
      Choose File
    </label>
    <span className="text-gray-500 dark:text-gray-400 text-sm">
      {form.licenseImage ? form.licenseImage.name : "No file chosen"}
    </span>
  </div>

  <input
    id="licenseImage"
    type="file"
    accept="image/*"
    name="licenseImage"
    onChange={handleFileChange}
    className="hidden"
  />

  {errors.licenseImage && <p className="text-red-500 text-sm text-center">{errors.licenseImage}</p>}
</div>



            {errors.general && <div className="text-red-500 text-sm">{errors.general}</div>}

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
            >
              {isUploading ? "Uploading..." : "Add Documents"}
            </button>
          </form>

          {/* Divider */}
          <hr className="my-8 border-gray-300 dark:border-gray-700" />

       

          {isFetching ? (
            <p>Loading documents...</p>
          ) : (
            <div className="space-y-4">
              {documents.length === 0 ? (
                <p>No documents uploaded yet.</p>
              ) : (
                documents.map((doc, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg dark:border-dark-600"
                  >
                    <p className="font-medium">Number Plate: {doc.numberPlate}</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <img src={doc.nicImageUrl} alt="NIC" className="h-24 object-cover rounded" />
                      <img src={doc.insuranceImageUrl} alt="Insurance" className="h-24 object-cover rounded" />
                      <img src={doc.licenseImageUrl} alt="License" className="h-24 object-cover rounded" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
