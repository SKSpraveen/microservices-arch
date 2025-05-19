"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false, // 👈 disables SSR to avoid window undefined error
});

interface TrackData {
  orderId: string;
  hotelLocation: { lat: number; lng: number };
  driverLocation: { lat: number; lng: number };
  customerLocation: { lat: number; lng: number };
  status: string;
}

export default function TrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [trackData, setTrackData] = useState<TrackData | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/order/track-order/${id}`
        );
        setTrackData(res.data);
        console.log(res.data);
        setStatus(res.data.status);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tracking data:", err);
        setLoading(false);
      }
    };

    fetchTracking();

    const interval = setInterval(fetchTracking, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading || !trackData) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tracking Order #{id}</h1>
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="font-semibold">Current Status</h2>
        <p className="text-xl mt-2">{status}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden h-[400px] mb-6">
        <MapView
          hotel={trackData.hotelLocation}
          driver={trackData.driverLocation}
          customer={trackData.customerLocation}
        />
      </div>
    </div>
  );
}
