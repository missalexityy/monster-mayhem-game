import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:3000'); // Initialize socket connection outside the component

const GamePlay = ({ playerId }) => {  // Added playerId as a prop
  const [gameState, setGameState] = useState(null);
  const [selectedMonster, setSelectedMonster] = useState(null);
  
  useEffect(() => {
    // Handle receiving updated game state from the server
    socket.on('gameStateUpdated', (updatedGameState) => {
      setGameState(updatedGameState);
    });

    return () => socket.disconnect(); // Cleanup on component unmount
  }, []);

  // Function to handle placing a monster on the grid
  const handlePlaceMonster = (monsterType, position) => {
    if (gameState && gameState.currentPlayer === playerId) {  // Ensure gameState exists
      // Send place monster action to server
      socket.emit('play', playerId, { type: 'place', monsterType, position });
    } else {
      console.log('Not your turn'); // Not player's turn
    }
  };

  // Function to handle moving a monster on the grid
  // Note: This function is currently unused, so we can comment it out to remove the warning
  // const handleMoveMonster = (monsterId, newPosition) => {
  //   if (gameState && gameState.currentPlayer === playerId) {
  //     // Send move monster action to server
  //     socket.emit('play', playerId, { type: 'move', monsterId, newPosition });
  //   } else {
  //     console.log('Not your turn');
  //   }
  // };

  // Function to handle ending the player's turn
  const handleEndTurn = () => {
    if (gameState && gameState.currentPlayer === playerId) {
      // Send end turn action to server
      socket.emit('endTurn', playerId);
    } else {
      console.log('Not your turn');
    }
  };

  // Function to select a monster for moving
  // Note: This function is currently unused, so we can comment it out to remove the warning
  // const handleSelectMonster = (monsterId) => {
  //   // Select a monster to move
  //   setSelectedMonster(monsterId);
  // };

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
