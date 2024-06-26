
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Home from "./Home"
import Questions from "./Questions"

function App() {
  
  const [questions, setQuestions] = useState([]);

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home setQuestions = {setQuestions} />} />
        <Route path="/mock-test" exact element={<Questions questions = {questions} />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;