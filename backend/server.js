// Import required modules
const express = require('express'); //Power the actual server
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const App = () => {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={GamePlayWrapper} />
        </Switch>
      </Router>
    );
  };
  
  // Wrapper component to pass playerId to GamePlay
  const GamePlayWrapper = () => {
    const playerId = "player1"; // Hardcoded for example purposes
    return <GamePlay playerId={playerId} />;
  };
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
                if (placeMonster(playerId, action.monsterType, action.position)) {
                    io.emit('gameSuccess', `Monster placed successfully.`);
                } else {
                    io.emit('gameError', `Invalid position.`);
                }
                break;
            case 'move':
                if (moveMonster(playerId, action.monsterId, action.position)) {
                    io.emit('gameSuccess', `Monster moved successfully.`);
                } else {
                    io.emit('gameError', `Invalid move.`);
                }
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
        // Find the disconnected player's ID
    const disconnectedPlayerId = Object.keys(players).find(id => players[id].socketId === socket.id);
    
    // Check if the disconnected player exists
    if (disconnectedPlayerId) {
        // Remove the disconnected player from the players object
        delete players[disconnectedPlayerId];
        
        // If the disconnected player was the current player, move to the next player's turn
        if (turnOrder[currentPlayerIndex] === disconnectedPlayerId) {
            currentPlayerIndex = (currentPlayerIndex + 1) % turnOrder.length;
        }
        
        io.emit('playerDisconnected', disconnectedPlayerId); // Emit an event to inform all clients about the disconnection 
        io.emit('gameStateUpdated', gameState); // Emit updated game state to all clients
        
        gamesPlayed++;  // Increment games played when a new game starts

        console.log(`Player ${disconnectedPlayerId} disconnected.`);
    }
});

});

// Function to place a monster on the grid
function placeMonster(playerId, monsterType, position) {
    // Check if position is valid
    if (isValidPosition(position)) {
        // Place the monster on the grid
        gameGrid[position.x][position.y] = { player: playerId, type: monsterType };
        // Add monster to player's monsters array
        players[playerId].monsters.push({ type: monsterType, position });
        return true;
    }
    return false;
}

// Function to move a monster on the grid
function moveMonster(playerId, monsterId, newPosition) {
    const playerMonsters = players[playerId].monsters;
    const monsterIndex = playerMonsters.findIndex(monster => monster.id === monsterId);
    if (monsterIndex !== -1 && isValidPosition(newPosition)) {
        playerMonsters[monsterIndex].position = newPosition;
        return true;
    }
    return false;
}

// Function to check if a position is valid
function isValidPosition(position) {
    // Check if position is within the grid bounds
    return position.x >= 0 && position.x < 10 && position.y >= 0 && position.y < 10;
}

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});