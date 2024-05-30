// Import necessary dependencies
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // React Router for routing
import RegistrationForm from './RegistrationForm'; // Import RegistrationForm component
import GamePlay from './GamePlay'; // Import GamePlay component
import Statistics from './Statistics'; // Import Statistics component

// App component to define routes and display components
const App = () => {
  // State to store the player ID
  const [playerId, setPlayerId] = useState(null);

  // Function to handle player registration and set player ID
  const handleRegister = (id) => {
    setPlayerId(id);
    console.log("Player ID set to:", id); // Debugging line
  };

  // Render the app with routing
  return (
    <Router>
      <div>
        {/* Define routes */}
        <Routes>
          <Route exact path="/" component={GamePlay} />
          {/* Route for player registration */}
          <Route path="/register" element={<RegistrationForm onRegister={handleRegister} />} />
          {/* Route for playing the game */}
          <Route path="/play" element={<GamePlay playerId={playerId} />} />
          {/* Route for displaying player statistics */}
          <Route path="/stats" element={<Statistics playerId={playerId} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
