"use client";
import React, { useState } from "react";
import {
	FaUtensils,
	FaMotorcycle,
	FaClock,
	FaMoneyBillWave,
	FaUser,
	FaHotel,
	FaBox,
	FaClinicMedical,
} from "react-icons/fa";
import Hotel from "./hotel";
import AddHotel from "./addHotels";
import { useEffect } from "react";
import axios from "axios";
import { fetchRestaurants, logout } from "@/api";

export default function RestaurantDashboard() {
	const restaurantStats = {
		totalOrders: 150,
		activeDeliveries: 12,
		averageDeliveryTime: "25 mins",
		todayEarnings: "$1,250",
	};

	// State to store hotels and orders
	const [hotels, setHotels] = useState<any[]>([]);
	const [orders, setOrders] = useState<any[]>([]);
	const [activeSection, setActiveSection] = useState("dashboard");

	// Fetching hotels and orders when the component mounts
	useEffect(() => {
		const fetchHotels = async () => {
			try {
				// Fetch all restaurants (hotels) for the current user
				let restaurantData: any = await fetchRestaurants();

				// Filter the restaurants to include only those that belong to the current user
				restaurantData = restaurantData.filter(
					(restaurant: any) =>
						restaurant.userID ===
						JSON.parse(localStorage.getItem("userProfile")!).userId
				);

				// Set the fetched hotels data
				setHotels(restaurantData);

				// Fetch orders for each hotel
				let allOrders = [];
				for (const hotel of restaurantData) {
					const ordersResponse = await axios.get(
						`http://localhost:3000/orders/hotel/${hotel._id}`
					);
					allOrders.push(...ordersResponse.data);
				}

				// Set the orders for all hotels
				setOrders(allOrders);
			} catch (err) {
				console.error("Error fetching data", err);
			}
		};

		fetchHotels();
	}, []);

	// Calculate active deliveries (for analytics)
	const activeDeliveries = orders.filter(
		(order) => order.status === "pending"
	).length;

	// Total hotels count for analytics
	const totalHotels = hotels.length;

	// Total orders count
	const totalOrders = orders.length;

	const income = () => {
		let netIncome = 0;

		orders.forEach((o) => {
			netIncome += o.totalAmount;
		});

		return netIncome;
	};
	useEffect(() => {
		const auth = localStorage.getItem("authToken");
		if( !auth ){
			window.location.href = "/signin";
		}
	})

	return (
		<div className="flex min-h-screen bg-gray-900 text-gray-200">
			{/* Sidebar */}
			<aside className="relative w-64 bg-gray-800 shadow-lg p-6">
				<div className="mb-10">
					<h2 className="text-2xl font-bold">Hello {}</h2>
				</div>
				<nav className="flex flex-col space-y-4">
					<SidebarLink
						icon={<FaBox />}
						text="Dashboard"
						onClick={() => setActiveSection("dashboard")}
					/>
					<SidebarLink
						icon={<FaHotel />}
						text="Hotels"
						onClick={() => setActiveSection("hotels")}
					/>
				</nav>
				<button className="absolute bottom-2 mt-10 w-[200px] bg-red-600 text-white py-2 rounded-lg hover:bg-red-700" onClick={async () => {
					if (localStorage.getItem('userProfile')) localStorage.removeItem('userProfile')
					await logout()
				}}>
					{/* Add an icon here if needed */}
					<FaClinicMedical className="inline mr-2" />
					Logout
				</button>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-6">
				{activeSection === "profile" && (
					<>
						<h1 className="text-2xl font-bold mb-6">Profile</h1>
						<p>This is the profile page content!</p>
					</>
				)}

				{activeSection === "addHotels" && (
					<>
						<h1 className="text-2xl font-bold mb-6">Add Hotel</h1>
						<AddHotel />
					</>
				)}

				{activeSection === "hotels" && (
					<>
						<h1 className="text-2xl font-bold mb-6">Hotels</h1>
						<Hotel />
					</>
				)}

				{activeSection === "dashboard" && (
					<>
						<h1 className="text-2xl font-bold mb-6">Restaurant Dashboard</h1>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
							<StatCard
								icon={<FaUtensils />}
								title="Total Orders"
								value={orders.length}
								color="bg-blue-600"
							/>

							<StatCard
								icon={<FaMotorcycle />}
								title="Active Deliveries"
								value={activeDeliveries} // Pass the number directly
								color="bg-green-600"
							/>

							<StatCard
								icon={<FaMoneyBillWave />}
								title="Today's Earnings"
								value={income()}
								color="bg-purple-600"
							/>

							<StatCard
								icon={<FaMoneyBillWave />}
								title="Total Hotels"
								value={hotels.length}
								color="bg-purple-600"
							/>
						</div>

						{/* Recent Orders */}
						<div className="bg-gray-800 rounded-lg shadow p-6">
							<h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="bg-gray-700">
											<th className="px-6 py-3 text-left">Order ID</th>
											<th className="px-6 py-3 text-left">Customer</th>
											<th className="px-6 py-3 text-left">Items</th>
											<th className="px-6 py-3 text-left">Status</th>
											<th className="px-6 py-3 text-left">Time</th>
										</tr>
									</thead>
									<tbody>
										{Array.isArray(orders) &&
											orders.map((order) => (
												<tr key={order.id} className="border-t border-gray-700">
													<td className="px-6 py-4">{order.id}</td>
													<td className="px-6 py-4">{order.customer}</td>
													<td className="px-6 py-4">{order.items}</td>
													<td className="px-6 py-4">
														<span
															className={`px-2 py-1 rounded-full text-sm ${
																order.status === "Delivered"
																	? "bg-green-700 text-green-300"
																	: "bg-yellow-700 text-yellow-300"
															}`}
														>
															{order.status}
														</span>
													</td>
													<td className="px-6 py-4">{order.time}</td>
												</tr>
											))}
									</tbody>
								</table>
							</div>
						</div>
					</>
				)}
			</main>
		</div>
	);
}

// Stat Card Component
function StatCard({
	icon,
	title,
	value,
	color,
}: {
	icon: React.ReactNode;
	title: string;
	value: string | number;
	color: string;
}) {
	return (
		<div className="bg-gray-800 rounded-lg shadow p-6">
			<div className="flex items-center">
				<div className={`${color} p-3 rounded-full text-white mr-4`}>
					{icon}
				</div>
				<div>
					<h3 className="text-gray-400 text-sm">{title}</h3>
					<p className="text-2xl font-semibold text-white">{value}</p>
				</div>
			</div>
		</div>
	);
}

// Sidebar Link Component
function SidebarLink({
	icon,
	text,
	onClick,
}: {
	icon: React.ReactNode;
	text: string;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className="flex items-center space-x-3 text-gray-300 hover:text-white hover:font-semibold"
		>
			{icon}
			<span>{text}</span>
		</button>
	);
}
