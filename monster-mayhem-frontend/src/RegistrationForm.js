// Import necessary dependencies
import React, { useState } from 'react';
import axios from 'axios'; // Axios for making HTTP requests

// RegistrationForm component for player registration
const RegistrationForm = () => {
  // State to store player ID input
  const [playerId, setPlayerId] = useState('');

  // Function to handle registration
  const handleRegister = async () => {
    try {
      // Make a POST request to register the player using Axios
      const response = await axios.post('http://localhost:3000/register', { playerId });
      alert(response.data); // Show success message
    } catch (error) {
      alert('Failed to register. Please try again.'); // Show error message
      console.error("Registration error:", error); // Debugging line
    }
  };

  // Render the registration form
  return (
    <div>
      <h2>Player Registration</h2>
      {/* Input field for entering player ID */}
      <input type="text" placeholder="Enter Player ID" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
      {/* Button to register */}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegistrationForm;

