// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

const app = express(); // Create an Express application
const port = 3000; // Define the port number

app.use(bodyParser.json()); // Middleware to parse JSON requests

// Game state
let players = {}; // Object to store player information
let gameGrid = []; // Array to represent the game grid
let turnOrder = []; // Array to store player turn order
let currentPlayerIndex = 0; // Index of the current player in turnOrder
let roundEnded = false; // Flag to track if the round has ended
let gameOver = false; // Flag to track if the game is over
let gamesPlayed = 0; // Variable to track the total games played

// Function to initialize the game grid
function initializeGameGrid() {
    // Initialize the game grid with empty cells
    gameGrid = Array.from({ length: 10 }, () => Array(10).fill(null));
}

// Function to initialize players
function initializePlayers(playerIds) {
    // Initialize players object with empty monster arrays
    playerIds.forEach(playerId => {
        players[playerId] = { monsters: [], wins: 0, losses: 0 };
    });
}

// Function to start a new round
function startRound() {
    // Reset roundEnded flag
    roundEnded = false;

    // Determine turn order based on the number of monsters each player has
    turnOrder = Object.keys(players).sort((a, b) => players[a].monsters.length - players[b].monsters.length);

    // Set currentPlayerIndex to 0 (first player in turn order)
    currentPlayerIndex = 0;
}

// Endpoint to handle player registration
app.post('/register', (req, res) => {
    const { playerId } = req.body;

    // Check if player already registered
    if (!players[playerId]) {
        // If player not registered, add player to players object
        players[playerId] = { monsters: [], wins: 0, losses: 0 };
        // Send success response
        res.status(200).send(`Player ${playerId} registered successfully.`);
    } else {
        // If player already registered, send error response
        res.status(400).send(`Player ${playerId} already registered.`);
    }
});

// Endpoint to handle game play
app.post('/play', (req, res) => {
    const { playerId, action } = req.body;

    // Check if game is over or round has ended
    if (gameOver || roundEnded) {
        res.status(400).send(`Cannot play. Game over or round ended.`);
        return;
    }

    // Check if it's the player's turn
    if (turnOrder[currentPlayerIndex] !== playerId) {
        res.status(400).send(`Not your turn.`);
        return;
    }

    /* Game mechanics logic goes here... */

    // Update current player index for next turn
    currentPlayerIndex = (currentPlayerIndex + 1) % turnOrder.length;

    // Check if all players have had a turn
    if (currentPlayerIndex === 0) {
        // End the round
        roundEnded = true;
    }

    // Send success response
    res.status(200).send(`Action executed.`);
}); // <- Add a closing parenthesis here

// Endpoint to get player statistics
app.get('/stats/:playerId', (req, res) => {
    const { playerId } = req.params;

    // Check if player registered
    if (!players[playerId]) {
        // If player not registered, send error response
        res.status(400).send(`Player ${playerId} not registered.`);
        return;
    }

    // If player registered, get player statistics (wins and losses)
    const { wins, losses } = players[playerId];
    res.status(200).json({ wins, losses });  // Send player statistics as JSON response
});

app.get('/games-played', (req, res) => { // Endpoint to get total games played
    // Send total games played as JSON response
    res.status(200).json({ totalGamesPlayed: gamesPlayed });
});

/*
//Trial to get requests to the root URL
app.get('/', (req, res) => {
    res.send('Welcome to Monster Mayhem!');
});
*/

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
