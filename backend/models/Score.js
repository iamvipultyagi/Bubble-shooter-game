const mongoose = require('mongoose');
const ScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  playerName: { type: String, default: 'Anonymous' },
  score: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Score', ScoreSchema);