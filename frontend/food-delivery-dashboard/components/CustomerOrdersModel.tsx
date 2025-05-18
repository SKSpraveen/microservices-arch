// components/CustomerOrdersModal.tsx
import React from "react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  hotelId: string;
}

interface Order {
  _id: string;
  paymentIntentId: string;
  totalAmount: number;
  items: OrderItem[];
  status: string;
  createdAt: string;
  deliveryLocation: { lat?: number; lng?: number };
  hotelId: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const CustomerOrdersModal: React.FC<Props> = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-5xl max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-600"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Customer Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4 shadow-sm">
                <div className="mb-2 text-sm text-gray-700">
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Payment Intent:</strong> {order.paymentIntentId}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Hotel ID:</strong> {order.hotelId}</p>
                  <p>
                    <strong>Delivery Location:</strong>{" "}
                    {order.deliveryLocation.lat}, {order.deliveryLocation.lng}
                  </p>
                  <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="mt-2">
                  <h4 className="font-semibold">Items:</h4>
                  <table className="w-full table-auto mt-2 border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Quantity</th>
                        <th className="p-2 border">Price</th>
                        <th className="p-2 border">Hotel ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-2 border">{item.name}</td>
                          <td className="p-2 border">{item.quantity}</td>
                          <td className="p-2 border">₹{item.price}</td>
                          <td className="p-2 border">{item.hotelId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrdersModal;
