import React from "react";
import "./styles/GameOverModal.css";
import "../App.css";

interface ModalProps {
  isOpen: boolean;
  message: string;
  touches: number;
  onRestart: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, touches, onRestart }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <p>Касаний ракеток: {touches}</p>
        <button
          onClick={onRestart}
          className="regular-button"
        >
          Играть снова
        </button>
      </div>
    </div>
  );
};

export default Modal;
