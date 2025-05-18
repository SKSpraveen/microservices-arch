const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    hotelID: { type: String, required: true },
    categoryName: { type: String, required: true },
    foodName: { type: String, required: true },
    images: { type: String, default: "https://i.pinimg.com/564x/de/64/1b/de641b58d8bcf05e4b5117adaf0cbf61.jpg" }, 
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    prepTime: { type: String, default: "" }, 
    tags: [{ type: String, default: [] }],
    allergens: [{ type: String, default: [] }],
    nutritionalInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      sodium: { type: Number, default: 0 },
    },
    isAvailable: { type: Boolean, default: false },
    availabilityReason: { type: String, default: "" },
    options: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        required: { type: Boolean, default: false },
        items: [
          {
            id: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, default: 0 },
          },
        ],
      },
    ],
    relatedItems: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, default: "" },
        price: { type: Number, default: 0 },
        image: { type: String, default: "default_banner_image_url" },
      },
    ],
    rating: { type: Number },
  },
  
  { timestamps: true }
);

const Food = mongoose.model("foodItems", FoodSchema);
module.exports = Food;