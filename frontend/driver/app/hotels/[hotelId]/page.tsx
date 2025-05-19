'use client';

import { useRouter , useParams } from 'next/navigation';
import { useEffect, useState, ChangeEvent, FormEvent, useRef } from 'react';
import axios from 'axios';


interface FoodItem {
  _id: string;
  foodName: string;
  price: number;
  description: string;
  images: string;
  categoryName: string;
}

interface AddMenuModalProps {
  hotelId: string;
  onClose: () => void;
  onFoodAdded: () => void;
}

export default function HotelDetailPage() {
  const params = useParams();
  const hotelId = params.hotelId as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const router = useRouter();
  const fileRef = useRef(null);


  const fetchFoodItems = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/hotel/foods/getById/${hotelId}`, { withCredentials: true });
      console.log('API Response:', res.data);
  
      const data = res.data;
  
      if (Array.isArray(data.data)) {
        // API returns { success: true, data: [...] }
        setFoodItems(data.data);
      } else {
        console.error('Unexpected API response format');
        setFoodItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch food items:', error);
    }
  };  
  

  useEffect(() => {
    fetchFoodItems();
  }, [hotelId]);

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-700 to-purple-700 p-10 rounded-b-3xl shadow-lg flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Welcome to Hotel Details</h1>
        <p className="text-gray-300 mb-4 text-lg md:text-xl max-w-2xl">
          Manage your hotel's menu, update delicious foods, and give your guests the best experience.
        </p>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          ➕ Add New Menu
        </button>
        <button
            onClick={() => router.back()}
            className="absolute top-6 left-6  text-white font-semibold py-2 px-4  shadow-sm flex items-center space-x-2 transition duration-300"
            >
            <span className="text-xl">←</span>
            <span>Back</span>
        </button>


      </div>

      {/* Food Items Section */}
      <div className="p-6 flex-1">
        <h2 className="text-3xl font-bold mb-6">Your Hotel Menus</h2>

        {foodItems.length === 0 ? (
          <p className="text-gray-400">No menu items found. Start by adding one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodItems.map((item) => (
              <div key={item._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                {item.images?.length > 0 && (
                  <img src={item.images} alt={item.foodName} className="w-full h-40 object-cover rounded-md mb-3" />
                )}
                <h3 className="text-xl font-bold mb-2">{item.categoryName}</h3>
                <p className="text-green-400 font-semibold mb-2">${item.price}</p>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Menu Modal */}
      {isModalOpen && (
        <AddMenuModal
          hotelId={hotelId}
          onClose={() => setIsModalOpen(false)}
          onFoodAdded={fetchFoodItems}
        />
      )}
    </div>
  );
}

function AddMenuModal({ hotelId, onClose, onFoodAdded }: AddMenuModalProps) {
  const [formData, setFormData] = useState({
    categoryName: '',
    foodName: '',
    images: null as File | null,
    price: '',
    description: '',
    prepTime: '',
    tags: [] as string[],
    allergens: [] as string[],
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      sodium: '',
    },
    isAvailable: true,
    availabilityReason: '',
    options: [] as any[],
    relatedItems: [] as any[],
    rating: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name.startsWith('nutritionalInfo.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        nutritionalInfo: {
          ...prev.nutritionalInfo,
          [key]: value,
        },
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: items,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let imageUrl = '';

      if (formData.images) {
        const data = new FormData();
        data.append('file', formData.images);
        data.append('upload_preset', 'user_profile_photos'); // <- replace with your Cloudinary unsigned preset
  
        const cloudinaryRes = await axios.post('https://api.cloudinary.com/v1_1/dxhzkog1c/image/upload', data);
  
        imageUrl = cloudinaryRes.data.secure_url;

        console.log(imageUrl);
        
      }
      await axios.post('http://localhost:3000/api/hotel/foods', {
        ...formData,
        images: imageUrl,
        price: Number(formData.price),
        rating: Number(formData.rating),
        nutritionalInfo: {
          calories: Number(formData.nutritionalInfo.calories),
          protein: Number(formData.nutritionalInfo.protein),
          carbs: Number(formData.nutritionalInfo.carbs),
          fat: Number(formData.nutritionalInfo.fat),
          sodium: Number(formData.nutritionalInfo.sodium),
        },
        hotelID: hotelId,
      }, { withCredentials: true });

      alert('Menu item added successfully!');
      onFoodAdded();  // refetch after adding
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to add menu item');
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-4 md:p-6 rounded-2xl shadow-2xl w-[90%] max-w-lg max-h-[85vh] overflow-y-auto relative text-gray-300">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-white">Add New Menu</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" name="categoryName" placeholder="Category Name" value={formData.categoryName} onChange={handleChange} className={input} required />
            <input type="text" name="foodName" placeholder="Food Name" value={formData.foodName} onChange={handleChange} className={input} required />
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData(prev => ({ ...prev, images: file }));
                }
              }} 
              className={input}
            />
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className={input} required />
          </div>

          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className={`${input} h-20`} />

          <input type="text" name="prepTime" placeholder="Preparation Time" value={formData.prepTime} onChange={handleChange} className={input} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" name="tags" placeholder="Tags (comma separated)" value={formData.tags.join(', ')} onChange={(e) => handleArrayChange('tags', e.target.value)} className={input} />
            <input type="text" name="allergens" placeholder="Allergens (comma separated)" value={formData.allergens.join(', ')} onChange={(e) => handleArrayChange('allergens', e.target.value)} className={input} />
          </div>

          <div className="mt-2">
            <h3 className="text-md font-semibold mb-1 text-white">Nutritional Info</h3>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" name="nutritionalInfo.calories" placeholder="Calories" value={formData.nutritionalInfo.calories} onChange={handleChange} className={input} />
              <input type="number" name="nutritionalInfo.protein" placeholder="Protein (g)" value={formData.nutritionalInfo.protein} onChange={handleChange} className={input} />
              <input type="number" name="nutritionalInfo.carbs" placeholder="Carbs (g)" value={formData.nutritionalInfo.carbs} onChange={handleChange} className={input} />
              <input type="number" name="nutritionalInfo.fat" placeholder="Fat (g)" value={formData.nutritionalInfo.fat} onChange={handleChange} className={input} />
              <input type="number" name="nutritionalInfo.sodium" placeholder="Sodium (mg)" value={formData.nutritionalInfo.sodium} onChange={handleChange} className={input} />
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-2">
            <label className="font-medium text-white">Available?</label>
            <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="w-5 h-5" />
          </div>

          <input type="text" name="availabilityReason" placeholder="Availability Reason" value={formData.availabilityReason} onChange={handleChange} className={input} />

          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg w-full transition">
            Submit Menu
          </button>
        </form>
      </div>
    </div>
  );
}

const input = "bg-gray-700 border border-gray-600 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-white";
