const express = require('express');
const Score = require('../Models/Score');

const router = express.Router();

router.post('/submit', async (req, res) => {
    try {
        const { username, score } = req.body;
        const newScore = new Score({ username, score });
        await newScore.save();
        res.status(201).send('Score submitted');
    } catch (err) {
        res.status(500).send('Error submitting score');
    }
});

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const scores = await Score.find({ username }).sort({ date: -1 });
        res.json(scores);
    } catch (err) {
        res.status(500).send('Error fetching scores');
    }
});

module.exports = router;
