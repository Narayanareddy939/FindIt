# 🎓 FindIt — Smart Campus Lost & Found Platform

A **production-ready**, full-stack web application for Presidency University students to report, search, and recover lost and found items with AI-powered matching and real-time notifications.

**Status:** ✅ Ready for Production  
**Tech Stack:** React + Vite + Node.js + MongoDB + TailwindCSS  
**Deployment:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas + Cloudinary

---

## 🚀 Quick Start

### 5-Minute Local Setup
```bash
# Clone and setup (installs dependencies + seeds demo data)
npm run setup

# Start both servers
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** and login with demo account:
- **Email:** `student@presidencyuniversity.in`
- **Password:** `Student@123`

📖 **Full setup guide:** See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

---

## 📋 Features

### For Students
- ✅ **Report Items** — Multi-step forms with image uploads for lost/found items
- ✅ **Smart Search** — Full-text search with filters (category, type, location, status)
- ✅ **AI Matching** — Automatic matching of lost ↔ found items
- ✅ **Bookmarks** — Save favorite items for later
- ✅ **Notifications** — Real-time match alerts and status updates
- ✅ **Profile** — Manage account and view item history
- ✅ **Dark Mode** — Eye-friendly interface

### For Administrators
- ✅ **Dashboard** — Approve/reject pending reports
- ✅ **User Management** — View and manage platform users
- ✅ **Analytics** — Item statistics and platform metrics
- ✅ **Role-Based Access** — Secure admin-only operations

### Technical
- ✅ **JWT Authentication** — Secure token-based auth
- ✅ **Image Uploads** — Cloudinary CDN integration
- ✅ **Responsive Design** — Works on desktop, tablet, mobile
- ✅ **Error Handling** — Comprehensive error states
- ✅ **Loading States** — Smooth UX with spinners
- ✅ **Accessible** — WCAG compliant components

---

## 📊 Project Structure

```
FindIt/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── cards/              # ItemCard, StatCard
│   │   │   ├── common/             # PageWrapper, ProtectedRoute
│   │   │   └── layout/             # Navbar, Footer
│   │   ├── pages/                  # Page components (Home, Login, etc)
│   │   ├── context/                # React Context (Auth, Theme, App)
│   │   ├── utils/                  # Helpers (date, validation, etc)
│   │   ├── data/                   # Constants and mock data
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/                          # Express.js Backend
│   ├── routes/                     # API endpoints
│   │   ├── auth.js                # Login, signup, authentication
│   │   ├── items.js               # CRUD for lost/found items
│   │   ├── users.js               # User profiles and management
│   │   └── notifications.js       # Notifications system
│   ├── models/                     # MongoDB schemas
│   │   ├── User.js
│   │   ├── Item.js
│   │   └── Notification.js
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── upload.js              # Cloudinary multer setup
│   ├── server.js                  # Express app setup
│   ├── seed.js                    # Database seeding
│   └── .env.example
│
├── PRODUCTION_README.md            # Comprehensive documentation
├── SETUP_INSTRUCTIONS.md           # Quick local setup guide
├── DEPLOYMENT_GUIDE.md             # Production deployment steps
└── package.json                    # Root scripts (dev, build, setup)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite | Fast, modern UI framework |
| **Styling** | TailwindCSS | Utility-first CSS |
| **Animations** | Framer Motion | Smooth transitions |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB + Mongoose | NoSQL database with ODM |
| **Auth** | JWT + bcrypt | Secure authentication |
| **Images** | Cloudinary | CDN image hosting |
| **Deployment** | Vercel + Render | Serverless hosting |

---

## 🔐 Demo Accounts

### Admin Account
- **Email:** `admin@findit.local`
- **Password:** `Admin@123`
- **Access:** Admin dashboard, user management

### Student Account  
- **Email:** `student@presidencyuniversity.in`
- **Password:** `Student@123`
- **Access:** Full student features

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | Get started in 5 minutes locally |
| [PRODUCTION_README.md](PRODUCTION_README.md) | Comprehensive feature & architecture docs |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Deploy to Vercel, Render, MongoDB Atlas |

---

## 🚀 Commands

```bash
# Development
npm run dev              # Start both servers (frontend + backend)
npm run dev:client      # Start React dev server only
npm run dev:server      # Start Express dev server only

# Production
npm run build           # Build React for production

# Database
npm run seed            # Seed demo accounts and items
npm run setup           # Full setup: install deps + seed

# One-time
npm run install:all     # Install all dependencies
```

---

## 🌐 Live Demo (Production)

- **Frontend:** [https://findit.vercel.app](https://findit.vercel.app)
- **API:** [https://findit-api.render.com](https://findit-api.render.com)

---

## 📱 Features Walkthrough

### 1. Home Page
- Hero section with call-to-action
- "How It Works" explanation
- Recent items grid
- FAQ with accordion
- Testimonials from students

### 2. Report Item (Multi-step)
- **Step 1:** Item details (name, category, description)
- **Step 2:** Location & date
- **Step 3:** Contact information & reward
- **Step 4:** Photo upload & review
- AI-powered description enhancement
- Automatic category detection

### 3. Search & Browse
- Full-text search across title, description, location
- Filters: Type (lost/found), Category, Status
- Sorting: Newest, oldest, most viewed
- Pagination: 20 items per page
- Item cards with images, badges, reporter info

### 4. Item Details
- Large image gallery
- Complete item information
- AI-suggested matches
- Bookmark toggle
- Contact reporter button
- QR code generation

### 5. Dashboard
- User statistics
- Recent notifications
- My lost items tab
- My found items tab
- Recovered items tab

### 6. Admin Panel
- Pending approvals (verify reports)
- All items management
- User list
- Platform analytics

---

## 🔒 Security Features

- **JWT Tokens** — Secure session management with 30-day expiry
- **Password Hashing** — bcrypt with salt rounds for security
- **CORS Protection** — Cross-origin requests validated
- **Protected Routes** — Authentication required for sensitive operations
- **Role-Based Access** — Admin operations restricted
- **Input Validation** — Server-side validation for all inputs
- **Error Handling** — No sensitive data in error messages

---

## 📊 Database Schema

### User Model
```javascript
{
  name, email, password (hashed), phone, rollNo, department, year,
  avatar, role (student/faculty/admin), isVerified,
  stats: {lostReported, foundReported, recovered, helped},
  bookmarks: [Item IDs],
  timestamps
}
```

### Item Model
```javascript
{
  type (lost/found), title, category, description,
  location, date, time, images [{url, publicId}],
  reporter (User ID), status, verified, reward, views,
  matchScore, matchItem, contact info, timestamps
}
```

### Notification Model
```javascript
{
  user (User ID), type (match/status_update/etc),
  title, message, relatedItem (Item ID),
  read (boolean), actionUrl, timestamps
}
```

---

## 🧪 Testing Checklist

- [ ] Login with both accounts works
- [ ] Can report lost item with images
- [ ] Can report found item
- [ ] Search filters work
- [ ] Bookmarks toggle properly
- [ ] Notifications appear
- [ ] Dark mode toggles
- [ ] Admin dashboard accessible with admin account
- [ ] Items display on mobile
- [ ] Responsive hamburger menu works

---

## 🚢 Deployment

### Local Production Build
```bash
npm run build
npm start  # in server
```

### Deploy to Production

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete steps:**

1. Set up MongoDB Atlas cluster
2. Create Cloudinary account
3. Deploy backend to Render
4. Deploy frontend to Vercel
5. Configure environment variables
6. Seed production database

---

## 🐛 Troubleshooting

### Common Issues

**"Cannot connect to MongoDB"**
- Ensure MongoDB is running locally or use MongoDB Atlas connection string

**"Image uploads fail"**
- Verify Cloudinary credentials in `.env`
- Check file size < 5MB

**"CORS error when calling API"**
- Backend `CLIENT_URL` must match frontend URL
- Check `.env` files match between client and server

**See [PRODUCTION_README.md](PRODUCTION_README.md#troubleshooting) for more solutions**

---

## 📈 Performance

- **Vite Build:** < 1s hot reload during development
- **Cloudinary CDN:** Automatic image optimization
- **MongoDB Indexing:** Optimized for common queries
- **Code Splitting:** Automatic via Vite
- **Caching:** Browser caches static assets

---

## 🎯 Project Goals Met

✅ Full-stack application with React frontend and Node.js backend  
✅ MongoDB database with proper schemas and relationships  
✅ JWT authentication with password hashing  
✅ CRUD operations for all resources  
✅ Image uploads via Cloudinary  
✅ Search, filters, and pagination  
✅ Role-based admin access  
✅ Responsive design with dark mode  
✅ Loading and error states  
✅ Production-ready deployment configs  
✅ Comprehensive documentation  
✅ Demo accounts for testing  

---

## 📞 Support

- 📖 Check [PRODUCTION_README.md](PRODUCTION_README.md) for detailed docs
- 🚀 Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) to deploy
- ⚡ Use [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for quick start
- 🐛 Check browser console and terminal logs for errors

---

## 📄 License

MIT License — Free to use for personal and commercial projects

---

## 👨‍💻 Built With

- **React Team** for React.js
- **Vite** for blazing fast builds
- **Tailwind Labs** for TailwindCSS
- **MongoDB** for database
- **Cloudinary** for image hosting
- **Vercel** & **Render** for deployment

---

**Status:** ✅ Production Ready | Deployment Ready | MIT Licensed

**Last Updated:** 2026-01-15
