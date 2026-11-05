# FindIt — Deployment Guide

Complete step-by-step guide to deploy FindIt to production on Vercel, Render, and MongoDB Atlas.

---

## Prerequisites

- GitHub account with the FindIt repository
- Vercel account (free tier available)
- Render account (free tier available)
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

---

## Phase 1: Set Up MongoDB Atlas (Database)

### 1.1 Optional: Create a New MongoDB Atlas Cluster

If you already have an Atlas cluster and FindIt data, skip the new-cluster instructions below. Keep using the existing database, and set its private connection URI as `MONGO_URI` in Render. The database name in that URI must match the database containing your collections.

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project named "FindIt"
4. Create a free M0 cluster (or choose your plan)
5. Configure security:
   - Add your IP address to IP Whitelist (or allow all 0.0.0.0)
   - Create database user:
     - Username: `findituser`
     - Password: `GenerateStrongPassword!`
6. Get connection string:
   - Click "Connect"
   - Select "Connect your application"
   - Copy connection string: `mongodb+srv://findituser:password@cluster.mongodb.net/findit`
   - Replace `<password>` with your actual password
   - Keep this for later ✅

### 1.2 Preserve Existing Data

Do not run `npm run seed` or `npm run setup` against your existing Atlas database. The demo seed utility deletes all users, items, and notifications before creating demo records. It now requires an explicit destructive opt-in and is only for disposable databases.

---

## Phase 2: Set Up Cloudinary (Image Storage)

### 2.1 Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard and copy:
   - Cloud Name ✅
   - API Key ✅
   - API Secret ✅ (keep this secret!)

---

## Phase 3: Deploy Backend to Render

### 3.1 Prepare Backend

Set production environment variables in Render only. Do not create or commit a production `.env` file.

### 3.2 Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your FindIt repository
5. Configure:
   - **Name:** `findit-api`
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Plan:** Free (or choose paid)

6. Add environment variables:
   - `MONGO_URI`: The private Atlas URI for the database containing your existing data
   - `JWT_SECRET`: A newly generated random secret (at least 32 characters)
   - `CLOUDINARY_CLOUD_NAME`: From Cloudinary
   - `CLOUDINARY_API_KEY`: From Cloudinary
   - `CLOUDINARY_API_SECRET`: From Cloudinary
   - `CLIENT_URL`: Your deployed Vercel frontend URL (update after frontend deployment)

7. Click "Create Web Service" and wait for deployment ⏳

8. Once deployed, copy your URL:
   - Format: `https://findit-api.onrender.com`
   - Add to Render environment: `API_URL`

Do not seed the production database. The API now starts without inserting or modifying user, item, or notification records.

---

## Phase 4: Deploy Frontend to Vercel

### 4.1 Prepare Frontend

1. Set `VITE_API_URL` in Vercel to your Render service URL followed by `/api` (for example, `https://findit-api.onrender.com/api`).

2. Push to GitHub:
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

### 4.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Import Project"
4. Select FindIt repository
5. Keep the **Root Directory** at the repository root. The root `vercel.json` builds `client` and publishes `client/dist`.

6. Add Environment Variables:
   - `VITE_API_URL`: Your Render service URL followed by `/api`

7. Click "Deploy" and wait ⏳

8. Once deployed, copy your frontend URL:
   - Use the assigned deployment URL and set it as Render's `CLIENT_URL`

---

## Phase 5: Update Backend Client URL

### 5.1 Update Render Environment

1. Go to Render dashboard
2. Select `findit-api` service
3. Click "Environment"
4. Update `CLIENT_URL` to your exact Vercel deployment URL
5. Service automatically redeploys ✅

---

## Phase 6: Test Production

### 6.1 Verify Deployment

1. Open your Vercel deployment URL.
2. Test login with an existing user account from your Atlas database.
3. Verify:
   - ✅ Login works
   - ✅ Dashboard loads
   - ✅ Items display
   - ✅ Search works
   - ✅ Image uploads work (report form)
   - ✅ Notifications load
   - ✅ Bookmarks toggle

### 6.2 Check Logs

**Render Backend Logs:**
```
Render Dashboard → findit-api → Logs
```

**Vercel Frontend Logs:**
```
Vercel Dashboard → findit-client → Deployments → View Logs
```

---

## Phase 7: Configure Custom Domain (Optional)

### 7.1 Vercel Custom Domain

1. Vercel Dashboard → findit-client → Settings → Domains
2. Add your domain
3. Update DNS records with Vercel's instructions
4. Wait for DNS propagation (usually 24h)

### 7.2 Render Custom Domain

1. Render Dashboard → findit-api → Settings → Custom Domains
2. Add your domain
3. Update DNS records
4. Wait for SSL certificate generation

---

## Phase 8: Set Up CI/CD (Automatic Deployments)

### 8.1 GitHub Integration (Already Configured!)

Both Vercel and Render automatically:
- ✅ Detect pushes to `main` branch
- ✅ Run builds
- ✅ Deploy on success
- ✅ Rollback on failure

### 8.2 Manual Redeployment

**Render:**
- Dashboard → Service → Manual Deploy

**Vercel:**
- Dashboard → Deployments → Redeploy

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check backend health
curl https://findit-api.onrender.com/api/health

# Should return:
# {"status":"ok","service":"FindIt API","version":"1.0.0","timestamp":"..."}
```

### Logs

**Backend (Render):**
- Real-time logs in dashboard
- Logs section shows errors and warnings

**Frontend (Vercel):**
- Deploy logs show build issues
- Browser console shows runtime errors

### Performance

- Render free tier auto-sleeps after 15 min inactivity
- Vercel free tier has generous quotas
- MongoDB Atlas free tier has 512MB storage

### Scaling

When you outgrow free tier:
1. **Render:** Upgrade to standard plan ($7/month)
2. **Vercel:** Pro plan ($20/month)
3. **MongoDB:** M2 or higher ($57/month)
4. **Cloudinary:** Premium plan as needed

---

## Troubleshooting

### Backend won't start

1. Check environment variables in Render
2. Verify MongoDB connection string
3. Check Render logs for errors
4. Try manual redeploy

### CORS errors

1. Verify `CLIENT_URL` in backend matches frontend URL
2. Check `origin` setting in `server/server.js`

### Images not uploading

1. Verify Cloudinary credentials are correct
2. Check file size < 5MB
3. Check browser console for errors
4. Verify Cloudinary API keys are active

### MongoDB connection times out

1. Whitelist IP 0.0.0.0 in MongoDB Atlas
2. Or whitelist Render's static IPs
3. Check connection string format

### Seed fails

1. Ensure MongoDB is running
2. Check MongoDB connection string
3. Manually seed using Render dashboard
4. Or seed locally then migrate database

---

## Security Checklist

- ✅ Change `JWT_SECRET` to strong random value
- ✅ Enable MongoDB IP whitelist (or allow all)
- ✅ Use HTTPS everywhere (automatic on Vercel/Render)
- ✅ Never commit `.env` files
- ✅ Rotate API keys regularly
- ✅ Use strong passwords for all accounts
- ✅ Enable 2FA on GitHub, Vercel, Render, MongoDB

---

## Performance Optimization

1. **Images:** Cloudinary CDN automatically optimizes
2. **Database:** Add indexes for frequently queried fields
3. **Frontend:** Vite build is already optimized
4. **Caching:** Vercel caches static assets
5. **API:** Consider Redis caching for MongoDB queries

---

## Cost Estimate (Free Tier)

- **Vercel:** Free ($0/month)
- **Render:** Free with limitations ($0/month)
- **MongoDB Atlas:** Free 512MB ($0/month)
- **Cloudinary:** Free 25GB storage ($0/month)

**Total: $0/month** ✨

When scaling:
- Professional tier: $50-200/month

---

## Next Steps After Deployment

1. ✅ Test all features in production
2. ✅ Set up error monitoring (Sentry.io)
3. ✅ Configure analytics (Google Analytics)
4. ✅ Add CI/CD tests (GitHub Actions)
5. ✅ Document API (Swagger/OpenAPI)
6. ✅ Backup database regularly
7. ✅ Monitor application logs

---

## Support & Issues

If deployment fails:

1. Check Render/Vercel logs for specific errors
2. Verify all environment variables are set
3. Test backend API with Postman
4. Check MongoDB Atlas connection
5. Open GitHub issues for help

---

**Congratulations! FindIt is now in production! 🎉**

For updates, just push to GitHub and automatic deployments happen!
