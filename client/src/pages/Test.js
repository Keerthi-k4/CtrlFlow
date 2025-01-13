import React, { useState, useEffect, useRef } from 'react';
import words from '../words';
import './Test.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';

const getRandomWords = (numWords) => {
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numWords);
};

const Test = () => {
    const [typedCharacters, setTypedCharacters] = useState('');
    const [wordList, setWordList] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
    const [incorrectKeystrokes, setIncorrectKeystrokes] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        setWordList(getRandomWords(25));
        inputRef.current.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (!startTime) {
            setStartTime(new Date());
        }

        const { key } = e;
        let newTypedCharacters = typedCharacters;

        if (key === ' ' && typedCharacters.split(' ').length === 25) {
            finishTest();
            return;
        }

        if (key.length === 1) {
            newTypedCharacters = typedCharacters + key;
        } else if (key === 'Backspace') {
            newTypedCharacters = typedCharacters.slice(0, -1);
        }

        setTypedCharacters(newTypedCharacters);
        calculateKeystrokes(newTypedCharacters);
    };
    const getUsername = () => {
        return localStorage.getItem('username');

    };
    const updateHighScore = async (newScore,accuracy) => {
        try {
            console.log(newScore , accuracy)
            const username = getUsername(); // Replace this with your method to get the username
            if (!username) {
                console.error('No username found');
                return;
            }
            // Make the POST request using axios
            const response = await axios.post('http://localhost:5000/api/users/submit-practice', {
                username: username,
                accuracy: accuracy,
                wpm: newScore
            });
    
            // Log the response data
            console.log('Updated high score:', response.data.highScore);
        } catch (error) {
            // Handle errors
            console.error('Error updating high score:', error.response?.data?.message || error.message);
        }
    };
    
    const finishTest = () => {
        const endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000 / 60; // time in minutes
        const calculatedWpm = Math.round((25 / timeTaken));
        const totalKeystrokes = correctKeystrokes + incorrectKeystrokes;

        const calculatedAccuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 0;
        setWpm(calculatedWpm);
        setAccuracy(calculatedAccuracy);
    
        // Call updateHighScore to send the WPM to the backend
        updateHighScore(calculatedWpm, calculatedAccuracy);
    
        setShowResult(true);
        setTypedCharacters('');
    };
    
    const calculateKeystrokes = (value) => {
        let correct = 0;
        let incorrect = 0;
        const wordsArray = wordList.join(' ').split('');
        value.split('').forEach((char, index) => {
            if (char === wordsArray[index]) {
                correct++;
            } else {
                incorrect++;
            }
        });
        setCorrectKeystrokes(correct);
        setIncorrectKeystrokes(incorrect);
    };

    const handleRestart = () => {
        setTypedCharacters('');
        setWordList(getRandomWords(25));
        setStartTime(null);
        setCorrectKeystrokes(0);
        setIncorrectKeystrokes(0);
        setShowResult(false);
        setWpm(0);
        setAccuracy(0);
        inputRef.current.focus();
    };

    const renderWords = () => {
        const wordsArray = wordList.join(' ').split('');
        return wordsArray.map((char, index) => {
            let color = '';
            if (index < typedCharacters.length) {
                color = typedCharacters[index] === char ? 'correct' : 'incorrect';
            }
            return (
                <span key={index} className={color}>
                    {char}
                    {index === typedCharacters.length - 1 && <span className="cursor">|</span>}
                </span>
            );
        });
    };

    const handleHomeClick = () => {
        window.location.href = '/'; // Redirect to home page
    };
    return (
        <div style={{ textAlign: 'center' }} onKeyDown={handleKeyDown} tabIndex="0" ref={inputRef}>
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"></link>
            </Helmet>
            <h2 className="header" onClick={handleHomeClick}>ctrlflow</h2>
            <h1 className="title">Practice Mode</h1>
            <div className="words-container">{renderWords()}</div>
            {showResult && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Your WPM: {wpm}</h2>
                        <h2>Your Accuracy: {accuracy}%</h2>
                        <button onClick={handleRestart}>Restart</button>
                    </div>
                </div>
            )
            }
                                    <button onClick={handleRestart}>Restart</button>

        </div>
    );
};

export default Test;
