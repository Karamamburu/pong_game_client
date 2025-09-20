import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import createPongScene from "../game/createPongScene";

const PongGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

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
      scene: createPongScene(),
      parent: "game-container",
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="game-container" className="w-full h-full" />;
};

export default PongGame;
