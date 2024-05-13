// Import required modules
const express = require('express'); 
const bodyParser = require('body-parser');

const app = express(); // Create an Express application
const port = 3000; // Define the port number

app.use(bodyParser.json()); // Middleware to parse JSON requests

// Game state
let players = {}; // Object to store player information
let gamesPlayed = 0; // Counter to track total games played

// Endpoint to handle player registration
app.post('/register', (req, res) => {
    const { playerId } = req.body;

    // Check if player already registered
    if (!players[playerId]) {
        // If player not registered, add player to players object
        players[playerId] = { wins: 0, losses: 0 };
        // Send success response
        res.status(200).send(`Player ${playerId} registered successfully.`);
    } else {
        // If player already registered, send error response
        res.status(400).send(`Player ${playerId} already registered.`);
    }
});

// Endpoint to handle game play
app.post('/play', (req, res) => {
    const { playerId, monstersPlaced } = req.body;

    // Check if player registered
    if (!players[playerId]) {
        // If player not registered, send error response
        res.status(400).send(`Player ${playerId} not registered.`);
        return;
    }

    // Logic to handle game play
    /* Game Mechanics:
Each round, the player with the fewest monsters on the grid gets a turn first. If there is a tie, then it is randomly decided from among those with the least monsters.
On a players turn, they may play either a vampire, a werewolf or a ghost anywhere on their edge of the grid. They may not move that monster this turn. They may also move any other monsters that they have. A monster can move any number of squares horizontally or vertically, or up to two squares diagonally. They can move over their own player’s monsters, but cannot move over other player’s monsters.
If two monsters finish on the same square, they are dealt with as follows:
●	If there’s a vampire and a werewolf, the werewolf is removed
●	If there’s a werewolf and a ghost, the ghost is removed
●	If there’s a ghost and a vampire, the vampire is removed
●	If there’s two of the same kind of monster, both are removed

A player’s turn ends when they decide so, or if they have no monsters left to move.
A round end once all players have had a turn. 
A player is eliminated once 10 of their monsters have been removed. A player wins if all other players have been eliminated.
*/

    // For demonstration purposes, increment wins and losses randomly
    players[playerId].wins += Math.random() < 0.5 ? 1 : 0;
    players[playerId].losses += Math.random() < 0.5 ? 1 : 0;

    gamesPlayed++; // Increment total games played

    res.status(200).send(`Game played successfully.`);  // Send success response
});

app.get('/stats/:playerId', (req, res) => { // Endpoint to get player statistics
    const { playerId } = req.params;

    if (!players[playerId]) {  // To check if player registered
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

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});