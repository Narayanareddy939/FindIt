const express = require('express');
const User    = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const DEMO_USERS = [
  {
    name: 'Admin User',
    email: 'admin@findit.local',
    password: 'Admin@123',
    phone: '+91 98765 43210',
    department: 'Administration',
    year: '2026',
    rollNo: 'ADMIN001',
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'Podili',
    email: 'podili.20231CSD0092@presidencyuniversity.in',
    password: 'Podili@123',
    phone: '+91 98765 43221',
    department: 'Computer Science',
    year: '3',
    rollNo: '20231CSD0092',
    role: 'student',
    isVerified: true,
  },
  {
    name: 'Akhil',
    email: 'akhil.20231CSD0093@presidencyuniversity.in',
    password: 'Akhil@123',
    phone: '+91 98765 43222',
    department: 'Computer Science',
    year: '3',
    rollNo: '20231CSD0093',
    role: 'student',
    isVerified: true,
  },
  {
    name: 'Charan',
    email: 'charan.20231CSD0094@presidencyuniversity.in',
    password: 'Charan@123',
    phone: '+91 98765 43223',
    department: 'Computer Science',
    year: '3',
    rollNo: '20231CSD0094',
    role: 'student',
    isVerified: true,
  },
  {
    name: 'Nikhil',
    email: 'nikhil.20231CSD0095@presidencyuniversity.in',
    password: 'Nikhil@123',
    phone: '+91 98765 43224',
    department: 'Computer Science',
    year: '3',
    rollNo: '20231CSD0095',
    role: 'student',
    isVerified: true,
  },
  {
    name: 'Rakesh',
    email: 'rakesh.20231CSD0096@presidencyuniversity.in',
    password: 'Rakesh@123',
    phone: '+91 98765 43225',
    department: 'Computer Science',
    year: '3',
    rollNo: '20231CSD0096',
    role: 'student',
    isVerified: true,
  },
];

const DEMO_EMAILS = DEMO_USERS.map((user) => user.email.toLowerCase());

/* ─── GET /api/users/dashboard ──────────────────────────────────────────── */
router.get('/dashboard', protect, async (req, res) => {
  try {
    const Item = require('../models/Item');
    const [myLost, myFound, recovered] = await Promise.all([
      Item.countDocuments({ reporter: req.user._id, type: 'lost' }),
      Item.countDocuments({ reporter: req.user._id, type: 'found' }),
      Item.countDocuments({ reporter: req.user._id, status: 'returned' }),
    ]);

    res.json({
      success: true,
      data: {
        user:      req.user,
        stats:     { myLost, myFound, recovered },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── GET /api/users/profile ─────────────────────────────────────────────── */
router.get('/profile', protect, (req, res) => {
  res.json({ success: true, data: req.user });
});

/* ─── PUT /api/users/profile ─────────────────────────────────────────────── */
router.put('/profile', protect, async (req, res) => {
  const { name, phone, department, year, rollNo } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, department, year, rollNo },
      { new: true, runValidators: true },
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/* ─── GET /api/users — Admin: list all users ──────────────────────────────── */
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── POST /api/users/demo — Admin: seed demo accounts ───────────────────── */
router.post('/demo', protect, adminOnly, async (req, res) => {
  try {
    const existing = await User.find({ email: { $in: DEMO_EMAILS } }).select('email');
    const existingEmails = existing.map((user) => user.email.toLowerCase());
    const usersToCreate = DEMO_USERS.filter((user) => !existingEmails.includes(user.email.toLowerCase()));

    let created = [];
    if (usersToCreate.length > 0) {
      created = await User.create(usersToCreate);
    }

    return res.json({
      success: true,
      createdCount: created.length,
      skipped: existingEmails,
      data: created,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── DELETE /api/users/demo — Admin: remove seeded demo accounts ───────── */
router.delete('/demo', protect, adminOnly, async (req, res) => {
  try {
    const result = await User.deleteMany({ email: { $in: DEMO_EMAILS } });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── DELETE /api/users/:id — Admin: remove a user ───────────────────────── */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, message: 'User removed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
