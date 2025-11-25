const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        user_name: String,
        password_hash: String,
    },
    { timestamps: true }
);

module.exports = tutorialSchema;
