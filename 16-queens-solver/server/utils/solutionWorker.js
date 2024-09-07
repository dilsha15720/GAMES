const { parentPort, workerData } = require('worker_threads');

function isValidMove(board, row, col) {
    // Check if placing a queen at (row, col) is valid
    for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false; // Check same column
        if (col - (row - i) >= 0 && board[i][col - (row - i)] === 1) return false; // Check left diagonal
        if (col + (row - i) < 16 && board[i][col + (row - i)] === 1) return false; // Check right diagonal
    }
    return true;
}

function findAllSolutions(board, row) {
    console.log('Finding solutions for row:', row);
    const solutions = [];

    if (row === 16) {
        // Deep copy the board and store the solution
        const solution = board.map(r => [...r]);
        solutions.push(solution);
        return solutions;
    }

    for (let col = 0; col < 16; col++) {
        if (isValidMove(board, row, col)) {
            board[row][col] = 1;
            solutions.push(...findAllSolutions(board, row + 1));
            board[row][col] = 0;
        }
    }

    return solutions;
}

const solutions = findAllSolutions(workerData.board, workerData.row);
parentPort.postMessage(solutions);

