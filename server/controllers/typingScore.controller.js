const TypingScore = require("../models/typingScore.model")

module.exports.findAllTypingScores = (req, res) => {
    TypingScore.find()
        .then(allTypingScores => res.json({ typingScores: allTypingScores }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.findOneTypingScore = (req, res) => {
    TypingScore.findOne({ _id: req.params.id })
        .then(oneTypingScore => res.json({ typingScore: oneTypingScore }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.createNewTypingScore = (req, res) => {
    TypingScore.create(req.body)
        .then(newlyCreatedTypingScore => res.json({ typingScore: newlyCreatedTypingScore }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.updateExistingTypingScore = (req, res) => {
    TypingScore.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
        .then(updatedTypingScore => res.json({ typingScore: updatedTypingScore }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};

module.exports.deleteAnExistingTypingScore = (req, res) => {
    TypingScore.deleteOne({ _id: req.params.id })
        .then(result => res.json({ result: result }))
        .catch(err => res.json({ message: "Something went wrong", error: err }));
};