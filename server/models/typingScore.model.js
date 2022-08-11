const mongoose = require('mongoose')

const TypingScoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Must have a name!"],
        minlength: [1, "Name must be at least 1 characters long."]
    },
    wpm: {
        type: Number,
        required: [true, "Must post a score"]
    },
    accuracy: {
        type: Number,
        required: [true, "Must choose post accuracy"]
    }
})

const TypingScore = mongoose.model("TypingScore", TypingScoreSchema);

module.exports = TypingScore;