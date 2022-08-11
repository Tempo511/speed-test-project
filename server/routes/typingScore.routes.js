const { model } = require("mongoose");
const TypingScoreController = require("../controllers/typingScore.controller");

module.exports = (app) => {
    app.get("/api/typingscores", TypingScoreController.findAllTypingScores);
    app.post("/api/typingScores", TypingScoreController.createNewTypingScore);
    app.get("/api/typingscores/:id", TypingScoreController.findOneTypingScore);
    app.put("/api/typingscores/:id", TypingScoreController.updateExistingTypingScore);
    app.delete("/api/typingscores/:id", TypingScoreController.deleteAnExistingTypingScore);
};