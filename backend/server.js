// Import required modules
const express = require('express'); //Power the actual server
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

// Define constants
const PORT = 3000; // Define the port number

// Create an Express application
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = socketIo(server);

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Game state
let players = {}; // Object to store player information
let gameGrid = []; // Array to represent the game grid
let turnOrder = []; // Array to store player turn order
let currentPlayerIndex = 0; // Index of the current player in turnOrder
let roundEnded = false; // Flag to track if the round has ended
let gameOver = false; // Flag to track if the game is over
let gamesPlayed = 0; // Variable to track the total games played

// WebSocket connection handler
io.on('connection', (socket) => {
    console.log('A client connected.');

    // Handle player registration
    socket.on('register', (playerId) => {
        // Add player to players object
        players[playerId] = { monsters: [], wins: 0, losses: 0 };
        // Send success response
        io.emit('registrationSuccess', `Player ${playerId} registered successfully.`);
    });

    // Handle game play
    socket.on('play', (playerId, action) => {
        // Check if game is over or round has ended
        if (gameOver || roundEnded) {
            io.emit('gameError', `Cannot play. Game over or round ended.`);
            return;
        }

        // Check if it's the player's turn
        if (turnOrder[currentPlayerIndex] !== playerId) {
            io.emit('gameError', `Not your turn.`);
            return;
        }

        // Check action type
        switch (action.type) {
            case 'place':
                // place monster logic 
                break;
            case 'move':
                // move monster logic 
                break;
            default:
                io.emit('gameError', `Invalid action type.`);
                return;
        }

        // Update current player index for next turn
        currentPlayerIndex = (currentPlayerIndex + 1) % turnOrder.length;

        // Check if all players have had a turn
        if (currentPlayerIndex === 0) {
            // End the round
            roundEnded = true;
        }

        // Send success response
        io.emit('gameSuccess', `Action executed.`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A client disconnected.');
        // Implement logic to handle player disconnection
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
