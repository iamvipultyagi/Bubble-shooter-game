import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScoreBoard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/scores');
      setScores(response.data);
    } catch (error) {
      console.error('Error fetching scores:', error);
      // Set mock data if backend is not available
      setScores([
        { _id: '1', playerName: 'Player 1', score: 1500 },
        { _id: '2', playerName: 'Player 2', score: 1200 },
        { _id: '3', playerName: 'Player 3', score: 1000 },
        { _id: '4', playerName: 'Player 4', score: 800 },
        { _id: '5', playerName: 'Player 5', score: 600 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="scoreboard-container">
        <h1 className="scoreboard-title">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="scoreboard-container">
      <h1 className="scoreboard-title">🏆 Leaderboard</h1>
      
      <div className="score-list">
        {scores.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
            No scores yet. Be the first to play!
          </p>
        ) : (
          scores.map((score, index) => (
            <div key={score._id} className="score-item">
              <div className="score-rank">#{index + 1}</div>
              <div className="score-name">{score.playerName || 'Anonymous'}</div>
              <div className="score-points">{score.score} pts</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScoreBoard;