const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const dbConnection = require("./config/dbConfig");
const resturantRoutes = require("./routes/resturant.routes");
const foodItemsRoutes = require("./routes/foodItems.route");
const flashDealsRoutes = require("./routes/flashDeals.route");

dotenv.config();

const app = express();

// Middleware setup
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());



//getting database connected

(async () => {
  await dbConnection();  
})();

// Routes setup
app.use('/api/hotel',resturantRoutes);
app.use('/api/hotel/foods',foodItemsRoutes);
app.use('/api/hotel/flashDeals',flashDealsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Server activation
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//TODO:Search, pagination