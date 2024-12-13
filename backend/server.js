const express = require('express');
const app = express();
const PORT = 3000; 
const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Example of game state
let gameStarted = false;
let players = [];

// Route to start the game
app.post('/start-game', (req, res) => {
    // Perform any necessary logic to start the game
    gameStarted = true;
    players = req.body.players; // Assuming the frontend sends player data
    res.send('Game started successfully!');
});

// Route to place a monster
app.post('/place-monster', (req, res) => {
    // Example logic to place a monster
    const { player, monsterType, position } = req.body;
    // Perform validation, update game state, etc.
    res.send('Monster placed successfully!');
});

// Route to move a monster
app.post('/move-monster', (req, res) => {
    // Example logic to move a monster
    const { player, monsterId, newPosition } = req.body;
    // Perform validation, update game state, etc.
    res.send('Monster moved successfully!');
});

// Route to get current game state (optional)
app.get('/game-state', (req, res) => {
    res.json({ gameStarted, players });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
