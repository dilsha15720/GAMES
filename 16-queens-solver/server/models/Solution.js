const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    board: { type: [[Number]], required: true }, // 16x16 board array
    recognized: { type: Boolean, default: false }, // Whether the solution has been recognized
    timeTaken: { type: Number, required: true }, // Time taken to find this solution (milliseconds)
});

module.exports = mongoose.model('Solution', solutionSchema);
