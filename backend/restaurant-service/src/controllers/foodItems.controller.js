const Food = require("../models/foodItems.model");

//const hotelID = "2345567777654"

//TODO : Multer setup


// Create a new food item
exports.createFood = async (req, res) => {
  try {
    const { categoryName, foodName, images, price, description, isAvailable, isOfferAvailable, hotelID } = req.body;
    const newFood = new Food({
      hotelID:hotelID,
      categoryName,
      foodName,
      images,
      price,
      description,
      isAvailable,
      isOfferAvailable,
    });

    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all food items
exports.getAllFood = async (req, res) => {
  try {
    const foodItems = await Food.find();
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a food item by ID
exports.getFoodById = async (req, res) => {
  try {
    const { hotelID } = req.params; // Extract hotelID from request parameters

    // Validate hotelID
    if (!hotelID) {
      return res.status(400).json({
        success: false,
        message: "hotelID is required.",
      });
    }

    // Query the database for food items with the given hotelID
    const foodItems = await Food.find({ hotelID });

    // If no food items are found, return a 404 response
    if (!foodItems || foodItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No food items found for the given hotelID.",
      });
    }

    // Return the food items as a JSON response
    return res.status(200).json({
      success: true,
      data: foodItems,
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get a food item by ID
exports.getFoodBy_ID = async (req, res) => {
  try {
    const { id } = req.params; // Extract hotelID from request parameters

    // Validate hotelID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required.",
      });
    }

    // Query the database for food items with the given hotelID
    const foodItems = await Food.findById(id);

    // If no food items are found, return a 404 response
    if (!foodItems || foodItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No food items found for the given hotelID.",
      });
    }

    // Return the food items as a JSON response
    return res.status(200).json({
      success: true,
      data: foodItems,
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Delete a food item by ID
exports.deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing food item
exports.updateFood = async (req, res) => {
    try {
      const { categoryName, foodName, image, price, description, isAvailable, isOfferAvailable } = req.body;
  
      const updatedFood = await Food.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Return the updated document
      );
  
      if (!updatedFood) {
        return res.status(404).json({ message: "Food item not found" });
      }
  
      res.status(200).json(updatedFood);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


exports.rateFoodItem = async (req, res) => {
    try {
      let { ratingID } = req.body;
  
      // Ensure ratingID is an array before pushing
      if (!Array.isArray(ratingID)) {
        ratingID = [ratingID]; // Convert single string to an array
      }
  
      const updatedFoodItem = await Food.findByIdAndUpdate(
        req.params.id,
        { $push: { ratingID: { $each: ratingID } } }, // Ensure correct array push
        { new: true }
      );
  
      if (!updatedFoodItem) {
        return res.status(404).json({ message: "FoodItem not found" });
      }
  
      res.status(200).json(updatedFoodItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Remove a rating ID from a hotel
exports.removeRating = async (req, res) => {
    try {
      const { ratingID } = req.body;
  
      // Ensure ratingID is provided
      if (!ratingID) {
        return res.status(400).json({ message: "ratingID is required" });
      }
  
      // Update the hotel by pulling the ratingID from the array
      const updatedFoodItem = await Food.findByIdAndUpdate(
        req.params.id,
        { $pull: { ratingID: ratingID } },
        { new: true }
      );
  
      // Check if the FoodupdatedFoodItem was found and updated
      if (!updatedFoodItem) {
        return res.status(404).json({ message: "FoodupdatedFoodItem not found" });
      }
  
      res.status(200).json(updatedFoodItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  