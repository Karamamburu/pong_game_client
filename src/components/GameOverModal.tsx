import React from "react";

interface ModalProps {
  isOpen: boolean;
  message: string;
  touches: number;
  onRestart: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, touches, onRestart }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          color: "#000",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          minWidth: "300px",
        }}
      >
        <h2>{message}</h2>
        <p>Касаний ракеток: {touches}</p>
        <button
          onClick={onRestart}
          style={{ padding: "10px 20px", fontSize: "16px", marginTop: "10px" }}
        >
          Играть снова
        </button>
      </div>
    </div>
  );
};

export default Modal;
