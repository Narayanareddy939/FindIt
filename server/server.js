const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.development') });

const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes  = require('./routes/auth');
const itemRoutes  = require('./routes/items');
const userRoutes  = require('./routes/users');
const notifRoutes = require('./routes/notifications');
const User = require('./models/User');
const Item = require('./models/Item');
const Notification = require('./models/Notification');

const app  = express();
const HOST = process.env.HOST || '0.0.0.0';
const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const tryListen = (port) => new Promise((resolve, reject) => {
  const server = app.listen(port, HOST, () => {
    resolve(server);
  });

  server.on('error', (err) => {
    reject(err);
  });
});

/* ─── Middleware ─────────────────────────────────────────────────────────── */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://findit-ten-gilt.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* ─── Static uploads folder ─────────────────────────────────────────────── */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ─── Routes ─────────────────────────────────────────────────────────────── */
app.use('/api/auth',          authRoutes);
app.use('/api/items',         itemRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/notifications', notifRoutes);

/* ─── Health check ───────────────────────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({
    status:    'ok',
    service:   'FindIt API',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

/* ─── 404 handler ────────────────────────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* ─── Error handler ──────────────────────────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

/* ─── Demo data seeding ────────────────────────────────────────────────── */
const seedDemoData = async () => {
  try {
    // Always ensure admin user exists regardless of other data
    const adminEmail = 'admin@findit.local';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const bcrypt = require('bcryptjs');
      const hashedPwd = await bcrypt.hash('Admin@123', 12);
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPwd,
        phone: '+91 98765 43210',
        department: 'Administration',
        year: '2026',
        rollNo: 'ADMIN001',
        role: 'admin',
        isVerified: true,
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    const [userCount, itemCount, notificationCount] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Notification.countDocuments(),
    ]);

    if (userCount > 1 || itemCount > 0 || notificationCount > 0) {
      console.log('ℹ️ Existing data detected; skipping demo seed');
      return;
    }

    const demoUsers = [
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

    const createdUsers = await User.create(demoUsers);

    const demoItems = [
      {
        type: 'lost',
        title: 'Blue Airpods Pro',
        category: 'earphones',
        description: 'Lost blue AirPods Pro in the Engineering Block near the cafeteria. Has one small scratch on the case.',
        location: 'Engineering Block',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        time: '14:30',
        status: 'lost',
        verified: false,
        reward: '₹500',
        contactPhone: '+91 98765 43211',
        contactEmail: 'student@presidencyuniversity.in',
        views: 0,
        reporter: createdUsers[1]._id,
      },
      {
        type: 'found',
        title: 'Black Leather Wallet',
        category: 'wallet',
        description: 'Found a black leather wallet with student ID inside. Contains some cash and cards.',
        location: 'Main Gate',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        time: '10:15',
        status: 'found',
        verified: true,
        contactPhone: '+91 98765 43212',
        contactEmail: 'priya@presidencyuniversity.in',
        views: 5,
        reporter: createdUsers[2]._id,
      },
      {
        type: 'lost',
        title: 'Dell XPS 13 Laptop',
        category: 'laptop',
        description: 'Silver Dell XPS 13 with stickers on the lid. Lost in the library study area. Contains important coursework.',
        location: 'Library',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: '16:45',
        status: 'lost',
        verified: true,
        reward: '₹2000',
        contactPhone: '+91 98765 43211',
        contactEmail: 'student@presidencyuniversity.in',
        views: 12,
        reporter: createdUsers[1]._id,
      },
    ];

    const createdItems = await Item.create(demoItems);

    await Notification.create([
      {
        user: createdUsers[1]._id,
        type: 'match',
        title: 'Potential Match Found!',
        message: 'A found item matches your lost AirPods Pro report',
        relatedItem: createdItems[1]._id,
        actionUrl: `/item-details/${createdItems[1]._id}`,
      },
      {
        user: createdUsers[1]._id,
        type: 'system',
        title: 'Welcome to FindIt!',
        message: 'Welcome to the campus Lost & Found platform. Start by reporting your lost items.',
        read: true,
      },
    ]);

    console.log('✅ Demo accounts and sample items seeded');
  } catch (err) {
    console.error('⚠️ Demo seeding skipped:', err.message);
  }
};

/* ─── Fix Demo Passwords ─────────────────────────────────────────────────── */
const fixDemoPasswords = async () => {
  const bcrypt = require('bcryptjs');
  const demoPasswords = {
    'admin@findit.local': 'Admin@123',
    'podili.20231csd0092@presidencyuniversity.in': 'Podili@123',
    'akhil.20231csd0093@presidencyuniversity.in': 'Akhil@123',
    'charan.20231csd0094@presidencyuniversity.in': 'Charan@123',
    'nikhil.20231csd0095@presidencyuniversity.in': 'Nikhil@123',
    'rakesh.20231csd0096@presidencyuniversity.in': 'Rakesh@123',
  };
  const emails = Object.keys(demoPasswords);
  const users = await User.find({ email: { $in: emails } }).select('+password');
  for (const user of users) {
    const correctPwd = demoPasswords[user.email.toLowerCase()];
    if (!correctPwd) continue;
    const isMatch = await user.comparePassword(correctPwd).catch(() => false);
    if (!isMatch) {
     user.password = correctPwd;
await user.save({ validateBeforeSave: false });
      console.log(`🔑 Reset password for ${user.email}`);
    }
  }
};

/* ─── Database + Server ──────────────────────────────────────────────────── */
const startServer = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/findit';
    let memoryServer = null;

    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log('✅ MongoDB connected');
    } catch (connectErr) {
      if (!process.env.MONGO_URI || /localhost|127\.0\.0\.1/.test(mongoUri)) {
        memoryServer = await MongoMemoryServer.create();
        mongoUri = memoryServer.getUri();
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB connected via in-memory fallback');
      } else {
        throw connectErr;
      }
    }

    await seedDemoData();
    await fixDemoPasswords();

    let portToUse = DEFAULT_PORT;
    let server = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        server = await tryListen(portToUse);
        break;
      } catch (err) {
        if (err.code !== 'EADDRINUSE' || attempt === 4) {
          throw err;
        }

        portToUse += 1;
        console.warn(`⚠️ Port ${DEFAULT_PORT} is busy. Retrying on ${portToUse}...`);
      }
    }

    if (!server) {
      throw new Error('Unable to start server');
    }

    console.log(`🚀 FindIt API running on http://localhost:${portToUse}`);

    const shutdown = async () => {
      await mongoose.disconnect();
      if (memoryServer) {
        await memoryServer.stop();
      }
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
