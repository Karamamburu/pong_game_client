import React from "react";
import { Link } from "react-router-dom";
import "./styles/GameOverModal.css";
import "../App.css";

interface ModalProps {
  isOpen: boolean;
  message: string;
  touches: number;
  difficultyLevel: string;
  onRestart: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  message,
  touches,
  difficultyLevel,
  onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <p>Касаний ракеток: {touches}</p>
        <p>Уровень сложности: {difficultyLevel}</p>
        <button onClick={onRestart} className="regular-button">
          Играть снова
        </button>
        <Link to="/">
          <button className="regular-button">В меню</button>
        </Link>
      </div>
    </div>
  );
};

export default Modal;
