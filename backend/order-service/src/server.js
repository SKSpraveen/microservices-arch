import 'dotenv/config'; // Load environment variables
import express from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import cors from 'cors';
import axios from 'axios';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://sksv:sksvD@cluster0.zychm.mongodb.net/orderDB?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Schemas
const orderSchema = new mongoose.Schema({
  paymentIntentId: String,
  totalAmount: Number,
  items: [{ name: String, quantity: Number, price: Number, hotelId: String }],
  userId: String,
  driverId: String,
  status: { type: String, default: 'pending' },
  deliveryLocation: { type: Object, default: {} }, // { lat, lng }
  createdAt: { type: Date, default: Date.now },
  hotelId: String,
});

const driverSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: [String], default: [] },
  NIC: { type: String, default: "" },
  isActive: { type: Boolean, default: false },
  isAuthorized: { type: Boolean, default: false },
  authCertificates: { type: Object, default: {} },
  currentOrder: { type: String, default: "" },
  role: { type: String, default: "driver" },
  avatar: { type: String, default: "" },
  isAvailable: { type: Boolean, default: true },
  currentLocation: { type: Object, default: {} }, // { lat, lng }
}, { timestamps: true });

const hotelSchema = new mongoose.Schema({
  hotelId: String,
  name: String,
  hotelAddress: { type: Object, default: {} }, // { lat, lng }
});

const trackOrderSchema = new mongoose.Schema({
  orderId: String,
  driverLocation: { type: Object, default: {} }, // { lat, lng }
  hotelLocation: { type: Object, default: {} }, // { lat, lng }
  customerLocation: { type: Object, default: {} }, // { lat, lng }
  status: { type: String, default: 'pending' }, // pending, picked-up, delivered
  createdAt: { type: Date, default: Date.now },
});

// Models
const Order = mongoose.model('Order', orderSchema);
const Driver = mongoose.model("Driver", driverSchema);
const Hotel = mongoose.model('Hotel', hotelSchema);
const TrackOrder = mongoose.model('TrackOrder', trackOrderSchema);

// Geocoding Functions
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  try {
    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
    throw new Error('No results found for the address');
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw new Error('Failed to geocode address');
  }
}

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  try {
    const response = await axios.get(url);
    if (response.data && response.data.display_name) {
      return response.data.display_name; // Human-readable address
    }
    throw new Error('No results found for the coordinates');
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw new Error('Failed to reverse geocode');
  }
}

// Distance Calculation
async function calculateDistance(lat1, lng1, lat2, lng2) {
  const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`);
  return response.data.routes[0].distance; // Distance in meters
}

// Create Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({ amount, currency });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: 'Failed to create PaymentIntent' });
  }
});

// Save Order to Database
app.post('/save-order', async (req, res) => {
  try {
    const { paymentIntentId, totalAmount, items, userId, deliveryAddress } = req.body;

    // Check if the order already exists
    const existingOrder = await Order.findOne({ paymentIntentId });
    if (existingOrder) return res.json({ message: 'Order already saved' });

    // Fetch hotel details based on the first item's hotelId
    const hotelId = items[0].hotelId;
    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

    // Convert addresses to coordinates
    const hotelLocation = await geocodeAddress(hotel.hotelAddress);
    const customerLocation = await geocodeAddress(deliveryAddress);

    // Fetch available drivers
    const availableDrivers = await Driver.find({ isAvailable: true });
    if (!availableDrivers.length) return res.status(400).json({ error: 'No drivers available' });

    // Find the closest driver to the hotel
    let closestDriver = null;
    let minDistance = Infinity;

    for (const driver of availableDrivers) {
      const distance = await calculateDistance(
        hotelLocation.lat,
        hotelLocation.lng,
        driver.currentLocation.lat,
        driver.currentLocation.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestDriver = driver;
      }
    }

    if (!closestDriver) return res.status(400).json({ error: 'No suitable driver found' });

    // Assign the closest driver to the order
    const driverId = closestDriver.driverId;

    // Save the new order
    const order = new Order({
      paymentIntentId,
      totalAmount,
      items,
      userId,
      driverId,
      hotelId,
      deliveryLocation: customerLocation,
    });
    await order.save();

    // Create a tracking entry for the order
    const trackOrder = new TrackOrder({
      orderId: order._id,
      driverLocation: closestDriver.currentLocation,
      hotelLocation,
      customerLocation,
    });
    await trackOrder.save();

    // Mark the driver as unavailable
    await Driver.updateOne({ driverId }, { isAvailable: false });

    res.json({ message: 'Order saved successfully', orderId: order._id });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

app.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userOrders = await Order.find({ userId }).lean();

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for the user.' });
    }
    const hotelFrequency = {};
    const itemFrequency = {};

    userOrders.forEach((order) => {

      const hotelId = order.hotelId;
      if (hotelId) {
        hotelFrequency[hotelId] = (hotelFrequency[hotelId] || 0) + 1;
      }

      order.items.forEach((item) => {
        const itemId = item._id;
        itemFrequency[itemId] = (itemFrequency[itemId] || 0) + item.quantity;
      });
    });

    const recommendatedHotelIds = Object.keys(hotelFrequency)
      .sort((a, b) => hotelFrequency[b] - hotelFrequency[a])
      .slice(0, 5); 

    const recommendatedItemsIds = Object.keys(itemFrequency)
      .sort((a, b) => itemFrequency[b] - itemFrequency[a]) 
      .slice(0, 10); 

    const fetchHotelDetails = async (hotelId) => {
      try {
        const response = await axios.get(`http://localhost:3003/api/hotel/getById/${hotelId}`);
        return response.data; 
      } catch (error) {
        console.error(`Error fetching hotel ${hotelId}:`, error.message);
        return null;
      }
    };

    const fetchFoodItemDetails = async (itemId) => {
      try {
        const response = await axios.get(`http://localhost:3003/api/hotel/foods/${itemId}`);
        return response.data; 
      } catch (error) {
        console.error(`Error fetching food item ${itemId}:`, error.message);
        return null;
      }
    };

    const recommendedHotels = await Promise.all(
      recommendatedHotelIds.map((hotelId) => fetchHotelDetails(hotelId))
    );

    const recommendedItems = await Promise.all(
      recommendatedItemsIds.map((itemId) => fetchFoodItemDetails(itemId))
    );

    const filteredHotels = recommendedHotels.filter((hotel) => hotel !== null);
    const filteredItems = recommendedItems.filter((item) => item !== null);

    res.status(200).json({
      recommendatedHotelIds,
      recommendatedItemsIds,
      recommendedHotels: filteredHotels,
      recommendedItems: filteredItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// Update Driver Location
app.post('/update-driver-location', async (req, res) => {
  try {
    const { driverId, location } = req.body;
    await Driver.updateOne({ driverId }, { currentLocation: location });
    res.json({ message: 'Driver location updated successfully' });
  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({ error: 'Failed to update driver location' });
  }
});

// Track Order
app.get('/track-order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const trackOrder = await TrackOrder.findOne({ orderId });
    if (!trackOrder) return res.status(404).json({ error: 'Order not found' });

    res.json({
      status: trackOrder.status,
      driverLocation: trackOrder.driverLocation,
      hotelLocation: trackOrder.hotelLocation,
      customerLocation: trackOrder.customerLocation,
    });
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
});

// CRUD Operations for Orders
app.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

app.get('/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    if (!orders.length) return res.status(204).json({ error: 'No orders found for this user' });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by user ID:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/orders/driver/:driverId', async (req, res) => {
  try {
    const { driverId } = req.params;
    const orders = await Order.find({ driverId });
    if (!orders.length) return res.status(404).json({ error: 'No orders found for this driver' });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by driver ID:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/orders/hotel/:hotelId', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const orders = await Order.find({ hotelId });
    if (!orders.length) return res.status(404).json({ error: 'No orders found for this hotel' });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by hotel ID:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.put('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.delete('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

app.post('/orders/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'canceled' },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

app.post('/orders/:orderId/deliver', async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'delivered' },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    res.status(500).json({ error: 'Failed to mark order as delivered' });
  }
});

// Start the server
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});