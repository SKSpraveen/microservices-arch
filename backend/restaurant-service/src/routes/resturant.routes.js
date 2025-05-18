const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/resturant.controller");
const authGuard  = require("../middleware/auth.middleware");

// Create a new hotel
router.post("/",hotelController.createHotel);

// Get a single hotel by ID
router.get("/getById/:id", hotelController.getHotel);

// Get a single hotel by ID
router.get("/getByUserId/:id", hotelController.getHotelByUserId);

// Get all hotels (with filtering and search)
router.get("/", hotelController.getAllHotels);

// Update a hotel by ID
router.put("/update/:id", hotelController.updateHotel); // Fixed missing "/"

// Delete a hotel by ID
router.delete("/:id", hotelController.deleteHotel);

// Rate a hotel
router.put("/rate/:id", hotelController.rateHotel);

// Remove a rating from a hotel
//router.put("/removeRate/:id", hotelController.removeRating);

module.exports = router;