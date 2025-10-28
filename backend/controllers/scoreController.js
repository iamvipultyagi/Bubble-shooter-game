const Score = require('../models/Score');
const User = require('../models/User');

exports.addScore = async (req, res) => {
  try {
    const { score, level, playerName } = req.body;
    const userId = req.user?.id;
    
    const newScore = new Score({ 
      user: userId, 
      playerName: playerName || 'Anonymous', 
      score, 
      level 
    });
    
    await newScore.save();
    res.json(newScore);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const top = await Score.find()
      .sort({ score: -1 })
      .limit(10)
      .select('playerName score level createdAt');
    res.json(top);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};