'use client';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';

export default function CheckoutForm({ selectedItems }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) return;
  
    setIsLoading(true);
  
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`, // This will still be used as a fallback
      },
    });
  
    if (error) {
      setMessage(error.message || 'An error occurred during payment.');
    } else if (paymentIntent?.status === 'succeeded') {
      try {
        // Save the order details to the database
        await axios.post('/api/save-order', {
          paymentIntentId: paymentIntent.id,
          totalAmount: localStorage.getItem("totalAmount"), // You can fetch the total amount from your backend
        items: JSON.parse(localStorage.getItem("selectedItems")),
        });
  
        setMessage('Payment succeeded!');
        // Redirect manually after saving the order
        window.location.href = '/success';
      } catch (err) {
        setMessage('Failed to save order details.');
      }
    }
  
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 animate-fade-in">
      <div className="rounded-lg p-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 shadow-soft">
        <PaymentElement />
        <button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </button>
        {message && (
          <p className="mt-4 text-sm font-medium text-red-500 dark:text-red-400">
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
