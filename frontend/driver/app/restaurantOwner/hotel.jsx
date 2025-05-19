'use client';

import { fetchRestaurants } from '@/api';
import { createRestaurant } from '@/api'; 
import { updateHotel } from '@/api'; 
import { deleteHotel } from '@/api';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Hotel() {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [addHotelClick, setAddHotelClick] = useState(false);
  const [newHotel, setNewHotel] = useState({
    userID: '',
    hotelName: '',
    hotelAddress: '',
    location: '',
    opentime: '',
    rating: '',
    categoriesprovider: '',
    cousinProvided: '',
    banner: '',
  });
  const fileRef = useRef(null);
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    cuisine: "",
    dietary: "",
    search: "",
    location: "",
    sort: "a-z",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!newHotel.hotelName) newErrors.hotelName = "Hotel name is required";
    if (!newHotel.hotelAddress) newErrors.hotelAddress = "Hotel address is required";
    if (!newHotel.location) newErrors.location = "Location is required";
    if (!newHotel.opentime) newErrors.opentime = "Opening time is required";
    if (!newHotel.rating || newHotel.rating < 0 || newHotel.rating > 5) newErrors.rating = "Rating must be between 0 and 5";
    return newErrors;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
    }
};

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        let data = await fetchRestaurants(filters);
       data = data.filter(d => d.userID === JSON.parse(localStorage.getItem("userProfile")).userId)
        setHotels(data);
      } catch (err) {
        console.error("Error fetching restaurants", err);
      }
    };
    fetchData();
  }, [filters]);

  const handleAddOrUpdateHotel = async () => {
    setAddHotelClick(!addHotelClick)
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    let bannerUrl = newHotel.banner;
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'user_profile_photos');
      const res = await axios.post('https://api.cloudinary.com/v1_1/dxhzkog1c/image/upload', formData);
      bannerUrl = res.data.secure_url;
    }
    const userID = JSON.parse(localStorage.getItem("userProfile")).userId
  
    const hotelData = {
      id: editingHotelId, // Use timestamp for new ones
      userID: userID,
      ...newHotel,
      rating: parseFloat(newHotel.rating),
      categoriesprovider: newHotel.categoriesprovider.split(',').map(item => item.trim()),
      cousinProvided: newHotel.cousinProvided.split(',').map(item => item.trim()),
      banner: bannerUrl,
    };

    try {
      if (editingHotelId) {
        // Update
        const updatedHotel = await updateHotel(hotelData);
        
        // 🛠 Properly update the hotels list:
        setHotels(prevHotels =>
          prevHotels.map(hotel => hotel._id === updatedHotel._id ? updatedHotel : hotel)
       );

      } else {
        // Create new
        alert(hotelData.userID)
        const newRestaurant = await createRestaurant(hotelData);
        setHotels(prevHotels => [...prevHotels, newRestaurant]);
      }

      // Reset form
      setNewHotel({
        hotelName: '',
        hotelAddress: '',
        location: '',
        opentime: '',
        rating: '',
        categoriesprovider: '',
        cousinProvided: '',
        banner: '',
      });
      setEditingHotelId(null);
      setErrors({});
      setShowModal(false);
      setSelectedFile(null); // Clear file
    } catch (error) {
      console.error("Error handling add/update hotel:", error);
    }finally {
      setAddHotelClick(false)
    }
  };

  const handleDeleteHotel = async (id) => {
    try {
      await deleteHotel(id);
      const updatedHotels = hotels.filter((hotel) => hotel.id !== id);
      setHotels(updatedHotels);
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  const handleUpdateHotel = (hotel) => {
    if (hotel) {
      setNewHotel({
        hotelName: hotel.hotelName,
        hotelAddress: hotel.hotelAddress,
        location: hotel.location,
        opentime: hotel.opentime,
        rating: hotel.rating.toString(),
        categoriesprovider: hotel.categoriesprovider.join(', '),
        cousinProvided: hotel.cousinProvided.join(', '),
        banner: hotel.banner,
      });
      setEditingHotelId(hotel._id);
      setShowModal(true);
    }
  };

  const ViewButton = ({ hotelId }) => {
    const router = useRouter();
  
    const handleViewClick = () => {
      router.push(`/hotels/${hotelId}`);
    };
  
    return <button onClick={handleViewClick}>View</button>;
  };

  return (
    <div className="relative p-6 dark:bg-gray-900 dark:text-white">
      {/* Main page content */}
      <div className={`${showModal ? "blur-sm" : ""}`}>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-10 rounded-lg mb-6">
          <h1 className="text-4xl font-bold mb-2">Manage Your Hotels</h1>
          <p className="text-lg">Add and manage your hotel listings easily.</p>
        </div>

        {/* Add Hotel Button */}
        <div className="mb-6">
          <button 
            onClick={() => {
              setEditingHotelId(null);
              setNewHotel({
                hotelName: '',
                hotelAddress: '',
                location: '',
                opentime: '',
                rating: '',
                categoriesprovider: '',
                cousinProvided: '',
                banner: '',
              });
              setShowModal(true);
            }} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Add Hotel
          </button>
        </div>

        {/* Hotels Card View */}
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Your Hotels</h2>

        {hotels.length === 0 ? (
          <p className="text-gray-500 text-center dark:text-gray-400">No hotels added yet.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {hotels.map((hotel) => (
              <div 
                key={hotel._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden dark:bg-gray-800 dark:text-white"
              >
                {/* Hotel Image */}
                <div className="relative w-full h-48">
                  <img 
                    src={hotel.banner || "https://via.placeholder.com/400x200.png?text=No+Image"} 
                    alt={hotel.hotelName} 
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Hotel Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{hotel.hotelName}</h3>

                  <div className="text-gray-600 text-sm flex flex-col gap-1 mb-5 dark:text-gray-400">
                    <span><span className="font-semibold">Location:</span> {hotel.location || 'N/A'}</span>
                    <span><span className="font-semibold">Address:</span> {hotel.hotelAddress || 'N/A'}</span>
                    <span><span className="font-semibold">Open Time:</span> {hotel.opentime || 'N/A'}</span>
                    <span><span className="font-semibold">Rating:</span> {hotel.rating ? `${hotel.rating} ⭐` : 'No Rating'}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-3">
                    <button 
                      className="flex-1 bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded w-full"
                      onClick={() => router.push(`/hotels/${hotel._id}`)}
                    >
                      View
                    </button>
                    <button 
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded w-full"
                      onClick={() => handleUpdateHotel(hotel)}
                    >
                      Update
                    </button>
                    <button 
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-6 rounded  transition"
                      onClick={() => handleDeleteHotel(hotel._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Dark background */}
          <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>

          {/* Modal Content */}
          <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl animate-fadeIn z-50 dark:bg-gray-800 dark:text-white">
            <button 
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">{editingHotelId ? 'Update Hotel' : 'Add New Hotel'}</h2>

            {/* Hotel Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'hotelName', label: 'Hotel Name' },
                { name: 'hotelAddress', label: 'Hotel Address' },
                { name: 'location', label: 'Location' },
                { name: 'opentime', label: 'Open Time (e.g., 8:00 AM - 10:00 PM)' },
                { name: 'rating', label: 'Rating (0-5)', type: 'number' },
                { name: 'categoriesprovider', label: 'Categories Provider' },
                { name: 'cousinProvided', label: 'Cuisine Provided (comma separated)' },
                { name: 'banner'} // Update label for banner
              ].map((field) => (
                <div key={field.name} className="relative">
                  {field.name === 'banner' ? (
                    // Use file input for banner image
                    <input
                      ref={fileRef}
                      type="file"
                      id={field.name}
                      accept="image/*"
                      onChange={handleFileChange}
                      className={`peer border p-2 pt-5 rounded w-full focus:border-blue-500 focus:outline-none ${errors[field.name] ? "border-red-500" : ""}`}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      id={field.name}
                      value={newHotel[field.name]}
                      onChange={(e) => setNewHotel({ ...newHotel, [field.name]: e.target.value })}
                      className={`peer border p-2 pt-5 rounded w-full focus:border-blue-500 focus:outline-none ${errors[field.name] ? "border-red-500" : ""}`}
                      placeholder=" "
                    />
                  )}

                  <label 
                    htmlFor={field.name}
                    className="absolute left-2 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
                  >
                    {field.label}
                  </label>

                  {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-6 text-right">
              <button 
                onClick={handleAddOrUpdateHotel}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
                disabled={addHotelClick}
              >
                {
                  addHotelClick ? "working..." : (editingHotelId ? "Update Hotel" : "Add Hotel")
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
