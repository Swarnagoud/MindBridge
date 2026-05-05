const express = require('express');
const Mood = require('../models/Mood');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    // Get latest mood
    const latestMood = await Mood.findOne({ userId }).sort({ date: -1 });

    // Get last 3 chats
    const recentChats = await Chat.find({ userId }).sort({ timestamp: -1 }).limit(3);

    const sentiments = recentChats.map(chat => chat.sentiment);

    // Map emoji to sentiment string
    const emojiToSentiment = {
      '😢': 'sad',
      '😟': 'sad',
      '😐': 'neutral',
      '😊': 'happy',
      '😃': 'happy'
    };
    const mood = latestMood ? (emojiToSentiment[latestMood.mood] || latestMood.mood) : 'neutral';

    // Simple recommendation logic
    let recommendations = [];

    if (mood === 'sad' || sentiments.includes('sadness') || sentiments.includes('sad')) {
      recommendations = [
        { title: 'Breathing Exercise', description: 'Try the 4-7-8 breathing technique.', link: 'https://www.youtube.com/results?search_query=4-7-8+breathing+exercise' },
        { title: 'Gratitude Journal', description: 'Write down 3 things you\'re grateful for.' },
        { title: 'Nature Walk', description: 'Spend 10 minutes in nature.' }
      ];
    } else if (mood === 'stress' || sentiments.includes('stress') || sentiments.includes('stressed')) {
      recommendations = [
        { title: 'Progressive Muscle Relaxation', description: 'Tense and relax each muscle group.', link: 'https://www.youtube.com/results?search_query=progressive+muscle+relaxation+guided' },
        { title: 'Mindful Meditation', description: '5-minute guided meditation.' },
        { title: 'Healthy Snack', description: 'Eat something nutritious.' }
      ];
    } else if (mood === 'anxiety' || sentiments.includes('anxiety') || sentiments.includes('anxious')) {
      recommendations = [
        { title: 'Grounding Technique', description: 'Name 5 things you can see, 4 you can touch, etc.' },
        { title: 'Calming Music', description: 'Listen to soothing music.', link: 'https://www.youtube.com/results?search_query=calming+music+for+anxiety' },
        { title: 'Talk to a Friend', description: 'Share your feelings with someone you trust.' }
      ];
    } else {
      recommendations = [
        { title: 'Daily Affirmations', description: 'Repeat positive affirmations.' },
        { title: 'Exercise', description: 'Go for a walk or do some light exercise.' },
        { title: 'Hobby Time', description: 'Engage in a hobby you enjoy.' }
      ];
    }

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
