// Import necessary dependencies
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // React Router for routing
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
        <Switch>
          {/* Route for player registration */}
          <Route path="/register" component={RegistrationForm} />
          {/* Route for playing the game */}
          <Route path="/play" component={GamePlay} />
          {/* Route for displaying player statistics */}
          <Route path="/stats" component={Statistics} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
