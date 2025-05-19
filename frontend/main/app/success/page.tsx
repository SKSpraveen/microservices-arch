"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import axios from "axios";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  addedAt: string;
  image: string;
}

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get("payment_intent");
    const paymentIntentClientSecret = urlParams.get(
      "payment_intent_client_secret"
    );

    const storedSelectedItems = localStorage.getItem("selectedItems");
    const storedCartItems = localStorage.getItem("cartItems");
    const storedTotalAmount = localStorage.getItem("totalAmount");

    // Parse and validate the retrieved data
    const selectedItems: number[] = storedSelectedItems
      ? JSON.parse(storedSelectedItems)
      : [];
    const cartItems: CartItem[] = storedCartItems
      ? JSON.parse(storedCartItems)
      : [];
    const totalAmount: number = storedTotalAmount
      ? parseFloat(storedTotalAmount)
      : 0;

    if (paymentIntentId && paymentIntentClientSecret) {
      // Check if the order was already saved, and if not, save it now
      const saveOrderIfNotExists = async () => {
        try {
          if (!Array.isArray(selectedItems) || !Array.isArray(cartItems)) {
            console.error("Invalid data format in localStorage.");
            return;
          }

          if (totalAmount <= 0) {
            console.error("Total amount must be greater than zero.");
            return;
          }

          // Filter cart items based on selected items
          const orderList: CartItem[] = cartItems.filter((item) =>
            selectedItems.includes(item.id)
          );

          if (orderList.length === 0) {
            console.error("No items selected for the order.");
            return;
          }

          // Save the order to the backend
          await axios.post("http://localhost:3000/order/save-order", {
            paymentIntentId,
            paymentIntentClientSecret,
            totalAmount,
            items: orderList,
            status: "completed",
            userId: JSON.parse(localStorage.getItem("userProfile") as string)
              ._id,
            createdAt: new Date().toISOString(),
            delivaryLocation: localStorage.getItem("currentOrderAddress"),
          });
        } catch (err) {
          console.error("Error saving order:", err);
        } finally {
          // Clear local storage after saving the order
          localStorage.removeItem("currentOrderAddress");
          // Remove selected items from cartItems
          const updatedCart = cartItems.filter(
            (item) => !selectedItems.includes(item.id)
          );
          localStorage.setItem("cartItems", JSON.stringify(updatedCart));

          // Remove selectedItems from localStorage
          localStorage.removeItem("selectedItems");
        }
      };

      saveOrderIfNotExists();
    }
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 min-h-[70vh] px-4 animate-fade-in">
        <div className="card max-w-md w-full text-center py-10 px-6 animate-slide-up">
          <div className="text-green-600 dark:text-green-400 text-4xl font-bold mb-4">
            🎉 Payment Successful!
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for your purchase. You’ll be redirected shortly...
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn btn-secondary animate-scale-in"
          >
            Go to Home
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
