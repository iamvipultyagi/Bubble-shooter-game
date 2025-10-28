import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import GameCanvas from './components/GameCanvas';
import ScoreBoard from './components/ScoreBoard';


export default function App() {
return (
<div className="app-root">
<nav className="top-nav">
<Link to="/">Game</Link>
<Link to="/leaderboard">Leaderboard</Link>
<Link to="/login">Login</Link>
</nav>
<Routes>
<Route path="/" element={<GameCanvas />} />
<Route path="/leaderboard" element={<ScoreBoard />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
</Routes>
</div>
);
}