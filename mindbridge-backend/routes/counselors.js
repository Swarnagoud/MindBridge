const express = require('express');
const mongoose = require('mongoose');
const Counselor = require('../models/Counselor');
const auth = require('../middleware/auth');

const router = express.Router();
let seedCompleted = false;
let seedInProgress = false;

// Seed counselors if none exist
const seedCounselors = async () => {
  // Avoid crashing the app if Mongo connection isn't ready yet.
  if (mongoose.connection.readyState !== 1) return;
  const count = await Counselor.countDocuments();
  if (count > 0) return;

  await Counselor.insertMany([
    {
      name: 'Dr. Priya Sharma',
      specialty: 'Anxiety & Stress Management',
      bio: 'Specializes in cognitive behavioral therapy for anxiety, stress, and burnout.',
      experience: '8 years',
      languages: ['English', 'Hindi'],
      availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      avatar: 'PS'
    },
    {
      name: 'Dr. Arjun Mehta',
      specialty: 'Depression & Mood Disorders',
      bio: 'Expert in treating depression, bipolar disorder, and emotional regulation.',
      experience: '12 years',
      languages: ['English', 'Hindi', 'Gujarati'],
      availableSlots: ['10:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'],
      avatar: 'AM'
    },
    {
      name: 'Dr. Kavya Nair',
      specialty: 'Trauma & Relationship Counseling',
      bio: 'Focuses on trauma recovery, grief counseling, and relationship issues.',
      experience: '6 years',
      languages: ['English', 'Malayalam', 'Tamil'],
      availableSlots: ['09:30 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
      avatar: 'KN'
    },
    {
      name: 'Dr. Rahul Verma',
      specialty: 'Youth & Student Mental Health',
      bio: 'Dedicated to helping students and young adults navigate academic pressure and identity.',
      experience: '5 years',
      languages: ['English', 'Hindi', 'Punjabi'],
      availableSlots: ['10:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'],
      avatar: 'RV'
    }
  ]);

  console.log('Counselors seeded');
};

const seedCounselorsSafely = async () => {
  if (seedCompleted || seedInProgress) return;
  seedInProgress = true;
  try {
    await seedCounselors();
    seedCompleted = true;
  } catch (err) {
    console.error('Counselor seed skipped:', err.message);
  } finally {
    seedInProgress = false;
  }
};

// Try once on startup, but never crash server if DB is not ready.
seedCounselorsSafely();

// GET all counselors
router.get('/', auth, async (req, res) => {
  try {
    await seedCounselorsSafely();
    const counselors = await Counselor.find();
    res.json(counselors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
