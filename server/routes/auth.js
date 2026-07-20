const express    = require('express');
const { body, validationResult } = require('express-validator');
const User       = require('../models/User');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const sendToken = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    data: user,
  });
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail().withMessage('Valid email required')
    .custom((value) => {
      const lower = value.toLowerCase();
      if (lower === 'admin@findit.local') return true;
      if (!lower.endsWith('@presidencyuniversity.in')) {
        throw new Error('College email must end with @presidencyuniversity.in');
      }
      return true;
    }),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const handleRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password, phone, department, year, rollNo } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password, phone, department, year, rollNo });
    sendToken(res, user, 201);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── POST /api/auth/signup ──────────────────────────────────────────────── */
router.post('/signup', registerValidation, handleRegister);
router.post('/register', registerValidation, handleRegister);

/* ─── POST /api/auth/login ───────────────────────────────────────────────── */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select("+password");

console.log("=================================");
console.log("LOGIN ATTEMPT");
console.log("Email:", email);
console.log("User Found:", !!user);

if (user) {
  console.log("DB Email:", user.email);

  const isMatch = await user.comparePassword(password);
  console.log("Password Match:", isMatch);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  sendToken(res, user);
} else {
  return res.status(401).json({
    success: false,
    message: "Invalid email or password.",
  });
}
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

/* ─── GET /api/auth/me ───────────────────────────────────────────────────── */
const { protect } = require('../middleware/auth');
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = router;
