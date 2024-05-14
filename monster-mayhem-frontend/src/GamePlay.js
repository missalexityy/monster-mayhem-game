import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const GamePlay = () => {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const socket = socketIOClient('http://localhost:3000');

    // Handle receiving updated game state from the server
    socket.on('gameStateUpdated', (updatedGameState) => {
      setGameState(updatedGameState);
    });

    return () => socket.disconnect(); // Cleanup on component unmount
  }, []);

  const handlePlay = () => {
    // Handle player actions and send to server...
  };

  return (
    <div>
      <h2>Gameplay</h2>
      {/* Render game UI based on gameState */}
      <button onClick={handlePlay}>Play</button>
    </div>
  );
};

export default GamePlay;
