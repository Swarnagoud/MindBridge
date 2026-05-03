const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor', required: true },
  date: { type: String, required: true },   // e.g. '2026-04-20'
  slot: { type: String, required: true },   // e.g. '10:00 AM'
  reason: { type: String },
  status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
