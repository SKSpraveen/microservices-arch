"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Star,
  ArrowLeft,
  Heart,
  Share2,
  Info,
  Minus,
  Plus,
  ShoppingCart,
  Clock,
} from "lucide-react";
import { fetchFoodItemById, fetchRestaurantById } from "@/api";

export default function FoodItemPage() {
  const params = useParams();
  const router = useRouter();
  const [foodItem, setFoodItem] = useState<any>(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [hotelName, setHotelName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const itemId = params.itemId as string;

  useEffect(() => {
    const favHotels: string[] = JSON.parse(
      localStorage.getItem("favFoodList") || "[]"
    );
    if (favHotels.includes(params.restaurantId as string)) {
      setIsFavorite(true);
    }
    const fetchData = async () => {

      try {
        // Fetch food item details
        const foodItemData = await fetchFoodItemById(itemId);
        setFoodItem(foodItemData);

        // Fetch hotel name
        const hotelData = await fetchRestaurantById(foodItemData.hotelID);
        setHotelName(hotelData.name);

        // Fetch related items dynamically
        // const relatedItemsData = await Promise.all(
        //   foodItemData.relatedItems.map(async (item) => {
        //     return await fetchFoodItemById(item.id);
        //   })
        // );
        setRelatedItems(foodItemData.relatedItems);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col ">
        <Navbar />
        <div className="container mx-auto p-4 flex justify-center min-h-screen items-center h-full">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container mx-auto p-4 flex justify-center items-center h-full">
          <p className="text-red-600">Error: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Helper Function: Fallback Image from Unsplash
  const getFallbackImage = () => {
    return "https://source.unsplash.com/featured/?food";
  };

  // Handle Quantity Changes
  const handleIncreaseQuantity = () => setQuantity((prev) => prev + 1);
  const handleDecreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Handle Add to Cart
  const handleAddToCart = () => {
    alert(`${quantity} x ${foodItem?.foodName} added to cart!`);
    // Implement cart logic here (e.g., update context or state)
  };

  const toggleFavorite = () => {
    const favHotels: string[] = JSON.parse(
      localStorage.getItem("favHotelList") || "[]"
    );

    if (isFavorite) {
      // Remove from favorites
      const updatedFavHotels = favHotels.filter(
        (id: string) => id !== params.restaurantId
      );
      localStorage.setItem("favFoodList", JSON.stringify(updatedFavHotels));
      setIsFavorite(false);
    } else {
      // Add to favorites
      if (!favHotels.includes(params.restaurantId as string)) {
        const updatedFavHotels = [...favHotels, params.restaurantId];
        localStorage.setItem("favFoodList", JSON.stringify(updatedFavHotels));
        setIsFavorite(true);
      }
    }
  };

  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hotelName,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    alert(`Redirecting to checkout for ${quantity} x ${foodItem?.foodName}`);
    router.push("/order-confirmation");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Header Section */}
      <div className="relative h-[300px] md:h-[400px] bg-gray-100 dark:bg-dark-800 overflow-hidden">
        <Image
          src={foodItem?.images || getFallbackImage()}
          alt={foodItem?.foodName ||'missing alt'}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
          onClick={toggleFavorite}
            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          >
            <Heart className="h-5 w-5" />
          </button>
          <button onClick={handleShare} className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 -mt-16 relative z-10">
        <div className="bg-white  rounded-2xl shadow-lg p-6">
          {/* Food Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/restaurants/${foodItem.hotelID}`}
                  className="text-sm text-primary-600 hover:underline dark:text-primary-400"
                >
                  {hotelName}
                </Link>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-sm">{foodItem.rating || "N/A"}</span>
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                    ({foodItem.reviewCount || 0})
                  </span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{foodItem.foodName}</h1>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{foodItem.description}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-1 text-primary-600 dark:text-primary-500" />
                  <span>{foodItem.nutritionalInfo?.calories || "N/A"} cal</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-primary-600 dark:text-primary-500" />
                  <span>{foodItem.prepTime || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Quantity and Buttons */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center border border-gray-300 rounded-full dark:border-dark-600">
                  <button
                    className="h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button
                    className="h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700"
                    onClick={handleIncreaseQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Price</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ${(foodItem.price * quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-outline flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  className="btn btn-primary flex-1"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedItems.map((item: any) => (
              <Link
                key={item.id}
                href={`/restaurants/${foodItem.hotelID}/item/${item.id}`}
                className="food-item-card group"
              >
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || getFallbackImage()}
                      alt={item.foodName}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.foodName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        ${item.price.toFixed(2)}
                      </span>
                      <button className="btn btn-primary btn-sm btn-icon">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}