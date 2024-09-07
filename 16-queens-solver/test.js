const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index');
const Solution = require('./models/Solution');
const Player = require('./models/Player');

const { expect } = chai;
chai.use(chaiHttp);

describe('16-Queens Solver API', () => {
    // Clean up the database before running tests
    before(async () => {
        await Solution.deleteMany({});
        await Player.deleteMany({});
    });

    // Test for valid solution
    it('should recognize and save a correct solution', (done) => {
        const validBoard = Array(16).fill(null).map(() => Array(16).fill(0));
        // Example valid configuration (one possible correct configuration)
        validBoard[0][0] = 1;
        validBoard[1][4] = 1;
        validBoard[2][8] = 1;
        validBoard[3][12] = 1;
        validBoard[4][1] = 1;
        validBoard[5][5] = 1;
        validBoard[6][9] = 1;
        validBoard[7][13] = 1;
        validBoard[8][2] = 1;
        validBoard[9][6] = 1;
        validBoard[10][10] = 1;
        validBoard[11][14] = 1;
        validBoard[12][3] = 1;
        validBoard[13][7] = 1;
        validBoard[14][11] = 1;
        validBoard[15][15] = 1;

        chai.request(server)
            .post('/submit-solution')
            .send({ playerName: 'Jane Doe', board: validBoard })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Solution recognized and saved successfully!');
                done();
            });
    });

    // Test for another valid solution
    it('should accept another valid solution', (done) => {
        const anotherValidBoard = Array(16).fill(null).map(() => Array(16).fill(0));
        // Another example of a valid configuration
        anotherValidBoard[0][1] = 1;
        anotherValidBoard[1][5] = 1;
        anotherValidBoard[2][9] = 1;
        anotherValidBoard[3][13] = 1;
        anotherValidBoard[4][2] = 1;
        anotherValidBoard[5][6] = 1;
        anotherValidBoard[6][10] = 1;
        anotherValidBoard[7][14] = 1;
        anotherValidBoard[8][3] = 1;
        anotherValidBoard[9][7] = 1;
        anotherValidBoard[10][11] = 1;
        anotherValidBoard[11][15] = 1;
        anotherValidBoard[12][4] = 1;
        anotherValidBoard[13][8] = 1;
        anotherValidBoard[14][12] = 1;
        anotherValidBoard[15][0] = 1;

        chai.request(server)
            .post('/submit-solution')
            .send({ playerName: 'Alice', board: anotherValidBoard })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Solution recognized and saved successfully!');
                done();
            });
    });

    // Test for duplicate solution
    it('should reject a duplicate solution', (done) => {
        const validBoard = Array(16).fill(null).map(() => Array(16).fill(0));
        // Example valid configuration
        validBoard[0][0] = 1;
        validBoard[1][4] = 1;
        validBoard[2][8] = 1;
        validBoard[3][12] = 1;
        validBoard[4][1] = 1;
        validBoard[5][5] = 1;
        validBoard[6][9] = 1;
        validBoard[7][13] = 1;
        validBoard[8][2] = 1;
        validBoard[9][6] = 1;
        validBoard[10][10] = 1;
        validBoard[11][14] = 1;
        validBoard[12][3] = 1;
        validBoard[13][7] = 1;
        validBoard[14][11] = 1;
        validBoard[15][15] = 1;

        chai.request(server)
            .post('/submit-solution')
            .send({ playerName: 'Eve', board: validBoard })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Solution recognized and saved successfully!');
                // Try to submit the same solution again
                chai.request(server)
                    .post('/submit-solution')
                    .send({ playerName: 'Eve', board: validBoard })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('message', 'This solution has already been recognized. Please try another one.');
                        done();
                    });
            });
    });

    // Test for invalid solution with multiple issues
    it('should reject an invalid solution with multiple issues', (done) => {
        const invalidBoard = Array(16).fill(null).map(() => Array(16).fill(0));
        invalidBoard[0][0] = 1;
        invalidBoard[1][1] = 1; // Invalid as it shares the same diagonal
        invalidBoard[2][2] = 1; // Invalid as it shares the same diagonal

        chai.request(server)
            .post('/submit-solution')
            .send({ playerName: 'Bob', board: invalidBoard })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message', 'Invalid solution.');
                done();
            });
    });

    // Test for missing fields
    it('should reject the request with missing fields', (done) => {
        chai.request(server)
            .post('/submit-solution')
            .send({ playerName: 'Carol' }) // Missing board
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').that.includes('board');
                done();
            });
    });
});
