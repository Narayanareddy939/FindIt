require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
const Notification = require('./models/Notification');
    // Clear existing data
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

const DEMO_ITEMS = [
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
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/findit');
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    await Notification.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo users
    const createdUsers = await User.create(DEMO_USERS);
    console.log(`✅ Created ${createdUsers.length} demo users`);

    // Create demo items
    const itemsWithReporters = DEMO_ITEMS.map((item, index) => ({
      ...item,
      reporter: createdUsers[index % createdUsers.length]._id,
    }));

    const createdItems = await Item.create(itemsWithReporters);
    console.log(`✅ Created ${createdItems.length} demo items`);

    // Create sample notifications
    const notifications = [
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
    ];

    await Notification.create(notifications);
    console.log(`✅ Created sample notifications`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📧 Demo Accounts:');
    console.log('  Admin: admin@findit.local / Admin@123');
    console.log('  Student: student@presidencyuniversity.in / Student@123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
