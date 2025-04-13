// lib/models/WasteEntry.js
import mongoose from 'mongoose';

const WasteEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  wasteType: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  points: {
    type: Number,
    required: true,
    default: 10, // Default points for each entry
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  collected:{
    type:Boolean,
    default:false
  }
});
// Create a geospatial index on the location field
WasteEntrySchema.index({ location: '2dsphere' });
export default mongoose.models.WasteEntry || mongoose.model('WasteEntry', WasteEntrySchema);