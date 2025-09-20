import React from "react";
import { Link } from "react-router-dom";

const StartPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <Link to="/game">
        <button style={{ padding: "10px 20px", fontSize: "18px" }}>
          Начать игру
        </button>
      </Link>
    </div>
  );
};

export default StartPage;
