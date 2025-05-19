"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowLeft, Heart, Share2, MapPin, Search, Plus } from "lucide-react";
import {
  fetchRestaurantById,
  fetchRestaurantReviews,
  fetchRestaurantMenuItems,
  fetchRestaurantFlashDeals,
  createRestaurantReviews,
  getUserProfile,
  getUserProfileById,
} from "@/api";

export default function RestaurantMenuPage() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("Menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(1);

  const handleAddReview = async () => {
    if (!newReview.trim()) return;
    const profile: any = JSON.parse(
      localStorage.getItem("userProfile") as string
    );
    // Validate inputs
    const userId = profile._id;
    const refId = params.restaurantId;
    const type = "hotel";

    const newEntry = {
      userId,
      refId,
      type,
      count: rating,
      comment: newReview.trim(),
    };

    try {
      await createRestaurantReviews(newEntry);

      setReviews([...reviews, { ...newEntry, _id: Date.now().toString() }]);
      setNewReview("");
      setRating(1);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  // New state for geolocation data
  const [distance, setDistance] = useState<string | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const favHotels: string[] = JSON.parse(
      localStorage.getItem("favHotelList") || "[]"
    );
    if (favHotels.includes(params.restaurantId as string)) {
      setIsFavorite(true);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch restaurant data
        const restaurantData = await fetchRestaurantById(
          params.restaurantId as string
        );
        setRestaurant(restaurantData);

        // Fetch reviews
        const reviewsData = await fetchRestaurantReviews(
          params.restaurantId as string
        );

        console.log(reviewsData);
        

        setRating(() => {
          let rating = 0;
          for (let i = 0; i < reviewsData.length; i++) {
            const review = reviewsData[i];
            rating += review.count;
          }
          return rating;
        });

        // // Filter reviews that have a userId
        // const reviewsWithUserId = reviewsData.filter(
        //   (review: any) => review.userId
        // );

        // Fetch user profiles in parallel
        // const userProfiles = await Promise.all(
        //   reviewsWithUserId.map((review: any) =>
        //     getUserProfileById(review.userId)
        //   )
        // );

        // // Merge user data back into reviews
        // const enrichedReviews = reviewsData.map(
        //   (review: any, index: number) => {
        //     if (review.userId) {
        //       const userProfile = userProfiles.find(
        //         (profile) => profile._id === review.userId
        //       );
        //       return { ...review, userData: userProfile };
        //     }
        //     return review;
        //   }
        // );

        setReviews(reviewsData);

        // Calculate distance and delivery time
        calculateDistanceAndTime(restaurantData.hotelAddress);

        // Fetch menu items
        const menuData = await fetchRestaurantMenuItems(
          params.restaurantId as string
        );

        console.log("fuck you : " + menuData.data);

        // Step 2: For each menu item, fetch its flash deal
        const enrichedMenu: any[] = [];
        const flashDealItems: any[] = [];

        await Promise.all(
          menuData.map(async (item: any) => {
            try {
              const flashDeal = await fetchRestaurantFlashDeals(item._id); // fetch by food item ID
              const enrichedItem = {
                ...item,
                flashDeal: flashDeal || null,
              };

              enrichedMenu.push(enrichedItem);

              if (flashDeal) {
                flashDealItems.push(enrichedItem);
              }
            } catch (err) {
              console.error(
                `Failed to fetch flash deal for item ${item.id}`,
                err
              );

              enrichedMenu.push({
                ...item,
                flashDeal: null,
              });
            }
          })
        );

        // Step 3: Update state
        setMenuItems(enrichedMenu);
        // setFlashDeals(flashDealItems); // Only items with deals

        console.log(enrichedMenu);
        // console.log(flashDealItems)

        // Check if the restaurant is already in favorites
        const favHotels = JSON.parse(
          localStorage.getItem("favHotelList") || "[]"
        );
        setIsFavorite(favHotels.includes(restaurantData._id));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.restaurantId]);

  // Toggle favorite status
  const toggleFavorite = () => {
    const favHotels: string[] = JSON.parse(
      localStorage.getItem("favHotelList") || "[]"
    );

    if (isFavorite) {
      // Remove from favorites
      const updatedFavHotels = favHotels.filter(
        (id: string) => id !== params.restaurantId
      );
      localStorage.setItem("favHotelList", JSON.stringify(updatedFavHotels));
      setIsFavorite(false);
    } else {
      // Add to favorites
      if (!favHotels.includes(params.restaurantId as string)) {
        const updatedFavHotels = [...favHotels, params.restaurantId];
        localStorage.setItem("favHotelList", JSON.stringify(updatedFavHotels));
        setIsFavorite(true);
      }
    }
  };

  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.hotelName,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  // Handle direction click
  const handleDirections = () => {
    const address = encodeURIComponent(restaurant.hotelAddress);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${address}`,
      "_blank"
    );
  };

  const calculateDistanceAndTime = async (address: string) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        try {
          const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`;

          const geocodeResponse = await fetch(geocodeUrl, {
            headers: {
              "User-Agent": "YourAppName/1.0 (your.email@example.com)", // Replace with your app info
            },
          });

          const geocodeData = await geocodeResponse.json();

          if (geocodeData.length === 0) {
            alert("Could not find the restaurant location.");
            return;
          }

          const restaurantLat = parseFloat(geocodeData[0].lat);
          const restaurantLng = parseFloat(geocodeData[0].lon);

          const distanceInKm = haversineDistance(
            userLat,
            userLng,
            restaurantLat,
            restaurantLng
          );

          // Example handlers — replace with your own state setters
          setDistance(`${distanceInKm.toFixed(1)} km`);

          const deliverySpeedKmH = 30;
          const deliveryTimeInMinutes = Math.ceil(
            (distanceInKm / deliverySpeedKmH) * 60
          );
          setDeliveryTime(`${deliveryTimeInMinutes} min`);
        } catch (error) {
          console.error("Error during geocoding:", error);
          alert("Failed to calculate distance. Please try again.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not retrieve your location.");
      }
    );
  };

  // Haversine formula
  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found.</p>;

  return (
    <div className="flex min-h-screen flex-col  bg-gray-100">
      <Navbar />

      {/* Restaurant Header */}
      <header className="relative h-[300px] overflow-hidden">
        <Image
          src={
            restaurant.banner ||
            "https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={restaurant.hotelName}
          fill
          className="object-cover brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-14 right-4 flex gap-2 z-50">
          {/* Heart Icon */}
          <button
            className="p-2 rounded-full cursor-pointer bg-black/30 text-white hover:bg-black/50 transition-colors"
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
          {/* Share Icon */}
          <button
            className="p-2 rounded-full bg-black/30 cursor-pointer text-white hover:bg-black/50 transition-colors"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute bottom-6 left-6 text-white">
          <p>Open {restaurant.opentime}</p>
          <h1 className="text-3xl font-bold">{restaurant.hotelName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span>{rating }⭐</span>
            <span>({reviews.length} reviews)</span>
            {distance && <span>{distance}</span>}
            {deliveryTime && <span>({deliveryTime})</span>}
          </div>
        </div>
        <div className="absolute bottom-6 right-6 flex gap-2">
          {/* Directions Button */}
          <button
            className="btn btn-primary px-4 py-2 rounded-full flex items-center gap-2"
            onClick={handleDirections}
          >
            <MapPin className="h-4 w-4" />
            Directions
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto p-4">
        {/* Tabs Section */}
        <div className="mb-6">
          {/* Tab Buttons */}
          <div className="flex space-x-4 border-b border-gray-300 mb-4">
            {["Menu", "Reviews", "Info"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-semibold transition-colors duration-300 ${
                  activeTab === tab
                    ? "border-b-2 border-primary-600 text-primary-600"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "Menu" && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  className="input pl-10 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Menu Items */}
              <div className="space-y-8">
                {menuItems
                  .filter((item) =>
                    item.foodName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item._id}
                      className="group border rounded-xl p-4 bg-white dark:bg-dark-800 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        {/* Image + Badge */}
                        <div className="relative h-24 w-24 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={item.images}
                            alt={item.foodName}
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          {item.isOfferAvailable && (
                            <div className="absolute top-1 left-1">
                              <span className="badge bg-red-500 text-white text-xs">
                                Flash Deal
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                              {item.foodName}
                            </h3>
                            {item.isAvailable ? (
                              <span className="text-xs text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                                Available
                              </span>
                            ) : (
                              <span className="text-xs text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300 px-2 py-0.5 rounded-full">
                                Unavailable
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.categoryName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.description || "No description available."}
                          </p>

                          {/* Pricing and Offer */}
                          <div className="flex justify-between items-center mt-2">
                            <div className="space-x-2">
                              {item.flashDeal.newPrice ? (
                                <>
                                  <span className="text-sm line-through text-gray-400">
                                    ${parseFloat(item.price).toFixed(2)}
                                  </span>
                                  <span className="text-md font-semibold text-primary-600 dark:text-primary-400">
                                    $
                                    {parseFloat(
                                      item.flashDeal.newPrice
                                    ).toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-md font-semibold text-primary-600 dark:text-primary-400">
                                  ${parseFloat(item.price).toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Add to Cart Button */}
                            <Link
                              href={`/restaurants/${params.restaurantId}/item/${item._id}`}
                            >
                              <button className="btn btn-primary btn-sm px-4 py-1 rounded-full text-sm font-medium">
                                view
                              </button>
                            </Link>
                          </div>

                          {/* Ratings */}
                          {/* <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.ratingID.length} Rating{item.ratingID.length !== 1 ? "s" : ""}
                </div> */}
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Empty State */}
                {menuItems.filter((item) =>
                  item.foodName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      No menu items found matching "{searchQuery}"
                    </p>
                    <button
                      className="text-primary-600 dark:text-primary-400 hover:underline mt-2"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabs */}
          {activeTab === "Reviews" && (
            <div className="space-y-6">
              {/* Existing Reviews */}
              {reviews.map((review) => (
                <div key={review._id} className="restaurant-card p-4 space-y-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center dark:bg-dark-700">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {review.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {review.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Rated {review.count} star(s)
                      </p>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
              ))}

              {/* Add a Review */}
              <div className="restaurant-card p-4 space-y-4">
                <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                  Add a Review
                </h4>

                {/* Rating Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    Rating:
                  </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-xl ${
                        star <= rating ? "text-primary-600" : "text-gray-400"
                      } hover:text-primary-500 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Review Textarea */}
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-800 dark:border-dark-700 dark:text-gray-100"
                />

                {/* Submit Button */}
                <button
                  onClick={handleAddReview}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300 w-full sm:w-auto"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {activeTab === "Info" && (
            <div className="bg-white p-4 rounded-lg shadow-soft ">
              <h4 className="font-semibold text-lg mb-4 text-gray-800 ">
                Hotel Info
              </h4>

              <div className="space-y-2 text-sm text-gray-700 ">
                <p>
                  <strong>Name:</strong> {restaurant.hotelName}
                </p>
                <p>
                  <strong>Address:</strong> {restaurant.hotelAddress}
                </p>
                <p>
                  <strong>Location:</strong> {restaurant.location}
                </p>
                <p>
                  <strong>Opening Hours:</strong> {restaurant.opentime}
                </p>
                <p>
                  <strong>Rating:</strong> {restaurant.rating ?? "N/A"}
                </p>
                <p>
                  <strong>Orders Count:</strong> {restaurant.ordersCount}
                </p>
                <p>
                  <strong>Authorized:</strong>{" "}
                  {restaurant.isAuthorized ? "Yes ✅" : "No ❌"}
                </p>
                <p>
                  <strong>Contact:</strong> {restaurant.contactNumber || "N/A"}
                </p>
                <p>
                  <strong>Meta Info:</strong>{" "}
                  {restaurant.metaData &&
                  Object.keys(restaurant.metaData).length > 0
                    ? JSON.stringify(restaurant.metaData)
                    : "No metadata available."}
                </p>
                <p>
                  <strong>Auth Certificates:</strong>{" "}
                  {restaurant.authCertificates &&
                  Object.keys(restaurant.authCertificates).length > 0
                    ? JSON.stringify(restaurant.authCertificates)
                    : "No certificates uploaded."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
