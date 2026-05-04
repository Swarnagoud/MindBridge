const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const journalUnlock = require('../middleware/journalUnlock');
const User = require('../models/User');
const Journal = require('../models/Journal');

const router = express.Router();

// Unlock journal by re-entering account password (issues short-lived journal token).
router.post('/unlock', auth, async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password is required' });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Incorrect password' });

    const expiresInSeconds = 15 * 60;
    const journalToken = jwt.sign(
      { id: user._id, scope: 'journal' },
      process.env.JWT_SECRET,
      { expiresIn: expiresInSeconds }
    );

    return res.json({ journalToken, expiresInSeconds });
  } catch (_err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// List journals
router.get('/', auth, journalUnlock, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('_id title content createdAt updatedAt');
    return res.json(entries);
  } catch (_err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create journal
router.post('/', auth, journalUnlock, async (req, res) => {
  const { title = '', content } = req.body;
  if (!content || !String(content).trim()) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const entry = new Journal({
      userId: req.user.id,
      title: String(title || '').trim(),
      content: String(content).trim()
    });
    await entry.save();
    return res.status(201).json(entry);
  } catch (_err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update journal
router.put('/:id', auth, journalUnlock, async (req, res) => {
  const { title = '', content } = req.body;
  if (!content || !String(content).trim()) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const entry = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title: String(title || '').trim(), content: String(content).trim() },
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Journal not found' });
    return res.json(entry);
  } catch (_err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete journal
router.delete('/:id', auth, journalUnlock, async (req, res) => {
  try {
    const deleted = await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Journal not found' });
    return res.json({ ok: true });
  } catch (_err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

