import React, { useState } from 'react';
import axios from 'axios';

const Chessboard = () => {
    const [board, setBoard] = useState(Array(16).fill(null).map(() => Array(16).fill(null)));
    const [playerName, setPlayerName] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [message, setMessage] = useState('');

    const handleSquareClick = (row, col) => {
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = newBoard[row][col] === 1 ? null : 1;
        setBoard(newBoard);
    };

    const handleSubmit = async () => {
        console.log('Submitting board:', board)
        try {
            const response = await axios.post('http://localhost:5000/submit-solution', {
                playerName,
                board
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };
    

    const handleNewGame = () => {
        setBoard(Array(16).fill(null).map(() => Array(16).fill(null)));
        setPlayerName('');
        setGameStarted(false);
        setMessage('');
    };

    const handleRestart = () => {
        setBoard(Array(16).fill(null).map(() => Array(16).fill(null)));
        setMessage('');
    };

    const handleStartGame = () => {
        setGameStarted(true);
    };

    return (
        <div style={styles.container}>
            {!gameStarted ? (
                <div>
                    <h1>Welcome to the 16-Queens Problem</h1>
                    <button onClick={handleStartGame} style={styles.button}>Start Game</button>
                </div>
            ) : (
                <div>
                    <h1>16-Queens Problem</h1>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        style={styles.input}
                    />
                    <div style={styles.board}>
                        {/* Render column numbers */}
                        <div></div> {/* Empty top-left corner */}
                        {Array.from({ length: 16 }, (_, index) => (
                            <div key={`col-${index}`} style={styles.label}>
                                {index + 1}
                            </div>
                        ))}
                        {/* Render board rows with row numbers */}
                        {board.map((row, rowIndex) => (
                            <React.Fragment key={`row-${rowIndex}`}>
                                {/* Row number */}
                                <div style={styles.label}>
                                    {rowIndex + 1}
                                </div>
                                {/* Board cells */}
                                {row.map((square, colIndex) => (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                                        style={{
                                            ...styles.square,
                                            backgroundColor: (rowIndex + colIndex) % 2 === 0 ? '#769656' : '#eeeed0',
                                        }}>
                                        {square === 1 && '♕'}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                    <button onClick={handleSubmit} style={styles.button}>Submit Solution</button>
                    {message && <p>{message}</p>}
                    <div style={styles.buttonGroup}>
                        <button onClick={handleNewGame} style={{ ...styles.button, marginRight: '5px' }}>New Game</button>
                        <button onClick={handleRestart} style={styles.button}>Restart</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '15px',
        textAlign: 'center',
    },
    board: {
        display: 'grid',
        gridTemplateColumns: 'repeat(17, 20px)',
        gap: '3px',
        marginBottom: '10px',
    },
    label: {
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '20px',
    },
    square: {
        width: 20,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        cursor: 'pointer',
        color: 'black',
    },
    input: {
        padding: '5px',
        marginBottom: '10px',
        fontSize: '10px',
    },
    button: {
        padding: '5px 10px',
        fontSize: '10px',
        cursor: 'pointer',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
    }
};

export default Chessboard;
