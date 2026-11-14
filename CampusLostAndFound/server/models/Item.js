const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Lost', 'Found'],
      required: [true, 'Item type must be either Lost or Found'],
    },
    category: {
      type: String,
      enum: [
        'Electronics',
        'ID Cards & Wallets',
        'Keys',
        'Books & Stationery',
        'Clothing & Accessories',
        'Other',
      ],
      default: 'Other',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe the item'],
    },
    location: {
      type: String,
      required: [true, 'Please specify location where item was lost or found'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Open', 'Claimed'],
      default: 'Open',
    },
    contactInfo: {
      type: String,
      required: [true, 'Please provide contact information (Phone or Email)'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB TTL (Time-To-Live) Index:
// Automatically deletes post document 30 days (2,592,000 seconds) after creation
itemSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Item', itemSchema);
