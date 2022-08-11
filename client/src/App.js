import React from 'react'
import './App.css';
import { Routes, Route } from 'react-router-dom'
import TypingBox from './components/TypingBox'
import LeaderBoard from './components/LeaderBoard';


function App() {


  return (
   <div >
     <Routes>

     <Route path ="/" element={<TypingBox/>}></Route>

    <Route path = '/leaderboard' element = {<LeaderBoard/>}></Route>

     </Routes>

   </div>
   
 
 
  );
}

export default App;
