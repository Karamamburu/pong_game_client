import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import createPongScene from "../game/createPongScene";
import Modal from "./GameOverModal";

const PongGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  const [isGameOver, setIsGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [touches, setTouches] = useState(0);

  useEffect(() => {
    if (gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: { debug: false },
      },
      scene: createPongScene({
        onGameOver: (message: string) => {
          setResultMessage(message);
          setIsGameOver(true);
        },
        onTouch: () => {
          setTouches((prev) => prev + 1);
        },
      }),
      parent: "game-container",
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const restartGame = () => {
    setTouches(0);
    setIsGameOver(false);
    gameRef.current?.scene.keys["PongScene"].scene.restart();
  };

  return (
    <div style={{ position: "relative" }}>
      <div id="game-container" className="w-full h-full" />
      <div style={{ position: "absolute", top: 10, left: 10, color: "#fff" }}>
        Касаний: {touches}
      </div>
      <Modal
        isOpen={isGameOver}
        message={resultMessage}
        touches={touches}
        onRestart={restartGame}
      />
    </div>
  );
};

export default PongGame;
