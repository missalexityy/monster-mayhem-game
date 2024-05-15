import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const GamePlay = () => {
  const [gameState, setGameState] = useState(null);
  const [selectedMonster, setSelectedMonster] = useState(null);
  
  useEffect(() => {
    const socket = socketIOClient('http://localhost:3000');

    // Handle receiving updated game state from the server
    socket.on('gameStateUpdated', (updatedGameState) => {
      setGameState(updatedGameState);
    });

    return () => socket.disconnect(); // Cleanup on component unmount
  }, []);

  // Function to handle placing a monster on the grid
  const handlePlaceMonster = (monsterType, position) => {
    if (gameState.currentPlayer === playerId) { // Check if it's the player's turn
      // Send place monster action to server
      socket.emit('play', playerId, { type: 'place', monsterType, position });
    } else {
      console.log('Not your turn'); // Not player's turn
    }
  };

 // Function to handle moving a monster on the grid
 const handleMoveMonster = (monsterId, newPosition) => {
  if (gameState.currentPlayer === playerId) {
    // Send move monster action to server
    socket.emit('play', playerId, { type: 'move', monsterId, newPosition });
  } else {
    console.log('Not your turn');
  }
};

// Function to handle ending the player's turn
const handleEndTurn = () => {
  if (gameState.currentPlayer === playerId) {
    // Send end turn action to server
    socket.emit('endTurn', playerId);
  } else {
    console.log('Not your turn');
  }
};

// Function to select a monster for moving
const handleSelectMonster = (monsterId) => {
  // Select a monster to move
  setSelectedMonster(monsterId);
};

 return (
    <div>
      <h2>Gameplay</h2>
      {/* Render game UI based on gameState */}
      {gameState && (
        <div>
          <p>Current Player: {gameState.currentPlayer}</p>
          {/* Render game grid, monsters, etc. */}
        </div>
      )}
      {/* Buttons to place different types of monsters */}
      <button onClick={() => handlePlaceMonster('vampire', { x: 0, y: 0 })}>Place Vampire</button>
      <button onClick={() => handlePlaceMonster('werewolf', { x: 0, y: 0 })}>Place Werewolf</button>
      <button onClick={() => handlePlaceMonster('ghost', { x: 0, y: 0 })}>Place Ghost</button>
      {/* Button to end the player's turn */}
      <button onClick={handleEndTurn}>End Turn</button>
    </div>
  );
};

export default GamePlay;