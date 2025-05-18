const Hotel = require("../models/resturant.model");

exports.createHotel = async (req, res) => {
  try {
    const {
      hotelName,
      hotelAddress,
      metaData,
      banner,
      isAuthorized,
      authCertificates,
      ordersCount,
      location,
      opentime,
      categoriesprovider,
      cousinProvided,
      isFeatured,
      userID
    } = req.body;

    // Validate required fields
    if (!hotelName || !hotelAddress || !location || !opentime) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const newHotel = new Hotel({
      userID,
      hotelName,
      hotelAddress,
      metaData,
      banner: banner,
      isAuthorized: isAuthorized || false,
      authCertificates: authCertificates || {},
      ordersCount: ordersCount || 0,
      location,
      opentime,
      rating: 0,
      categoriesprovider: categoriesprovider || [],
      cousinProvided: cousinProvided || [],
      isFeatured: isFeatured || false,
    });

    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single hotel by ID
exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHotelByUserId = async (req, res) => {
  try {
    const hotel = await Hotel.find({userId: req.params.userId});
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all hotels with filtering and search

exports.getAllHotels = async (req, res) => {
  try {
    const { name, address, cuisine, dietary, category, sort, search, location } = req.query;

    const query = {};

    if (search) {
      query.hotelName = { $regex: search, $options: "i" };
    }

    if (location) {
      query.hotelAddress = { $regex: location, $options: "i" };
    }

    if (name) {
      query.hotelName = { $regex: name, $options: "i" };
    }

    if (address) {
      query.hotelAddress = { $regex: address, $options: "i" };
    }

    if (cuisine) {
      query.categoriesprovider = { $in: cuisine.split(",") };
    }

    if (dietary) {
      query.cousinProvided = { $in: dietary.split(",") };
    }

    if (category) {
      query.categoriesprovider = { $in: category.split(",") };
    }

    let sortOptions = {};
    if (sort === "a-z") {
      sortOptions = { hotelName: 1 };
    } else if (sort === "z-a") {
      sortOptions = { hotelName: -1 };
    }

    const hotels = await Hotel.find(query).sort(sortOptions);
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update an existing hotel
exports.updateHotel = async (req, res) => {
  try {
    const {
      hotelName,
      hotelAddress,
      metaData,
      banner,
      isAuthorized,
      authCertificates,
      ordersCount,
      location,
      opentime,
      categoriesprovider,
      cousinProvided,
      isFeatured,
    } = req.body;

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        hotelName,
        hotelAddress,
        metaData,
        banner,
        isAuthorized,
        authCertificates,
        ordersCount,
        location,
        opentime,
        categoriesprovider,
        cousinProvided,
        isFeatured,
      },
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a hotel by ID
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if(!hotel){
      return res.status(404).json({ message: "Hotel not found" });
  1 }

    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel deleted successfully");
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rate a hotel
exports.rateHotel = async (req, res) => {
  try {
    const { rating } = req.body;

    // Validate rating input
    if (!rating || typeof rating !== "number" || rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating value" });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $inc: { rating: rating } }, // Increment the rating field
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};