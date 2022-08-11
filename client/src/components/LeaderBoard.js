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

                        // <div className="d-flex" key={pirate._id}>
                        //     <img src={pirate.imageURL} alt={`image of ${pirate.name}`}/>
                        //     <div>
                        //         <h3>{pirate.name}</h3>
                        //         <Link to={`/pirates/${pirate._id}`}>View Pirate</Link>
                        //         <button className="btn btn-danger" onClick = {()=>deleteHandler(pirate._id)}>Walk the Plank</button>
                        //     </div>
                        // </div>
                    
            })}
        </div>
    );
};

export default LeaderBoard;