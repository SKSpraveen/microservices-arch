import React from "react";

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverData: any; // Ideally replace with a proper interface later
}

const DriverModal: React.FC<DriverModalProps> = ({ isOpen, onClose, driverData }) => {
  if (!isOpen || !driverData) return null;

  const { 
    username, 
    email, 
    NIC, 
    address, 
    avatar, 
    isActive, 
    isAuthorized,
    authCertificates 
  } = driverData.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000002a] bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Driver Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Avatar */}
          <div>
            <img
              src={avatar}
              alt={`${username}'s avatar`}
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>

          {/* Basic Info */}
          <div>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>NIC:</strong> {NIC || "Not provided"}</p>
            <p><strong>Status:</strong> {isActive ? "Active" : "Inactive"}</p>
            <p><strong>Authorization:</strong> {isAuthorized ? "Authorized" : "Unauthorized"}</p>
          </div>
        </div>

        {/* Address */}
        {address && address.length > 0 && (
          <div className="mt-4">
            <p><strong>Address:</strong></p>
            {
              address.lenght >0 ? <ul className="list-disc list-inside ml-4">
              {address.map((addr: string, idx: number) => (
                <li key={idx}>{addr || "N/A"}</li>
              )) || "No addresses listed"}
            </ul> : <p className="text-gray-500">No address provided</p>
            }
          </div>
        )}

        {/* Authorization Certificates */}
        {authCertificates && (
          <div className="mt-6">
            <h3 className="text-xl font-medium mb-2 text-gray-700">Vehicle & Authorization Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>License Plate:</strong> {authCertificates.licensePlateNumber || "N/A"}</p>
                <p><strong>Vehicle Type:</strong> {authCertificates.vehicleType || "N/A"}</p>
              </div>

              <div className="flex flex-col space-y-2">
                {authCertificates.licenseImage && (
                  <img
                    src={authCertificates.licenseImage.trim()}
                    alt="Driving License"
                    className="rounded border max-h-32"
                  />
                )}
                {authCertificates.insuranceImage && (
                  <img
                    src={authCertificates.insuranceImage.trim()}
                    alt="Insurance Certificate"
                    className="rounded border max-h-32"
                  />
                )}
                {authCertificates.vehicleImage && (
                  <img
                    src={authCertificates.vehicleImage.trim()}
                    alt="Vehicle Photo"
                    className="rounded border max-h-32"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverModal;

// {
//   "success": true,
//   "data": {
//     "_id": "680e11fef65e7b877f215a50",
//     "username": "kkkssss",
//     "email": "kksemasinghe2002@gmail.com",
//     "password": "$2b$10$.3LC3IF59eelfoGBoiIu3eCI18ukqLBNLiN9F25jceIr27J.fEd.y",
//     "address": [
//       ""
//     ],
//     "NIC": "",
//     "isActive": true,
//     "isAuthorized": true,
//     "currentOrder": "",
//     "role": "driver",
//     "avatar": "https://img.rasset.ie/0003696e-500.jpg  ",
//     "createdAt": "2025-04-27T11:16:14.238Z",
//     "updatedAt": "2025-04-29T15:44:51.240Z",
//     "__v": 0,
//     "authCertificates": {
//       "insuranceImage": "https://res.cloudinary.com/dxhzkog1c/image/upload/v1745922702/yiqboegqpo0rlcbnvts9.png  ",
//       "licenseImage": "https://res.cloudinary.com/dxhzkog1c/image/upload/v1745922703/yc0s2ybzs5dgviip33hu.png  ",
//       "licensePlateNumber": "nw bbg 3413",
//       "vehicleType": "Van",
//       "vehicleImage": "https://res.cloudinary.com/dxhzkog1c/image/upload/v1745922700/oeosjrn7spikdgoxtn7n.png  "
//     }
//   }
// }