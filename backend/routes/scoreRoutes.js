const express = require('express');
const router = express.Router();
const { addScore, getLeaderboard } = require('../controllers/scoreController');

router.post('/add', addScore);
router.get('/', getLeaderboard);
router.get('/leaderboard', getLeaderboard);

module.exports = router;