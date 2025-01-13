// src/pages/Home.js
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Home.css'
import { Helmet } from 'react-helmet';
const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    window.location.href = '/'; // Redirect to login page or home page
};

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      // Check if the user is authenticated
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
    }, []);

  
    return (
        <div className="home-container">
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
            </Helmet>
            <h1>ctrlflow</h1>
            <div className="container">
                <Link to="/turbomode">
                    <button>Turbo Mode</button>
                </Link>
                <Link to="/test">
                    <button>Practice Mode</button>
                </Link>
            </div>
            <div class="navbar">
                {!isAuthenticated && (
        <p>
          <Link to="/login">log-in</Link>     <Link to="/register">sign-in</Link>
        </p>
      )}
      {isAuthenticated &&(
        <p>             
            <Link to="/profile">Profile</Link> <button class="logout" onClick={handleLogout}>Logout</button>
        </p>
      )}
            </div>
        </div>
    );
};

export default Home;
