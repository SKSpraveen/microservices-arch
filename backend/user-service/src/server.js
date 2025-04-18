import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dbConnection from "./config/dbConfig.js";
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.route.js'
import driverRoutes from './routes/driver.route.js';

dotenv.config();

const app = express();

// Middleware setup
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],

}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
  

//getting database connected

(async () => {
  await dbConnection();  
})();

// Routes setup
app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', driverRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
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