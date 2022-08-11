import React, { useEffect, useState, useRef } from 'react';
import randomWords from 'random-words'
import axios from 'axios'
import {Link} from 'react-router-dom';
const NUMB_WORDS = 200;
const SECONDS = 30;


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
    

        useEffect(() => {
            let list = generateWords();
            setWordList(list)
        }, [])


        useEffect(()=>{
            if(status === 'started'){
                textInput.current.focus();
                setTotalScore({})
            }
            if(status === 'finished'){
                setTotalScore({...totalScore, wpm: ((totalCharsTyped/5) * 2), accuracy: (correct / (incorrect + correct) * 100)})
            }
        }, [status])
    function generateWords() {
        let arr = new Array(NUMB_WORDS).fill(null).map(() => randomWords())
        return arr
    }

    function start() {
        if (status === "finished") {
            setWordList(generateWords());
            setCurrWordIndex(0);
            setCorrect(0);
            setIncorrect(0);
            setCurrCharIndex(-1);
            setCurrChar("");
            setTotalCharsTyped(0);
            const correctWordSpanList = document.getElementsByClassName("word-background-success");
            const incorrectWordSpanList = document.getElementsByClassName("word-background-danger");
            
            for(let i = 0; i < correctWordSpanList.length; i++){
                correctWordSpanList[i].classList.remove("word-background-success")
                i--;
            }
            for(let k =0; k < incorrectWordSpanList.length; k++){
                incorrectWordSpanList[k].classList.remove("word-background-danger")
                k--;
            }
            
        }

        if (status !== "started") {
            setStatus("started")
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

    function handleKeyDown({ keyCode, key }) {
        if(status === "waiting"){
            start();
        }

        if (keyCode === 32) {
            checkMatch();
            setCurrInput('');
            setCurrWordIndex(currWordIndex + 1);
            setCurrCharIndex(-1);
        } else if(keyCode === 8){
            setCurrCharIndex(currCharIndex - 1);
            setCurrChar('')
        }
        else{
            setCurrCharIndex(currCharIndex + 1);
            setCurrChar(key)
        }
    }

    function checkMatch() {
        const wordToCompare = wordList[currWordIndex];
        const doesItMatch = wordToCompare === currInput.trim();
        const wordSpan = document.getElementById(`word${currWordIndex}`)

        if (doesItMatch) {

            wordSpan.setAttribute( 'class','word-background-success' )
            
            setCorrect((prevCorrect) => {
                return prevCorrect + 1
            })
            setTotalCharsTyped((prevTotalCharsTyped) => {
                return prevTotalCharsTyped + wordToCompare.length;
            })
        } else {
            wordSpan.setAttribute( 'class','word-background-danger' )
            setIncorrect((prevIncorrect) => {
                return prevIncorrect + 1;
            })
        }
    }



    function getCharClass(wordIdx, charIdx, char){
        if(wordIdx === currWordIndex && charIdx === currCharIndex && currChar){
            if(char === currChar){
                
                return "has-background-success"
            }
            else{
                return "has-background-danger"
            }
        } else if(wordIdx === currWordIndex && currCharIndex >= wordList[currWordIndex].length){
            return "has-background-danger"
        }
        else {
            return "";
        }
    }

    // function resetGame(){
    //     const correctWordSpanList = document.getElementsByClassName("word-background-success");
    //         const incorrectWordSpanList = document.getElementsByClassName("word-background-danger");
    //         for(let i =0; i < correctWordSpanList.length; i++){
    //             correctWordSpanList[i].classList.remove("word-background-success")
    //         }
    //         for(let k =0; k < incorrectWordSpanList.length; k++){
    //             incorrectWordSpanList[k].classList.remove("word-background-danger")
    //         }
    //         setStatus('waiting')
    // }

  const postScoreHandler = ()=> {
    //   setTotalScore({...totalScore, wpm: ((totalCharsTyped/5) * 2), accuracy: (correct / (incorrect + correct) * 100)})
      console.log(totalScore)
      axios.post("http://localhost:8000/api/typingscores", totalScore)
      .then(res => console.log(res))
      .catch(err => console.log(err))

  }


    return (
        <div className="container mt-5 d-flex flex-column justify-content-center align-items-center main">
           <h1>Speed Typing Test! Simply begin typing to start.</h1>

            <div className="countdown-box">

                <h1>{countdown}</h1>
            </div>


            

                <div className="container">
                    <div className="d-flex justify-content-center input-box">
                    <input disabled={status === "finished"} ref = {textInput} className="quote-input" id="quote-input" onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value)} autoFocus></input>

                    </div>
                   
                
                    
                    <div className="quote-display" id="quote-display">

                        {wordList.map((word, i) => {
                            return (
                                <span key={i} >
                                    <span id = {`word${i}`} className = "word">
                                        {word.split('').map((char, idx) => {
                                            return (
                                                <span className = {getCharClass(i, idx, char)} key={idx}>{char}</span>
                                            )
                                        })}
                                    </span>
                                    <span> </span>
                                </span>
                            )
                        })}
                    </div>

                    </div>
                
                    


             

            

            {/* <button onClick={start}>Start</button> */}
            {/* disabled={status !== "started"}  */}
            {/* className = {getCharClass(i, idx, char)} */}


            {status === "finished" && (
                <div>
                    <h3>Words per minute:</h3>
                    <h2>{(totalCharsTyped/5) * 2}</h2>
                    <h3>Accuracy:</h3>
                    <h2>{correct / (incorrect + correct) * 100}</h2>
                    <button onClick = {()=>start()}>Try Again!</button>
                    <br></br>
                    <label>Enter name and post score!</label>
                    <input type="text" onChange = {(e) => setTotalScore({...totalScore, name: e.target.value})}></input>
                    <button onClick = {() => postScoreHandler()}>Post Score</button>
                </div>
            )}

<Link to = "/leaderboard">Leaderboard</Link>

        </div>
    );
};

export default TypingBox;