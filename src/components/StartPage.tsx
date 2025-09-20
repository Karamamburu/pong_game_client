import React from "react";
import { Link } from "react-router-dom";
import "./styles/StartPage.css";
import "../App.css";

const StartPage: React.FC = () => {
  return (
    <div className="start-page">
      <Link to="/game">
        <button className="regular-button">
          Начать игру
        </button>
      </Link>
    </div>
  );
};

export default StartPage;
