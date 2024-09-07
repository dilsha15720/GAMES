const express = require('express');
const Solution = require('../models/Solution');
const Player = require('../models/Player');
const router = express.Router();
const { findSolutionsInWorker } = require('../utils/solutionThreading'); // Import the threading utility

// Helper function to validate the 16-Queens solution
const isValidSolution = (board) => {
    // Implement logic to validate the 16-Queens solution
    const queens = [];
    for (let i = 0; i < 16; i++) {
        let count = 0;
        for (let j = 0; j < 16; j++) {
            if (board[i][j] === 1) {
                count++;
                queens.push([i, j]); // Record the position of the queen
            }
        }
        if (count !== 1) return false; // Each row must have exactly one queen
    }

    // Check columns and diagonals
    const columns = new Set();
    const diag1 = new Set(); // Diagonal from top-left to bottom-right
    const diag2 = new Set(); // Diagonal from top-right to bottom-left
    for (const [row, col] of queens) {
        if (columns.has(col) || diag1.has(row - col) || diag2.has(row + col)) return false;
        columns.add(col);
        diag1.add(row - col);
        diag2.add(row + col);
    }

    return true;
};
// Route to submit a solution
router.post('/submit-solution', async (req, res) => {
    const { playerName, board } = req.body;

    // Validate the solution
    if (!isValidSolution(board)) {
        return res.status(400).json({ message: 'Invalid Solution.' });
    }

    // Check if the solution has already been recognized
    const existingSolution = await Solution.findOne({ board });
    if (existingSolution && existingSolution.recognized) {
        return res.status(400).json({ message: 'This solution has already been recognized. Please try another one.' });
    }

    // Measure the time taken
    const startTime = Date.now();
    const timeTaken = Date.now() - startTime;

    // Save the new solution
    const newSolution = new Solution({ playerName, board, recognized: true, timeTaken });
    await newSolution.save();

    // Save player's information
    let player = await Player.findOne({ name: playerName });
    if (!player) {
        player = new Player({ name: playerName });
    }
    player.solutions.push(newSolution._id);
    await player.save();

    res.status(200).json({ message: 'Solution recognized and saved successfully!' });
});

// Route to generate threaded solutions
router.post('/generate-threaded-solutions', async (req, res) => {
    const board = Array(16).fill(null).map(() => Array(16).fill(0)); // Initialize an empty 16x16 board
    try {
        const solutions = await findSolutionsInWorker(board, 0); // Start finding solutions in a worker thread
        res.status(200).json({ message: 'Threaded solutions generated successfully', solutions });
    } catch (error) {
        res.status(500).json({ message: 'Error in generating threaded solutions', error });
    }
});

router.post('/submit-solution', async (req, res) => {
    const { playerName, board } = req.body;
    console.log('Received solution:', { playerName, board });
    // rest of your code
});

module.exports = router;
