const jwt = require('jsonwebtoken');

const journalUnlock = (req, res, next) => {
  const token = req.header('X-Journal-Token') || req.header('Journal-Token');
  if (!token) return res.status(401).json({ message: 'Journal locked' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified || verified.scope !== 'journal' || !verified.id) {
      return res.status(401).json({ message: 'Journal locked' });
    }
    // Extra safety: journal token must belong to the same authenticated user.
    if (String(verified.id) !== String(req.user?.id)) {
      return res.status(401).json({ message: 'Journal locked' });
    }
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'Journal locked' });
  }
};

module.exports = journalUnlock;
