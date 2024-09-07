const { Worker } = require('worker_threads');

function findSolutionsInWorker(board, row) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./utils/solutionWorker.js', { workerData: { board, row } });
        worker.on('message', resolve);
        worker.on('error', reject);
    });
}

module.exports = { findSolutionsInWorker };
