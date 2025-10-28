# Bubble Shooter Game Setup

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (optional - game works without database)

## Installation

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

## Running the Game

### Option 1: Frontend Only (Recommended for quick start)
```bash
cd frontend
npm start
```
The game will run on http://localhost:3000 with mock data for leaderboard.

### Option 2: Full Stack (with database)
1. Start MongoDB (if you have it installed)
2. Start the backend:
```bash
cd backend
npm start
```
3. Start the frontend:
```bash
cd frontend
npm start
```

## Game Features
- Classic bubble shooter gameplay
- Match 3+ bubbles to pop them
- Score tracking
- Leaderboard system
- User registration/login (when backend is running)

## Controls
- Move mouse to aim
- Click to shoot bubbles
- Match 3 or more bubbles of the same color to pop them

## Troubleshooting
- If you get dependency errors, try deleting node_modules and running `npm install` again
- The game works without the backend - leaderboard will show mock data
- Make sure ports 3000 (frontend) and 5000 (backend) are available