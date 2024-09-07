const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    solutions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Solution' }],
});

module.exports = mongoose.model('Player', playerSchema);

