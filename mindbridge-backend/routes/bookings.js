const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// POST - create a booking
router.post('/', auth, async (req, res) => {
  const { counselorId, date, slot, reason } = req.body;
  const userId = req.user.id;

  if (!counselorId || !date || !slot) {
    return res.status(400).json({ message: 'Counselor, date, and slot are required.' });
  }

  try {
    // Prevent double-booking same counselor + date + slot
    const existing = await Booking.findOne({ counselorId, date, slot, status: 'upcoming' });
    if (existing) {
      return res.status(409).json({ message: 'This slot is already booked. Please choose another.' });
    }

    const booking = new Booking({ userId, counselorId, date, slot, reason });
    await booking.save();
    await booking.populate('counselorId', 'name specialty');
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - user's bookings
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const bookings = await Booking.find({ userId })
      .populate('counselorId', 'name specialty avatar')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH - cancel a booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
