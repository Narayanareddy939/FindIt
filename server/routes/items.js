const express  = require('express');
const Item     = require('../models/Item');
const User     = require('../models/User');
const Notification = require('../models/Notification');
const { protect, adminOnly } = require('../middleware/auth');
const upload   = require('../middleware/upload');

const router = express.Router();

/* ─── POST /api/items/upload — Upload images ────────────────────────────── */
router.post('/upload', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
    }));

    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── GET /api/items — List all items with filters ───────────────────────── */
router.get('/', async (req, res) => {
  try {
    const {
      type, category, status, location,
      q, sort = 'newest', page = 1, limit = 20,
    } = req.query;

    const filter = {};
    if (type)     filter.type     = type;
    if (category) filter.category = category;
    if (status)   filter.status   = status;
    if (q)        filter.$text    = { $search: q };

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt:  1 },
      views:  { views: -1 },
    };

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const items = await Item.find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reporter', 'name email avatar department');

    const total = await Item.countDocuments(filter);

    res.json({
      success: true,
      count:   items.length,
      total,
      pages:   Math.ceil(total / parseInt(limit)),
      data:    items,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── GET /api/items/:id ─────────────────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reporter', 'name email phone avatar department');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    await item.incrementViews();
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── POST /api/items ────────────────────────────────────────────────────── */
router.post('/', protect, async (req, res) => {
  try {
    const item = await Item.create({ ...req.body, reporter: req.user._id });
    await item.populate('reporter', 'name email phone avatar department');
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/* ─── PUT /api/items/:id ─────────────────────────────────────────────────── */
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const isOwner = item.reporter.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Not authorized' });

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('reporter', 'name email phone avatar department');
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/* ─── DELETE /api/items/:id ──────────────────────────────────────────────── */
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const isOwner = item.reporter.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Not authorized' });

    await item.deleteOne();
    res.json({ success: true, message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── GET /api/items/:id/matches — AI match suggestions ─────────────────── */
router.get('/:id/matches', async (req, res) => {
  try {
    const item    = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const opp     = item.type === 'lost' ? 'found' : 'lost';
    const similar = await Item.find({ type: opp, category: item.category })
      .populate('reporter', 'name avatar')
      .limit(5);

    res.json({ success: true, count: similar.length, data: similar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── PUT /api/items/:id/status — mark returned ──────────────────────────── */
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['returned'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const isOwner = item.reporter.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update status' });
    }

    item.status = status;
    await item.save();
    await item.populate('reporter', 'name email phone avatar department');

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── POST /api/items/:id/bookmark — Toggle bookmark ───────────────────── */
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const bookmarkIndex = user.bookmarks.indexOf(req.params.id);

    if (bookmarkIndex > -1) {
      user.bookmarks.splice(bookmarkIndex, 1);
    } else {
      user.bookmarks.push(req.params.id);
    }

    await user.save();
    res.json({ success: true, isBookmarked: bookmarkIndex === -1, data: user.bookmarks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─── GET /api/items/bookmarks — Get user bookmarks ──────────────────────── */
router.get('/user/bookmarks', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    res.json({ success: true, count: user.bookmarks.length, data: user.bookmarks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
