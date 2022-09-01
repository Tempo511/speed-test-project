import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom';

const LeaderBoard = () => {
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        axios.get("http://localhost:8000/api/typingscores")
            .then(leaderList => {
                const sortedList = leaderList.data.typingScores.sort((a, b) => b.wpm - a.wpm)
                setLeaderboard(sortedList);
                console.log(sortedList)
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <div>
            <Link to ="/">Home</Link>

            <h1>All Time Leaderboard</h1>
            <hr></hr>
            

            {leaderboard.map((score) => {
                return (
                    <div>
                        <h1>{score.name}</h1>
                        <h4>WPM: {score.wpm}</h4>
                        <h4>Accuracy: {score.accuracy}</h4>
                    </div>
                )

             
                    
            })}
        </div>
    );
};

export default LeaderBoard;