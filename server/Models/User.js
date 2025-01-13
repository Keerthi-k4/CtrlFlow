const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Create User Schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    highestPracticeWpm: {
        type: Number,
        default: 0
    },
    practiceAccuracy: {
        type: Number,
        default: 0
    },
    highestTurboRounds: {
        type: Number,
        default: 0
    },
    turboWpm: {
        type: Number,
        default: 0
    }
});

// Pre-save hook to hash passwords
UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
