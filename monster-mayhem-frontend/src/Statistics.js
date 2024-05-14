// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios for making HTTP requests

// Statistics component for displaying player statistics
const Statistics = () => {
  // State to store player statistics
  const [stats, setStats] = useState({});

  // Fetch player statistics when component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Make a GET request to fetch player statistics using Axios
        const response = await axios.get('http://localhost:3000/stats/PLAYER_ID'); // Replace PLAYER_ID with actual player ID in the future maybe
        setStats(response.data); // Update state with fetched statistics
      } catch (error) {
        console.error('Failed to fetch player statistics:', error); // Log error if fetching fails
      }
    };

    fetchStats(); // Call fetchStats function
  }, []); // Empty dependency array ensures useEffect runs only once

  // Render player statistics
  return (
    <div>
      <h2>Player Statistics</h2>
      {/* Display wins and losses */}
      <p>Wins: {stats.wins}</p>
      <p>Losses: {stats.losses}</p>
    </div>
  );
};

export default Statistics;
