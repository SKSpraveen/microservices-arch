"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

interface TrackData {
  orderId: string
  hotelLocation: { lat: number; lng: number }
  driverLocation: { lat: number; lng: number }
  customerLocation: { lat: number; lng: number }
  status: string
}

export default function TrackingPage({ params }: any) {
  const [trackData, setTrackData] = useState<TrackData | null>(null)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/track-order/${params.id}`)
        setTrackData(res.data)
        setStatus(res.data.status)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching tracking data:", err)
        setLoading(false)
      }
    }

    fetchTracking()

    // Poll every 5 seconds
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/track-order/${params.id}`)
        setTrackData(res.data)
        setStatus(res.data.status)
      } catch (err) {
        console.error("Polling failed")
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [params.id])

  if (loading || !trackData) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tracking Order #{params.id}</h1>

      {/* Status */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="font-semibold">Current Status</h2>
        <p className="text-xl mt-2">{status}</p>
      </div>

      {/* Map */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden h-[400px] mb-6">
        <MapContainer center={[trackData.hotelLocation.lat, trackData.hotelLocation.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Hotel */}
          <Marker position={[trackData.hotelLocation.lat, trackData.hotelLocation.lng]}>
            <Popup>Hotel</Popup>
          </Marker>

          {/* Driver */}
          <Marker position={[trackData.driverLocation.lat, trackData.driverLocation.lng]}>
            <Popup>Driver</Popup>
          </Marker>

          {/* Customer */}
          <Marker position={[trackData.customerLocation.lat, trackData.customerLocation.lng]}>
            <Popup>You</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}