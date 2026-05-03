const mongoose = require('mongoose');

const counselorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  bio: { type: String },
  experience: { type: String },
  languages: [String],
  availableSlots: [String], // e.g. ['09:00 AM', '11:00 AM', '02:00 PM']
  avatar: { type: String } // initials fallback
});

module.exports = mongoose.model('Counselor', counselorSchema);
