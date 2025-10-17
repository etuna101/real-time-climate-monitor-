# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### ❌ Issue: 'react-scripts' is not recognized

**Error Message:**
```
'react-scripts' is not recognized as an internal or external command
```

**Cause:** Client dependencies haven't been installed yet.

**Solution:**
```bash
cd client
npm install
```

Wait for installation to complete (may take 2-5 minutes), then:
```bash
npm start
```

---

### ❌ Issue: MongoDB Connection Error

**Error Message:**
```
MongoDB connection error: connect ECONNREFUSED
```

**Cause:** MongoDB is not running locally.

**Solution:** This is **NORMAL**! The app works perfectly without MongoDB.
- The server will show a warning but continue running
- All API endpoints return mock data
- Everything functions as expected

**To fix (optional):**
1. Install MongoDB locally, OR
2. Use MongoDB Atlas (free cloud database), OR
3. Run: `docker-compose up mongodb`

---

### ❌ Issue: Port Already in Use

**Error Message:**
```
Port 5000 is already in use
```

**Solution:**
1. **Find and kill the process:**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   ```

2. **Or change the port:**
   - Edit `server/.env`
   - Change `PORT=5000` to `PORT=5001`

---

### ❌ Issue: Module Not Found

**Error Message:**
```
Cannot find module 'express'
Cannot find module 'react'
```

**Solution:**
```bash
# For server
cd server
npm install

# For client
cd client
npm install
```

---

### ❌ Issue: npm install fails

**Error Message:**
```
npm ERR! code ENOENT
```

**Solution:**
1. **Check Node.js version:**
   ```bash
   node --version  # Should be v14 or higher
   npm --version   # Should be v6 or higher
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

3. **Delete and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### ❌ Issue: Browser doesn't open automatically

**Solution:**
- Manually open: http://localhost:3000
- Check if the server started successfully
- Look for "Compiled successfully!" message

---

### ❌ Issue: API calls failing

**Error in browser console:**
```
Failed to fetch
Network Error
```

**Solution:**
1. **Check backend is running:**
   - Visit: http://localhost:5000/health
   - Should see: `{"status":"ok","timestamp":"..."}`

2. **Check CORS:**
   - Backend has CORS enabled
   - Frontend proxy is configured in `client/package.json`

3. **Restart both servers:**
   ```bash
   # Stop both (Ctrl+C)
   # Start backend first
   cd server && npm start
   # Then start frontend
   cd client && npm start
   ```

---

### ❌ Issue: Blank page in browser

**Solution:**
1. **Check browser console** (F12) for errors
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Check if build succeeded:**
   - Look for "Compiled successfully!" in terminal
4. **Try incognito/private mode**

---

### ❌ Issue: Styles not loading

**Solution:**
1. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache**
3. **Check Material-UI installation:**
   ```bash
   cd client
   npm list @mui/material
   ```

---

## Installation Checklist

Before running the app, ensure:

- [ ] Node.js v14+ installed
- [ ] npm v6+ installed
- [ ] Root dependencies installed: `npm install`
- [ ] Server dependencies installed: `cd server && npm install`
- [ ] Client dependencies installed: `cd client && npm install`

---

## Verification Steps

### 1. Check Backend
```bash
cd server
npm start
```
✅ Should see: "Server is running on port 5000"
✅ Visit: http://localhost:5000/health

### 2. Check Frontend
```bash
cd client
npm start
```
✅ Should see: "Compiled successfully!"
✅ Browser opens: http://localhost:3000

### 3. Check API Connection
- Open browser console (F12)
- Navigate to Dashboard page
- Should see API calls in Network tab
- No CORS errors

---

## Quick Fixes

### Reset Everything
```bash
# Stop all servers (Ctrl+C)

# Clean client
cd client
rm -rf node_modules package-lock.json
npm install

# Clean server
cd ../server
rm -rf node_modules package-lock.json
npm install

# Start fresh
cd ../server && npm start
# In new terminal:
cd ../client && npm start
```

### Check What's Running
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

---

## Still Having Issues?

1. **Check the documentation:**
   - FINAL_INSTRUCTIONS.md
   - START_HERE.md
   - README.md

2. **Verify file structure:**
   ```
   climate-dashboard/
   ├── client/
   │   ├── node_modules/  (should exist after npm install)
   │   ├── public/
   │   ├── src/
   │   └── package.json
   └── server/
       ├── node_modules/  (should exist after npm install)
       ├── controllers/
       ├── routes/
       └── server.js
   ```

3. **Check Node.js installation:**
   ```bash
   node --version
   npm --version
   ```

4. **Try the batch scripts:**
   - Double-click `start-server.bat`
   - Double-click `start-client.bat`

---

## Success Indicators

### Backend Running Successfully ✅
```
Server is running on port 5000
⚠️  MongoDB connection failed. Running in demo mode without database.
```

### Frontend Running Successfully ✅
```
Compiled successfully!

You can now view climate-dashboard-client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Application Working ✅
- Dashboard page loads
- Metrics cards display data
- Navigation works
- No console errors (except MongoDB warning)

---

## Need More Help?

- Review the complete documentation in FINAL_INSTRUCTIONS.md
- Check the project structure in PROJECT_SUMMARY.md
- All features are listed in PROGRESS.md

**Remember:** MongoDB connection error is normal and expected! The app works perfectly without it.
