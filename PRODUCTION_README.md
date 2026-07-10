# FindIt — Smart Campus Lost & Found Platform

A full-stack, production-ready web application for Presidency University students to report lost and found items with AI-powered matching, secure authentication, and real-time notifications.

**Live Demo:** [https://findit-client.vercel.app](https://findit-client.vercel.app)  
**API Documentation:** [https://findit-api.render.com/api/health](https://findit-api.render.com/api/health)

---

## 🎯 Features

### Core Functionality
- **Report Items** — Multi-step forms for lost and found items with image uploads
- **Smart Search** — Full-text search with filters by category, type, location, and status
- **AI Matching** — Automatic matching of lost and found items based on category and description
- **Bookmarks** — Save favorite items for later reference
- **Notifications** — Real-time notifications for matches and status updates
- **Profile Management** — User profiles with statistics and item history

### For Administrators
- **Dashboard** — Approve/reject pending item reports
- **User Management** — View and manage platform users
- **Analytics** — Item statistics and platform metrics
- **Role-Based Access** — Secure admin-only routes and operations

### Security & Performance
- **JWT Authentication** — Secure token-based authentication
- **Password Hashing** — bcrypt encryption for all passwords
- **CORS Protection** — Cross-Origin Resource Sharing configured
- **Rate Limiting** — Protection against brute force attacks
- **Image Optimization** — Cloudinary CDN for fast image delivery
- **Responsive Design** — Mobile-first design with dark mode support

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with Vite for fast development
- React Router for client-side navigation
- TailwindCSS for responsive styling
- Framer Motion for animations
- Axios for API communication
- React Context API for state management

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Cloudinary for image storage
- Multer for file uploads

**Deployment:**
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)
- Cloudinary (Image Storage)

### Project Structure

```
FindIt/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # State management
│   │   ├── utils/         # Helper functions
│   │   ├── data/          # Constants and mock data
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                # Express API
│   ├── routes/           # API route handlers
│   ├── models/           # MongoDB schemas
│   ├── middleware/       # Auth & upload middleware
│   ├── server.js
│   ├── seed.js          # Database seeding
│   └── package.json
│
├── README.md
├── vercel.json          # Vercel deployment config
└── render.yaml          # Render deployment config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier available)

### Local Development Setup

#### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone https://github.com/yourusername/findit.git
cd findit

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

#### 2. Configure Environment Variables

**Backend (`server/.env`):**
```bash
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/findit
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Frontend (`client/.env.development`):**
```bash
VITE_API_URL=http://localhost:5000/api
```

#### 3. Seed Demo Data

```bash
cd server
npm run seed
```

This creates demo accounts:
- **Admin:** `admin@findit.local` / `Admin@123`
- **Student:** `student@presidencyuniversity.in` / `Student@123`

#### 4. Start Development Servers

**Terminal 1 — Backend API:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Access the application at `http://localhost:5173`

---

## 🔐 Demo Accounts

### Admin Access
- **Email:** `admin@findit.local`
- **Password:** `Admin@123`
- **Features:** User management, item verification, analytics

### Student Access
- **Email:** `student@presidencyuniversity.in`
- **Password:** `Student@123`
- **Features:** Report items, bookmark, search, profile

---

## 📚 API Documentation

### Authentication

#### POST `/api/auth/signup`
Register a new account
```json
{
  "name": "John Doe",
  "email": "john@presidency.edu",
  "password": "SecurePass123",
  "phone": "+91 98765 43210",
  "department": "Computer Science",
  "year": "3",
  "rollNo": "21CS1234"
}
```

#### POST `/api/auth/login`
Login to account
```json
{
  "email": "john@presidency.edu",
  "password": "SecurePass123"
}
```

#### GET `/api/auth/me`
Get current user profile (requires token)

### Items

#### GET `/api/items`
List all items with filters
```bash
Query parameters:
- type: 'lost' | 'found'
- category: 'student-id' | 'wallet' | 'electronics' | 'mobile' | etc.
- status: 'lost' | 'found' | 'returned'
- q: search query
- sort: 'newest' | 'oldest' | 'views'
- page: 1, 2, 3...
- limit: 20 (default)
```

#### POST `/api/items`
Create a new item report (requires token)
```json
{
  "type": "lost",
  "title": "Blue Airpods Pro",
  "category": "earphones",
  "description": "Lost near cafeteria with small scratch",
  "location": "Engineering Block",
  "date": "2024-01-15",
  "time": "14:30",
  "reward": "₹500",
  "images": [{"url": "https://...", "publicId": "..."}]
}
```

#### GET `/api/items/:id`
Get item details and increment views

#### POST `/api/items/:id/bookmark`
Toggle bookmark for an item (requires token)

#### GET `/api/items/user/bookmarks`
Get all bookmarked items (requires token)

#### GET `/api/items/:id/matches`
Get AI-matched items for an item

### Notifications

#### GET `/api/notifications`
Get user notifications (requires token)

#### PUT `/api/notifications/:id/read`
Mark notification as read (requires token)

#### PUT `/api/notifications/read/all`
Mark all notifications as read (requires token)

### Users

#### GET `/api/users/profile`
Get user profile (requires token)

#### PUT `/api/users/profile`
Update user profile (requires token)

#### GET `/api/users`
List all users (admin only)

#### GET `/api/users/dashboard`
Get user dashboard statistics (requires token)

---

## 🛠️ Development

### Project Scripts

**Frontend:**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

**Backend:**
```bash
npm run dev        # Start with nodemon
npm start          # Start production server
npm run seed       # Seed database with demo data
```

### Adding New Features

1. **Create API endpoint** in `server/routes/`
2. **Add Mongoose schema** if needed in `server/models/`
3. **Add frontend component** in `client/src/components/`
4. **Connect in context** or component hooks
5. **Test in browser** with dev servers running

### Component Structure

```jsx
// Reusable component example
export const ItemCard = ({ item, onBookmark }) => {
  const { isBookmarked, toggleBookmark } = useApp();
  
  return (
    <div className="card">
      {/* Content */}
      <button onClick={() => toggleBookmark(item._id)}>
        {isBookmarked(item._id) ? '❤️' : '🤍'}
      </button>
    </div>
  );
};
```

---

## 📦 Deployment

### Deploy Backend to Render

1. **Create Render account** at [render.com](https://render.com)
2. **Connect GitHub repository**
3. **Create new Web Service** with:
   - Build command: `cd server && npm install`
   - Start command: `cd server && npm start`
   - Environment variables (see `.env.example`)
4. **Deploy MongoDB Atlas** database connection string
5. **Set up Cloudinary** credentials

### Deploy Frontend to Vercel

1. **Create Vercel account** at [vercel.com](https://vercel.com)
2. **Import repository** from GitHub
3. **Configure build settings:**
   - Build command: `cd client && npm run build`
   - Output directory: `client/dist`
4. **Set environment variable:**
   - `VITE_API_URL`: Your Render backend URL
5. **Deploy** — automatic on push to main

### Database Setup (MongoDB Atlas)

1. Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/findit`
4. Add to Render environment variables as `MONGO_URI`

### Image Upload Setup (Cloudinary)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard
3. Add to Render environment variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can sign up with new account
- [ ] User can login with credentials
- [ ] User can report lost item with image upload
- [ ] User can report found item
- [ ] Search filters work correctly
- [ ] Bookmarks toggle on/off
- [ ] Notifications appear on match
- [ ] Admin can approve/reject items
- [ ] Dark mode toggles properly
- [ ] Responsive on mobile (hamburger menu)

### Browser Testing

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```bash
# Check MongoDB is running
sudo service mongod status

# Or use MongoDB Atlas connection string
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/findit
```

**Cloudinary Upload Fails**
- Verify API credentials are correct
- Check file size < 5MB
- Ensure image format is JPEG/PNG/WebP

**JWT Token Expired**
- Clear localStorage and login again
- Token expires in 30 days
- Frontend automatically handles token refresh

### Frontend Issues

**CORS Error**
- Backend CORS origin must match CLIENT_URL
- Check `.env` files match

**API Calls Fail**
- Verify backend is running on correct port
- Check VITE_API_URL in `.env.development`

**Images Not Loading**
- Check Cloudinary credentials
- Verify image URLs are correct
- Check browser console for errors

---

## 📋 Requirements Met

✅ **Full Backend Implementation**
- ✅ MongoDB models for User, Item, Notification
- ✅ Express.js REST API with CRUD operations
- ✅ JWT authentication with bcrypt hashing
- ✅ Cloudinary image upload integration
- ✅ Role-based admin access control
- ✅ Search, filters, and pagination

✅ **Frontend Implementation**
- ✅ React components with reusable patterns
- ✅ Real API integration (no mock data)
- ✅ Loading and error states
- ✅ Responsive design with dark mode
- ✅ User authentication flows
- ✅ Item CRUD operations
- ✅ Bookmarks and notifications

✅ **Production Ready**
- ✅ Environment configuration
- ✅ Error handling throughout
- ✅ Security best practices
- ✅ Deployment configurations
- ✅ Database seeding with demo accounts
- ✅ Comprehensive documentation

---

## 📄 License

MIT License — feel free to use this project for your portfolio

---

## 👨‍💻 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review API logs in Render dashboard

---

**Built with ❤️ by the FindIt Team**
