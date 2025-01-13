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
    const [round, setRound] = useState(1);
    const [timer, setTimer] = useState(30);
    const [showResult, setShowResult] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        setWordList(getRandomWords(25));
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (startTime && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            finishTest();
        }
    }, [startTime, timer]);

    const handleKeyDown = (e) => {
        if (!startTime) {
            setStartTime(new Date());
        }

        const { key } = e;

        if (key === ' ') {
            const wordsTyped = typedCharacters.split(' ');
            const currentWord = wordsTyped[wordsTyped.length - 1];
            const currentWordIndex = wordsTyped.length - 1;

            if (currentWordIndex < wordList.length && currentWord !== wordList[currentWordIndex]) {
                setErrorMessage('Please correct the incorrect word(s)');
                e.preventDefault();
                return;
            }

            if (wordsTyped.length === wordList.length) {
                nextRound();
                return;
            }
        }

        if (key.length === 1) {
            setTypedCharacters((prev) => prev + key);
        } else if (key === 'Backspace') {
            setTypedCharacters((prev) => prev.slice(0, -1));
        }

        setErrorMessage('');
    };

    const nextRound = () => {
        const endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000; // time in seconds
        setTotalTime((prevTime) => prevTime + timeTaken);
        setTotalWords((prevWords) => prevWords + wordList.length);

        setRound((prevRound) => prevRound + 1);
        setWordList(getRandomWords(wordList.length + 5));
        setTypedCharacters('');
        setStartTime(null);
        setTimer(30);
        setErrorMessage('');
    };

    const getUsername = () => {
        return localStorage.getItem('username');

    };
    const updateHighScore = async (newScore) => {
        try {
            console.log(round, newScore);
            const username = getUsername(); // Replace this with your method to get the username
            if (!username) {
                console.error('No username found');
                return;
            }
            // Make the POST request using axios
            const response = await axios.post('http://localhost:5000/api/users/submit-turbo', {
                username: username,
                wpm: newScore,
                rounds: (round-1) // Use `round` here
            }, {
                withCredentials: true
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
        const timeTaken = (endTime - startTime) / 1000; // time in seconds
        setTotalTime((prevTime) => prevTime + timeTaken);
        setTotalWords((prevWords) => prevWords + wordList.length);
    
        const finalWpm = Math.round((totalWords / (totalTime / 60)));
        updateHighScore(finalWpm); // Ensure updateHighScore is called here with finalWpm
        setWpm(finalWpm);
        setShowResult(true);
        setTypedCharacters('');
    };
    

    const handleRestart = () => {
        setTypedCharacters('');
        setWordList(getRandomWords(25));
        setStartTime(null);
        setRound(1);
        setTimer(30);
        setShowResult(false);
        setTotalTime(0);
        setTotalWords(0);
        setWpm(0);
        setErrorMessage('');
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
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
            </Helmet>
            <h2 className="header" onClick={handleHomeClick}>ctrlflow</h2>
            <h1 className="main-title">Turbo Typing Test</h1>
            <div className="details-container">
                <h2 className="details">Round: {round}</h2>
                <h2 className="details">Time Left: {timer}s</h2>
            </div>
            <div className="words-container">{renderWords()}</div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {showResult && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Game Over</h2>
                        <h3>Your WPM: {wpm}</h3>
                        <h3>Rounds Completed: {round - 1}</h3>
                        <button onClick={handleRestart}>Restart</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Test;
