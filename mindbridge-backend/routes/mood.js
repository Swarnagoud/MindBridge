const express = require('express');
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');

const router = express.Router();

// Add mood
router.post('/', auth, async (req, res) => {
  const { mood, note } = req.body;
  const userId = req.user.id;

  try {
    const newMood = new Mood({ userId, mood, note });
    await newMood.save();
    res.json({ message: 'Mood logged successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get moods for user (last 30 days)
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    const moods = await Mood.find({ userId, date: { $gte: thirtyDaysAgo } }).sort({ date: 1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;