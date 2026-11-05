# FindIt — Quick Setup Guide

Get FindIt running locally in 5 minutes!

---

## 🚀 Local Setup

```bash
npm run install:all
```

This installs root, frontend, and backend dependencies. It does not seed or
modify your database.

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

From the `server` folder, run this PowerShell script:

```powershell
.\setup-local-env.ps1
```

It securely prompts for the rotated Atlas database password, URL-encodes it,
targets the existing `findit` database, generates a random JWT secret, and
writes `server/.env` without displaying credential values. It can also prompt
for rotated Cloudinary credentials if image uploads are needed. Do not enter
Gemini or Google OAuth settings; this application does not currently use them.
If you have an existing `.env` to replace, run `.\setup-local-env.ps1 -Force`.
Never commit `server/.env` or send its contents in chat. If Atlas refuses the
connection, allow your laptop's IP in Atlas Network Access. The backend does
not use local or in-memory MongoDB.

Copy `client/.env.development.example` to `client/.env.development`. Its local
API setting should be:

```env
VITE_API_URL=http://localhost:5000/api
```

Cloudinary is optional for other features. To enable image uploads, set
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in
`server/.env`.

### Step 3: Start Development Servers

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

### Step 4: Open in Browser

```
http://localhost:5173
```

Create an account using an `@presidencyuniversity.in` address, or sign in with
an account that already exists in your Atlas database. Setup does not create
demo users or items.

---

No demo users or sample records are created by setup. Existing Atlas data is
left untouched; an admin dashboard requires an existing account with the
`admin` role.

---

## ✅ Verify Setup Works

After starting servers, check:

1. **Frontend loads:** [http://localhost:5173](http://localhost:5173)
2. **Backend health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
3. **Can login:** Use an account that already exists in Atlas
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

# Build for production
npm run build

# Install all dependencies; no database seed runs
npm run setup
```

---

## 🗄️ Database (MongoDB)

### Existing MongoDB Atlas Cluster

Do not install or start local MongoDB; the backend requires the Atlas URI.

### Atlas connection details

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Select your existing cluster and get its connection string.
3. Store the connection string in `server/.env` as `MONGO_URI`.

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

### MongoDB Atlas Connection Error

Check `MONGO_URI` in `server/.env` and confirm Atlas Network Access allows this
laptop.

### Dependencies Install Failed

From the project folder, run `npm run install:all` without deleting lockfiles.

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

1. Register or sign in with an account in your Atlas database.
2. Test lost/found reporting, search, bookmarks, and notifications.
3. Check the admin dashboard with an existing admin account.
4. Review the deployment guides only after local verification.

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
