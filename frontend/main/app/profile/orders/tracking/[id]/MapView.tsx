"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Icons
const hotelIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const driverIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const customerIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Props {
  hotel: { lat: number; lng: number };
  driver: { lat: number; lng: number };
  customer: { lat: number; lng: number };
}

export default function MapView({ hotel, driver, customer }: Props) {
  return (
    <MapContainer
      center={[hotel.lat, hotel.lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Hotel Marker */}
      <Marker position={[hotel.lat, hotel.lng]} icon={hotelIcon}>
        <Popup>🏨 Hotel</Popup>
      </Marker>

      {/* Driver Marker */}
      <Marker position={[driver.lat, driver.lng]} icon={driverIcon}>
        <Popup>🛵 Driver</Popup>
      </Marker>

      {/* Customer Marker */}
      <Marker position={[customer.lat, customer.lng]} icon={customerIcon}>
        <Popup>🧍 You</Popup>
      </Marker>
    </MapContainer>
  );
}
