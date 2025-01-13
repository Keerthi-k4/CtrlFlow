// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { Helmet } from 'react-helmet';

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

    // Function to get username from local storage
    const getUsername = () => {
        return localStorage.getItem('username');
    };

    // Retrieve the username
    const username = getUsername();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) {
                console.error('Username not found in local storage');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    params: { username } // Send username as query parameter
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]); // Dependency array includes username

    if (loading) return <div>Loading...</div>;

    const handleHomeClick = () => {
        window.location.href = '/'; // Redirect to home page
    };
    return (
        <div className="profile-container">
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
            </Helmet>
            <h2 className="header" onClick={handleHomeClick}>ctrlflow</h2>

            <div className="profile-header">
                Profile
            </div>
            {username ? (
                <div className="details-container">
                    <div className="details-line">
                        <p><strong>Username:</strong> {userData.username}</p>
                        <p><strong>Email:</strong> {userData.email}
                        </p>
                    </div>
                    <div className="details-line">
                        <p><strong>Highest Practice WPM:</strong> {userData.highestPracticeWpm}</p>
                        <p><strong>Practice Accuracy:</strong> {userData.practiceAccuracy}%</p>
                    </div>
                    <div className="details-line">
                        <p><strong>Turbo WPM:</strong> {userData.turboWpm}</p>
                        <p><strong>Turbo Rounds:</strong> {userData.highestTurboRounds}</p>
                    </div>
                </div>
            ) : (
                <p>No profile data available.</p>
            )}
        </div>
    );
};

export default Profile;
