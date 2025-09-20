import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import createPongScene from "../game/createPongScene";
import Modal from "./GameOverModal";
import { GAME_HEIGHT, GAME_WIDTH } from "../game/gameConstants";
import "./styles/PongGame.css";

const PongGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  const [isGameOver, setIsGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [touches, setTouches] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  useEffect(() => {
    if (gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
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
        onScoreUpdate: (player: number, opponent: number) => {
          setPlayerScore(player);
          setOpponentScore(opponent);
        }
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
    setPlayerScore(0);
    setOpponentScore(0);
    setIsGameOver(false);
    gameRef.current?.scene.keys["PongScene"].scene.restart();
  };

  return (
    <div style={{ position: "relative" }}>
      <div id="game-container" className="w-full h-full" />
      <div style={{ 
        position: "absolute", 
        top: 10, 
        left: 10, 
        color: "#fff",
        fontSize: "18px",
        fontFamily: "Arial",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: "5px 10px",
        borderRadius: "5px"
      }}>
        <div>Счёт: {playerScore} - {opponentScore}</div>
        <div>Касаний: {touches}</div>
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