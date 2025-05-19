"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import axios from "axios";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getUserProfileById } from "@/api";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CartPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [newAddress, setNewAddress] = useState("");
  const DEFAULT_ADDRESS_KEY = "defaultAddress";
  const [isCheckoutClicked, setIsCheckoutClicked] = useState(false);

  // Local storage key for storing the current order address
  const CURRENT_ORDER_ADDRESS_KEY = "currentOrderAddress";

  // Load cart items and selected items from localStorage on mount
  useEffect(() => {
    const storedCartItems = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );
    if (storedCartItems.length > 0) {
      setCartItems(storedCartItems);
    }

    const storedSelectedItems = JSON.parse(
      localStorage.getItem("selectedItems") || "[]"
    );
    setSelectedItems(storedSelectedItems);
  }, []);

  // Calculate total amount whenever `selectedItems` or `cartItems` change
  useEffect(() => {
    const total = cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
    localStorage.setItem("totalAmount", JSON.stringify(total));
  }, [selectedItems, cartItems]);

  // Fetch client secret for Stripe payment intent
  useEffect(() => {
    if (totalAmount > 0) {
      const fetchClientSecret = async () => {
        try {
          setLoadingPayment(true);
          const response = await axios.post(
            "http://localhost:3000/order/create-payment-intent",
            {
              amount: totalAmount,
              currency: "usd",
            }
          );
          setClientSecret(response.data.clientSecret);
        } catch (error) {
          console.error("Error fetching clientSecret:", error);
        } finally {
          setLoadingPayment(false);
        }
      };
      fetchClientSecret();
    } else {
      setClientSecret(null);
    }
  }, [totalAmount]);

  // Handle checkbox toggle for selecting/deselecting items
  const handleCheckboxChange = (itemId: number) => {
    const updatedSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    setSelectedItems(updatedSelectedItems);
    localStorage.setItem("selectedItems", JSON.stringify(updatedSelectedItems));
  };

  // Fetch user profile data (including addresses)
  const fetchUserProfile = async () => {
    try {
      const profileData = await getUserProfileById(
        JSON.parse(localStorage.getItem("userProfile") as string)._id
      );
      setAddresses(profileData.address || []);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Get the default address ID from local storage
  const getDefaultAddressId = () => {
    const storedDefaultAddress = localStorage.getItem(DEFAULT_ADDRESS_KEY);
    return storedDefaultAddress ? JSON.parse(storedDefaultAddress) : null;
  };

  // Set the default address as the initially selected address
  useEffect(() => {
    const defaultAddressId = getDefaultAddressId();
    if (defaultAddressId) {
      setSelectedAddressId(defaultAddressId);
    }
  }, [addresses]);

  // Save the selected address or new address in local storage
  const saveAddress = () => {
    if (newAddress.trim()) {
      localStorage.setItem(CURRENT_ORDER_ADDRESS_KEY, newAddress);
      setNewAddress("");
    } else if (selectedAddressId) {
      const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId
      );
      localStorage.setItem(
        CURRENT_ORDER_ADDRESS_KEY,
        JSON.stringify(selectedAddress)
      );
    }
  };

  function getRandomPastDate() {
    const now = new Date();
    const past = new Date();
    past.setFullYear(now.getFullYear() - 1); // 1 year ago

    const randomTime =
      past.getTime() + Math.random() * (now.getTime() - past.getTime());
    return new Date(randomTime);
  }

  return (
    <section className="bg-gradient-to-br relative from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800 min-h-screen flex flex-col">
      <Navbar />

      <div className="w-full px-4 py-12 flex-grow flex mt-12 container mx-auto">
        {/* Cart Items */}
        <aside className="flex-grow flex flex-col items-center w-full">
          <h1 className="text-left text-4xl font-extrabold text-dark-800 dark:text-gray-100 mb-2">
            Your Shopping Cart
          </h1>

          <div className="p-5 gap-8 w-full">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white min-w-[375px] relative flex gap-4 md:h-48 shadow-sm dark:bg-dark-800 rounded-md hover:shadow-xl transition-shadow duration-300 my-5"
              >
                <div className="absolute top-4 right-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                    className="form-checkbox rounded-2xl h-6 w-6 text-primary-600 focus:ring-primary-600 bg-white dark:bg-dark-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="relative">
                  <img
                    src={item.foodImage}
                    alt={item.name}
                    className="w-48 dark:text-white text-black h-auto object-cover rounded-tl-md rounded-bl-md mb-4"
                  />
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-bold text-dark-800 dark:text-secondary-700 mb-2">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Quantity:{" "}
                    <span className="font-medium">{item.quantity}</span>
                  </p>
                  <p className="text-base font-semibold text-secondary-600 mb-2">
                    ${((item.price * item.quantity) / 100)* 100}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Added:{" "}
                    <span>{getRandomPastDate().toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center w-full max-w-md">
            <button
              onClick={() => {
                setIsCheckoutClicked(true);
              }}
              disabled={!selectedItems.length}
              className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
            >
              {!selectedItems.length ? "Select Items to Checkout" : "Checkout"}
            </button>
            <button
              onClick={() => {
                setSelectedItems([]);
                localStorage.removeItem("selectedItems");
              }}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </aside>

      {isCheckoutClicked && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000b4] bg-opacity-40 backdrop-blur-sm">
    <section className="w-full max-w-4xl bg-white dark:bg-dark-800 rounded-lg shadow-2xl p-8 relative overflow-y-auto max-h-[90vh]">
      <h2 className="text-3xl font-extrabold text-dark-800 dark:text-gray-100 mb-6">
        🛒 Checkout
      </h2>

      {!selectedItems.length ? (
        <div className="flex flex-col items-center justify-center mt-12 text-center">
          <img
            src="/empty-cart.svg" // use a nice empty cart icon or illustration
            alt="No items"
            className="w-40 h-40 opacity-60 mb-6"
          />
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please select at least one item to proceed.
          </p>
        </div>
      ) : (
        <>
          {loadingPayment && (
            <div className="mt-8">
              <LoadingSpinner message="Preparing payment..." />
            </div>
          )}

          {!clientSecret && !loadingPayment && (
            <div className="mt-8">
              <LoadingSpinner message="Initializing checkout..." />
            </div>
          )}

          {clientSecret && (
            <div className="mt-8">
              {/* Amount */}
              <div className="mb-6 bg-primary-50 dark:bg-dark-700 p-4 rounded-md flex justify-between items-center">
                <p className="text-lg font-semibold text-dark-800 dark:text-gray-100">
                  Total Amount:
                </p>
                <span className="text-2xl font-bold text-primary-600">
                  ${((totalAmount / 100) * 100).toFixed(2)}
                </span>
              </div>

              {/* Address Section */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-dark-800 dark:text-gray-100 mb-4">
                  📍 Delivery Address
                </h3>
                <ul className="space-y-3">
                  {addresses.map((address) => (
                    <li
                      key={address}
                      className={`flex items-center justify-between p-3 rounded-md border transition ${
                        selectedAddressId === address
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900"
                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-dark-700"
                      }`}
                      onClick={() => setSelectedAddressId(address)}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={selectedAddressId === address}
                          onChange={() => {
                            localStorage.setItem(
                              CURRENT_ORDER_ADDRESS_KEY,
                              address
                            );
                            setSelectedAddressId(address);
                          }}
                          className="form-radio h-5 w-5 text-primary-600 focus:ring-primary-600 bg-white dark:bg-dark-700 border-gray-300 dark:border-gray-600"
                        />
                        <span className="text-dark-800 dark:text-gray-100">
                          {address}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Saved</span>
                    </li>
                  ))}
                </ul>

                {/* Add New Address */}
                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="Enter new address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-700 text-dark-800 dark:text-gray-100 mb-2"
                  />
                  <button
                    onClick={saveAddress}
                    className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    ➕ Save Address
                  </button>
                </div>
              </div>

              {/* Payment Section */}
              <div className="mt-8">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    selectedItems={cartItems.filter((item) =>
                      selectedItems.includes(item.id)
                    )}
                  />
                </Elements>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  </div>
)}

      </div>

      <Footer />
    </section>
  );
}
