# Setup Guide for Climate Dashboard

## Quick Start (Without Database)

The application can run in demo mode without MongoDB. All API endpoints will return mock data.

1. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

3. **In a new terminal, install client dependencies:**
   ```bash
   cd client
   npm install
   ```

4. **Start the frontend:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## MongoDB Setup Options

### Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier M0)
4. Click "Connect" and choose "Connect your application"
5. Copy the connection string
6. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/climate-dashboard?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB will start automatically as a Windows service
4. Keep the default connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/climate-dashboard
   ```

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:5.0
```

Or use the provided docker-compose:
```bash
docker-compose up mongodb
```

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/climate-dashboard
NODE_ENV=development

# Optional API Keys (for real data integration)
OPENAI_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
JWT_SECRET=your_secret_here
```

## Troubleshooting

### MongoDB Connection Error
- **Error:** `ECONNREFUSED 127.0.0.1:27017`
- **Solution:** The app will run in demo mode. To fix:
  - Ensure MongoDB is installed and running
  - Or use MongoDB Atlas (cloud option)
  - Or run `docker-compose up mongodb`

### Module Not Found Errors
- **Solution:** Install dependencies in the correct directories:
  ```bash
  # Root directory
  npm install
  
  # Server directory
  cd server
  npm install
  
  # Client directory
  cd ../client
  npm install
  ```

### Port Already in Use
- **Error:** `Port 5000 is already in use`
- **Solution:** Change the PORT in `server/.env` or kill the process using port 5000

## Running with Docker

```bash
# Start all services (MongoDB + Backend)
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

## Development Workflow

1. **Backend only:**
   ```bash
   cd server
   npm run dev
   ```

2. **Frontend only:**
   ```bash
   cd client
   npm start
   ```

3. **Both (from root directory):**
   ```bash
   npm run dev
   ```

## API Testing

Test the backend API:
```bash
# Health check
curl http://localhost:5000/health

# Get global climate data
curl http://localhost:5000/api/climate/global

# Get AI insights
curl http://localhost:5000/api/ai/insights
```

## Next Steps

1. ✅ Backend server is ready
2. 🔄 Frontend React app is being created
3. 📊 Add data visualization components
4. 🎨 Implement the UI design
5. 🤖 Integrate AI features
6. 🚀 Deploy to production
