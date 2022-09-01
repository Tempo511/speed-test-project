import React, { useEffect, useState, useRef } from 'react';
import randomWords from 'random-words'
import axios from 'axios'
import { Link } from 'react-router-dom';
const NUMB_WORDS = 200;
const SECONDS = 60;


const TypingBox = () => {


    const [wordList, setWordList] = useState([]);
    const [countdown, setCountdown] = useState(SECONDS)
    const [currInput, setCurrInput] = useState('');
    const [currWordIndex, setCurrWordIndex] = useState(0);
    const [currCharIndex, setCurrCharIndex] = useState(-1);
    const [currChar, setCurrChar] = useState('');
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [totalCharsTyped, setTotalCharsTyped] = useState(0);
    const [totalScore, setTotalScore] = useState({});
    const [status, setStatus] = useState("waiting")
    const textInput = useRef(null);



    //generates a list of random words upon initial rendering of page. 
    useEffect(() => {
        let list = generateWords();
        setWordList(list)
    }, [])

    //behavior for status change
    useEffect(() => {
        if (status === 'started') {
            textInput.current.focus();
            setTotalScore({})
        }
        if (status === 'finished') {
            setTotalScore({ ...totalScore, wpm: ((totalCharsTyped / 5)), accuracy: (correct / (incorrect + correct) * 100) })
        }
    }, [status])

    //actually generates random words list. 
    function generateWords() {
        let arr = new Array(NUMB_WORDS).fill(null).map(() => randomWords())
        return arr
    }


    function start() {

        //first check to see if this is a new game after an already finished game, 
        //thus the status would be 'finished.' Need to reset all state back to initial state.
        if (status === "finished") {
            setWordList(generateWords());
            setCurrWordIndex(0);
            setCorrect(0);
            setIncorrect(0);
            setCurrCharIndex(-1);
            setCurrChar("");
            setTotalCharsTyped(0);

            //these lists are how the app keeps track of previous correct or incorrect words
            const correctWordSpanList = document.getElementsByClassName("word-background-success");
            const incorrectWordSpanList = document.getElementsByClassName("word-background-danger");

            //these loops remove classes so that each new game all the words have no background
            // and don't count as correct or incorrect
            for (let i = 0; i < correctWordSpanList.length; i++) {
                correctWordSpanList[i].classList.remove("word-background-success")
                i--;
            }
            for (let k = 0; k < incorrectWordSpanList.length; k++) {
                incorrectWordSpanList[k].classList.remove("word-background-danger")
                k--;
            }

        }
        //change status over to started
        if (status !== "started") {
            setStatus("started")

            //this is the countdown clock logic
            let interval = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown === 0) {
                        clearInterval(interval)
                        setStatus("finished")
                        setCurrInput('');
                        return SECONDS
                    } else {
                        return prevCountdown - 1
                    }
                })

            }, 1000)
        }

    }

    //handles any key input
    function handleKeyDown({ keyCode, key }) {

        //this is the 'press any key' logic to start game. 
        if (status === "waiting") {
            start();
        }

        //space bar logic
        if (keyCode === 32) {
            checkMatch();
            setCurrInput('');
            setCurrWordIndex(currWordIndex + 1);
            setCurrCharIndex(-1);
        }
        //backspace logic
        else if (keyCode === 8) {
            setCurrCharIndex(currCharIndex - 1);
            setCurrChar('')
        }
        //every other key
        else {
            setCurrCharIndex(currCharIndex + 1);
            setCurrChar(key)
        }
    }

    //comparison between user input and word array
    function checkMatch() {
        const wordToCompare = wordList[currWordIndex];

        //trim is used to remove space at end of input
        const doesItMatch = wordToCompare === currInput.trim();
        const wordSpan = document.getElementById(`word${currWordIndex}`)

        if (doesItMatch) {
            wordSpan.setAttribute('class', 'word-background-success')
            setCorrect((prevCorrect) => {
                return prevCorrect + 1
            })
            setTotalCharsTyped((prevTotalCharsTyped) => {
                return prevTotalCharsTyped + wordToCompare.length;
            })
        } else {
            wordSpan.setAttribute('class', 'word-background-danger')
            setIncorrect((prevIncorrect) => {
                return prevIncorrect + 1;
            })
        }
    }


    //function to add background colors to each word. Current logic has it so that words that have 
    //not been compared against have no background color, i.e. line 169
    function getCharClass(wordIdx, charIdx, char) {
        if (wordIdx === currWordIndex && charIdx === currCharIndex && currChar) {
            if (char === currChar) {
                return "has-background-success"
            }
            else {
                return "has-background-danger"
            }
        } else if (wordIdx === currWordIndex && currCharIndex >= wordList[currWordIndex].length) {
            return "has-background-danger"
        }
        else {
            return "";
        }
    }


    //logic for posting score to server side. 
    const postScoreHandler = () => {
        axios.post("http://localhost:8000/api/typingscores", totalScore)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }


    return (
        <div className="container mt-5 d-flex flex-column justify-content-center align-items-center main">
            <h1>Speed Typing Test</h1>
            <h6>Simply begin typing to start.</h6>

            <div className="countdown-box">
                <h1>{countdown}</h1>
            </div>


            {/* input area for user. Is set to disabled when game is over, ie. when finished == true; */}
            <div className="mainContainer">
                <div className="d-flex justify-content-center input-box">
                    <input disabled={status === "finished"} ref={textInput} className="quote-input" id="quote-input" onKeyDown={handleKeyDown} 
                    value={currInput} onChange={(e) => setCurrInput(e.target.value)} autoFocus></input>
                </div>


                {/* display for random words */}
                <div className="quote-display" id="quote-display">
                    {wordList.map((word, i) => {
                        return (
                            <span key={i} >
                                <span id={`word${i}`} className="word">
                                    {word.split('').map((char, idx) => {
                                        return (
                                            <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                                        )
                                    })}
                                </span>
                                <span> </span>
                            </span>
                        )
                    })}
                </div>
            </div>



            {/* Stats that show once game is finished. */}
            {status === "finished" && (
                <div>
                    <h3>Words per minute:</h3>
                    <h2>{(totalCharsTyped / 5)}</h2>
                    <h3>Accuracy:</h3>
                    <h2>{correct / (incorrect + correct) * 100}</h2>
                    <button onClick={() => start()}>Try Again!</button>
                    <br></br>
                    <label>Enter name and post score!</label>
                    <input type="text" onChange={(e) => setTotalScore({ ...totalScore, name: e.target.value })}></input>
                    <button onClick={() => postScoreHandler()}>Post Score</button>
                </div>
            )}

            <Link to="/leaderboard">Leaderboard</Link>
        </div>
    );
};

export default TypingBox;