// components/DriverModal.tsx
import React from "react";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverData: any; // Replace with a proper type if available
}

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, driverData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Driver Details</h2>
        <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto max-h-[400px]">
          {JSON.stringify(driverData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CustomerModal;
