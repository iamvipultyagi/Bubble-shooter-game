# 🎯 Bubble Shooter Game

A classic bubble shooter game built with React and Node.js. Match 3 or more bubbles of the same color to pop them and clear the screen!

## 🎮 How to Play

1. **Aim**: Move your mouse to aim the bubble shooter
2. **Shoot**: Click to launch a bubble
3. **Match**: Connect your bubble with 2+ bubbles of the same color
4. **Score**: Pop clusters of 3+ bubbles to earn points
5. **Strategy**: Create chain reactions by making unsupported bubbles fall

## 🚀 Quick Start

```bash
# Install and run frontend only
cd frontend
npm install
npm start
```

Visit http://localhost:3000 to play!

## 🛠️ Full Setup

See [SETUP.md](SETUP.md) for complete installation instructions including backend setup.

## 🎯 Game Features

- **Classic Gameplay**: Traditional bubble shooter mechanics
- **Scoring System**: Points for popping bubbles and chain reactions  
- **Leaderboard**: Track high scores
- **User System**: Registration and login (with backend)
- **Responsive Design**: Works on desktop and mobile

## 🎨 Screenshots

The game features a modern glass-morphism design with:
- Colorful bubble grid
- Smooth animations
- Intuitive aiming system
- Clean UI with score tracking

## 🏗️ Tech Stack

- **Frontend**: React, HTML5 Canvas, CSS3
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT tokens
- **Styling**: Custom CSS with glass-morphism effects

## 📁 Project Structure

```
bubble-shooter/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/    # Game components
│   │   ├── pages/         # Login/Register pages  
│   │   └── styles/        # CSS styles
├── backend/           # Node.js backend
│   ├── controllers/       # API controllers
│   ├── models/           # Database models
│   └── routes/           # API routes
└── README.md
```

## 🎯 Game Rules

- **Objective**: Clear all bubbles from the screen
- **Shooting**: Aim and click to shoot bubbles
- **Matching**: Connect 3+ same-colored bubbles to pop them
- **Falling**: Unsupported bubbles fall for bonus points
- **Game Over**: When bubbles reach the bottom

Enjoy playing! 🎉