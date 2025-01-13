import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import './Login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const { username, email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/register', formData);
            console.log(res.data);
            setError(null); // Clear any previous errors
            setSuccess('Registration successful! Redirecting to login...');
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                window.location.href = '/login'; // Adjust the URL as needed
            }, 3000);
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.message || 'User already exists.');
            setSuccess(null); // Clear any success message
        }
    };

    const handleHomeClick = () => {
        window.location.href = '/'; // Redirect to home page
    };

    return (
        <div className="login-form">
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
            </Helmet>
            <h2 className="header" onClick={handleHomeClick}>ctrlflow</h2>
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
                <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
                <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default Register;
