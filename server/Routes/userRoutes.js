const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const config = require('config');
const auth = require('../middleware/auth');

router.post('/submit-practice', async (req, res) => {
    try {
        const { username,accuracy, wpm } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('wpm is ' , wpm)
        console.log('in db is ',user.highestPracticeWpm)
        if (wpm > user.highestPracticeWpm) {
            user.highestPracticeWpm = wpm;
            user.practiceAccuracy = accuracy;
            await user.save();
        }

        res.status(200).json({ highScore: user.highestPracticeWpm });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to save WPM' });
    }
});

// Route to update highest rounds
router.post('/submit-turbo', async (req, res) => {
    try {
        const { username,rounds, wpm } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(rounds,wpm)
        if (rounds > user.highestTurboRounds) {
            user.highestTurboRounds = rounds;
            user.turboWpm = wpm;
            await user.save();
        }

        res.status(200).json({ highScore: user.highestTurboRounds });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to save rounds/WPM' });
    }
});
router.get('/profile', async (req, res) => {
    try {
        console.log('Received username:', req.query.username); // Log the received username
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ message: 'Username not provided' });
        }

        const user = await User.findOne({ username }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).send('Server error');
    }
});

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user
        user = new User({
            username,
            email,
            password
        });

        // Save user
        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            'secret', // replace with a secure key in production
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
                username:user.username
            }
        };

        jwt.sign(
            payload,
            'secret', // replace with a secure key in production
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token,
                    username: user.username // Include username in the response

                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
