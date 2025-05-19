"use client";
import Link from "next/link";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Star,
  Clock,
  MapPin,
  Search,
  ChevronDown,
  Filter,
  Pizza,
  Coffee,
  Beef,
  Salad,
  IceCream,
  Soup,
  Utensils,
} from "lucide-react";
import { fetchRestaurants, Restaurant } from "@/api";

// Icon map for categories
const categoryIcons: Record<string, JSX.Element> = {
  All: <Utensils className="h-5 w-5" />,
  Pizza: <Pizza className="h-5 w-5" />,
  Burgers: <Beef className="h-5 w-5" />,
  Salads: <Salad className="h-5 w-5" />,
  Desserts: <IceCream className="h-5 w-5" />,
  Coffee: <Coffee className="h-5 w-5" />,
  Soups: <Soup className="h-5 w-5" />,
};

const cuisines = ["Italian", "Chinese", "Mexican", "Japanese", "American", "Indian", "Thai"];
const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher"];

export default function RestaurantsPage() {
  const [filters, setFilters] = useState({
    cuisine: [] as string[],
    dietary: [] as string[],
    search: "",
    location: "",
    sort: "a-z",
  });

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleFilter = (type: "cuisine" | "dietary", value: string) => {
    setFilters((prev) => {
      const list = prev[type];
      return {
        ...prev,
        [type]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchRestaurants(filters);
        setRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const handleSortToggle = () => {
    setFilters((prev) => ({
      ...prev,
      sort: prev.sort === "a-z" ? "z-a" : "a-z",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-r from-primary-400 via-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src="/placeholder.svg?height=400&width=1920" alt="Pattern" fill />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Discover Restaurants Near You
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">Find and order from the best local spots</p>

          {/* Search + Location */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
              <input
                type="text"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 focus:ring-2 focus:ring-white/50 outline-none text-white placeholder:text-white/70"
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
              <input
                type="text"
                placeholder="Search for cuisine or restaurant"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 focus:ring-2 focus:ring-white/50 outline-none text-white placeholder:text-white/70"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto flex flex-wrap justify-center gap-3">
          {Object.keys(categoryIcons).map((category) => (
            <button
              key={category}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  search: category === "All" ? "" : category,
                }))
              }
              className={`group flex items-center gap-2 dark:text-white px-4 py-2 rounded-full border dark:border-gray-700 dark:hover:border-primary-500 border-gray-200 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-600 transition-all transform hover:scale-105`}
            >
              {categoryIcons[category]}
              <span className="text-sm font-medium">{category}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border dark:border-gray-700">
            <div className="flex items-center justify-between bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-t-xl">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Filter className="h-5 w-5" />
            </div>
            <div className="p-6 space-y-6">
              {/* Cuisine Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Cuisine</h4>
                {cuisines.map((cuisine) => (
                  <div key={cuisine} className="flex items-center space-x-3 mb-2">
                    <input
                      type="checkbox"
                      id={`cuisine-${cuisine}`}
                      checked={filters.cuisine.includes(cuisine)}
                      onChange={() => toggleFilter("cuisine", cuisine)}
                      className="accent-primary-600 w-4 h-4 rounded"
                    />
                    <label htmlFor={`cuisine-${cuisine}`} className="cursor-pointer text-sm dark:text-gray-300">
                      {cuisine}
                    </label>
                  </div>
                ))}
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              {/* Dietary Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Dietary</h4>
                {dietaryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-3 mb-2">
                    <input
                      type="checkbox"
                      id={`dietary-${option}`}
                      checked={filters.dietary.includes(option)}
                      onChange={() => toggleFilter("dietary", option)}
                      className="accent-primary-600 w-4 h-4 rounded"
                    />
                    <label htmlFor={`dietary-${option}`} className="cursor-pointer text-sm dark:text-gray-300">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setFilters({
                    cuisine: [],
                    dietary: [],
                    search: "",
                    location: "",
                    sort: "a-z",
                  })
                }
                className="w-full py-2 px-4 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Restaurants Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Restaurants</h2>
            <button
              onClick={handleSortToggle}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Sort: {filters.sort === "a-z" ? "A-Z" : "Z-A"}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
          ) : restaurants.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No restaurants found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300 border dark:border-gray-700"
                >
                  <div className="relative aspect-[4/3] group">
                    <Image
                      src={restaurant.banner}
                      alt={restaurant.hotelName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {restaurant.isFeatured && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-white dark:bg-gray-900 text-sm px-2 py-1 rounded-full shadow-md dark:text-gray-200">
                      {restaurant.ordersCount} Orders
                    </span>
                    <span className="absolute bottom-3 right-3 bg-white dark:bg-gray-900 text-sm px-2 py-1 rounded-full shadow-md flex items-center gap-1 dark:text-gray-200">
                      <Clock className="h-4 w-4" />
                      {restaurant.opentime}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {restaurant.hotelName}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {restaurant.categoriesprovider.map((tag: any, i: number) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/restaurants/${restaurant._id}`}
                      className="block w-full py-2 px-4 text-center bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                    >
                      View Menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </section>
    </div>

  );
}


