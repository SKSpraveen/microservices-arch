const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    
    userId: {
        type: String,
        required: true
    },

    refId: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true,
        enum: ["driver", "hotel", "food", "system"],
        default: "driver"
    },
    
    count: {
        type:Number,
        required: true
    },

    comment: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
    
}, {timestamps: true})

module.exports = mongoose.model('Review', reviewSchema)