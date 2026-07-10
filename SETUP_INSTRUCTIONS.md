# FindIt — Quick Setup Guide

Get FindIt running locally in 5 minutes!

---

## 🚀 One-Command Setup (Recommended)

```bash
npm run setup
```

This installs all dependencies and seeds demo data. Then skip to step 3 below.

---

## Manual Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Or manually:
npm install
cd client && npm install
cd ../server && npm install
```

### Step 2: Configure Environment

**Create `server/.env` file:**

```bash
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/findit
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=optional_for_image_uploads
CLOUDINARY_API_KEY=optional
CLOUDINARY_API_SECRET=optional
```

**Create `client/.env.development` file:**

```bash
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Seed Demo Data

```bash
npm run seed
```

**Demo Accounts Created:**
- Admin: `admin@findit.local` / `Admin@123`
- Student: `student@presidencyuniversity.in` / `Student@123`

### Step 4: Start Development Servers

**Option A: Run Both Servers (Recommended)**
```bash
npm run dev
```

**Option B: Run Separately**

Terminal 1 — Backend:
```bash
npm run dev:server
```

Terminal 2 — Frontend:
```bash
npm run dev:client
```

### Step 5: Open in Browser

```
http://localhost:5173
```

Click "Sign In" → "Try Demo Account" → Explore! 🎉

---

## 🔒 Demo Account Features

### Admin Account
- Email: `admin@findit.local`
- Password: `Admin@123`
- Access: Admin Dashboard, approve items, view users

### Student Account
- Email: `student@presidencyuniversity.in`
- Password: `Student@123`
- Access: Full student features, report items, search, bookmarks

---

## ✅ Verify Setup Works

After starting servers, check:

1. **Frontend loads:** [http://localhost:5173](http://localhost:5173)
2. **Backend health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
3. **Can login:** Use demo credentials above
4. **Dashboard appears:** After login, should see stats and notifications
5. **Search works:** Browse Items shows items from database

---

## 📝 Common Commands

```bash
# Start both servers
npm run dev

# Run just backend
npm run dev:server

# Run just frontend
npm run dev:client

# Seed database
npm run seed

# Build for production
npm run build

# Full setup from scratch
npm run setup
```

---

## 🗄️ Database (MongoDB)

### Option 1: Local MongoDB (Recommended for development)

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Windows (with Chocolatey)
choco install mongodb-community

# Linux (Ubuntu/Debian)
sudo systemctl start mongod

# Verify running
mongo --version
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

---

## 🖼️ Images (Cloudinary)

Images are optional for local development. To enable:

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard
3. Add to `server/.env`:
   ```bash
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
4. Images will upload to Cloudinary CDN

Without Cloudinary, image uploads will fail (but other features work).

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change PORT in server/.env
PORT=5001  # or any free port
```

### MongoDB Connection Error

```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Atlas connection string
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/findit
```

### Dependencies Install Failed

```bash
# Clear cache and try again
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### "Cannot find module" errors

```bash
# Make sure you're in correct directory
cd server
npm install

cd ../client
npm install

# Then try running again
```

### API calls return 401 (Unauthorized)

```bash
# Token expired, login again
# Or check VITE_API_URL in client/.env.development
```

---

## 📚 File Structure

```
FindIt/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── context/        # State management
│   │   ├── utils/          # Helper functions
│   │   └── main.jsx
│   └── package.json
│
├── server/                  # Express Backend
│   ├── routes/             # API endpoints
│   ├── models/             # MongoDB schemas
│   ├── middleware/         # Auth, upload
│   ├── server.js
│   ├── seed.js             # Demo data
│   └── package.json
│
└── package.json            # Root (run both servers)
```

---

## 🎯 Next Steps

1. ✅ Explore the app with demo accounts
2. ✅ Try reporting a lost/found item
3. ✅ Search and filter items
4. ✅ Test bookmarks
5. ✅ Check admin dashboard
6. ✅ Read PRODUCTION_README.md for deployment
7. ✅ Read DEPLOYMENT_GUIDE.md to go live

---

## 💡 Development Tips

- **Hot Reload:** Vite auto-refreshes on file save
- **Backend Reload:** Nodemon auto-restarts on changes
- **Dark Mode:** Toggle in navbar
- **Console Logs:** Both frontend and backend output to terminal
- **Database Browser:** Use MongoDB Compass for visual database management

---

## 🚀 You're Ready!

Everything is set up. Start coding! 

Questions? Check:
- PRODUCTION_README.md
- DEPLOYMENT_GUIDE.md
- API logs in terminal
- Browser developer console

**Happy coding! 🎉**
