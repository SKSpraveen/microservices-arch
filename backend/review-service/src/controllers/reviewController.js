const Review = require("../models/reviewModel");
const errorHandler = require("../utils/error");

// Create a new review
const createReview = async (req, res, next) => {
  try {
    const { userId, refId, type, count, comment, username } = req.body;

    // Validate required fields
    if (!userId || !refId || !type || !count || !comment) {
      return next(errorHandler(400, "All fields are required"));
    }


    // Validate `type` enum values
    const validTypes = ["driver", "hotel", "food", "system"];
    if (!validTypes.includes(type)) {
      return next(errorHandler(400, "Invalid type. Must be one of: driver, hotel, food, system"));
    }

    const newReview = new Review({
      userId,
      refId,
      type,
      count,
      comment,
      username
    });

    const savedReview = await newReview.save();
    // const res = axios.put("http://localhost:3000/api/hotel/"+ refId, {})
    res.status(201).json(savedReview);
  } catch (error) {
    next(error);
  }
};

// Get all reviews
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();

    if (reviews.length === 0) {
      return next(errorHandler(404, "No reviews found"));
    }

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

// Get a single review by ID
const getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return next(errorHandler(404, "Review not found"));
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

// Get all reviews by `refId`
const getAllReviewsByRefId = async (req, res, next) => {
  try {
    const { refId } = req.params;

    const reviews = await Review.find({ refId });

    if (reviews.length === 0) {
      return next(errorHandler(404, "No reviews found for this reference ID"));
    }

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

// Update a review by ID
const updateReview = async (req, res, next) => {
  try {
    const { count, comment } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { count, comment },
      { new: true }
    );

    if (!updatedReview) {
      return next(errorHandler(404, "Review not found"));
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
};

// Delete a review by ID
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return next(errorHandler(404, "Review not found"));
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).json("Review has been deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  getAllReviewsByRefId,
  updateReview,
  deleteReview,
};