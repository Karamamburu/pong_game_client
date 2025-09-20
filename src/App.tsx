import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PongGame from "./components/PongGame";
import StartPage from "./components/StartPage";

function App() {
  return (
    <Router>
      <div className="App">
        <h1 style={{ textAlign: "center" }}>Pong Game</h1>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/game" element={<PongGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
