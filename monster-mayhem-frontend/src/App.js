// Import necessary dependencies
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // React Router for routing
import RegistrationForm from './RegistrationForm'; // Import RegistrationForm component
import GamePlay from './GamePlay'; // Import GamePlay component
import Statistics from './Statistics'; // Import Statistics component

// App component to define routes and display components
const App = () => {
  // Render the app with routing
  return (
    <Router>
      <div>
        {/* Define routes */}
        <Routes>
          {/* Route for player registration */}
          <Route path="/register" element={<RegistrationForm />} />
          {/* Route for playing the game */}
          <Route path="/play" element={<GamePlay />} />
          {/* Route for displaying player statistics */}
          <Route path="/stats" element={<Statistics />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
