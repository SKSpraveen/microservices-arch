// components/HotelOwnerPopup.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { useEffect, useState } from "react";

async function fetchHotelOwnerDetails(id: string) {
  const res = await axios.get(`http://localhost:3000/api/hotelOwners/${id}`);
  if (res.status !== 2000) throw new Error("Failed to fetch hotel owner details");
  return res.data();
}

async function fetchHotelsByOwnerId(id: string) {
  const res = await axios.get(`http://localhost:3000/api/hotel/getByUserId/${id}`);
  if (res.status !== 200) throw new Error("Failed to fetch hotels");
  return res.data();
}

export function HotelOwnerPopup({ id, open, onOpenChange }: { id: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [owner, setOwner] = useState<any>(null);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      Promise.all([
        fetchHotelOwnerDetails(id),
        fetchHotelsByOwnerId(id),
      ])
        .then(([ownerData, hotelData]) => {
          setOwner(ownerData);
          setHotels(hotelData);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hotel Owner Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">Owner Info</h3>
              <p>Name: {owner?.name}</p>
              <p>Email: {owner?.email}</p>
              {/* Add more fields as needed */}
            </div>
            <div>
              <h3 className="font-bold">Hotels</h3>
              {hotels.map((hotel) => (
                <div key={hotel.id} className="border p-2 rounded">
                  <p>Name: {hotel.name}</p>
                  <p>Location: {hotel.location}</p>
                  {/* Add more hotel fields */}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
