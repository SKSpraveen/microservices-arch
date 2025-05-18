import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { useEffect, useState } from "react";

async function fetchHotelOwnerDetails(id: string) {
  const res = await axios.get(`http://localhost:3000/api/hotelOwners/${id}`);
  if (res.status !== 200) throw new Error("Failed to fetch hotel owner details");
  return res.data;
}

async function fetchHotelsByOwnerId(id: string) {
  const res = await axios.get(`http://localhost:3000/api/hotel/getByUserId/${id}`);
  console.log(res.data);

  return res.data;
}

export function HotelOwnerPopup({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [owner, setOwner] = useState<any>(null);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      Promise.all([fetchHotelOwnerDetails(id), fetchHotelsByOwnerId(id)])
        .then(([ownerData, hotelData]) => {
          setOwner(ownerData);
          setHotels(hotelData);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load hotel owner data.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hotel Owner Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <div className="space-y-6">
            {/* Owner Info */}
            <div className="p-4 border rounded shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Owner Info</h3>
              <p><span className="font-medium">Name:</span> {owner?.username || "N/A"}</p>
              <p><span className="font-medium">Email:</span> {owner?.email || "N/A"}</p>
              <p><span className="font-medium">Phone No:</span> {owner?.phoneNo || "N/A"}</p>
              <p><span className="font-medium">Role:</span> {owner?.role || "N/A"}</p>
              <p><span className="font-medium">Active:</span> {owner?.isActive ? "Yes" : "No"}</p>
              {owner?.avatar && (
                <img
                  src={owner.avatar}
                  alt="Avatar"
                  className="mt-2 w-20 h-20 object-cover rounded-full border"
                />
              )}
            </div>

            {/* Hotels List */}
            <div className="p-4 border rounded shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Associated Hotels</h3>
              {hotels.length === 0 ? (
                <p className="text-gray-500">No hotels found for this owner.</p>
              ) : (
                <div className="space-y-3">
                  {hotels.map((hotel) => (
                    <div key={hotel._id} className="p-3 border rounded bg-white shadow-sm">
                      <p><span className="font-medium">Name:</span> {hotel.name || "N/A"}</p>
                      <p><span className="font-medium">Location:</span> {hotel.location || "N/A"}</p>
                      {/* Add more fields as needed */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
