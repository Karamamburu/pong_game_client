import Phaser from "phaser";
import { RoundHandler } from "./RoundHandler";
import { GameStateHandler } from "./GameStateHandler";
import { SceneInterface } from "../configs/SceneInterface";

export class ScoreHandler {
  private scene: Phaser.Scene;
  private scoreTextTop: Phaser.GameObjects.Text;
  private scoreTextBottom: Phaser.GameObjects.Text;
  public playerScore: number = 0;
  public opponentScore: number = 0;

  private roundHandler: RoundHandler;
  private gameStateHandler: GameStateHandler;
  private config: SceneInterface;
  private player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private opponent: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  constructor(
    scene: Phaser.Scene,
    roundHandler: RoundHandler,
    gameStateHandler: GameStateHandler,
    config: SceneInterface,
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    opponent: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  ) {
    this.scene = scene;
    this.roundHandler = roundHandler;
    this.gameStateHandler = gameStateHandler;
    this.config = config;
    this.player = player;
    this.opponent = opponent;
    
    // Создаем текстовые элементы для счета
    this.scoreTextTop = scene.add
      .text(scene.scale.width / 2, 100, "0", {
        fontSize: "48px",
        color: "#fff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.scoreTextBottom = scene.add
      .text(scene.scale.width / 2, scene.scale.height - 100, "0", {
        fontSize: "48px",
        color: "#fff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0);
  }

  handlePointScored(scorer: "player" | "opponent") {
    // Приостанавливаем текущий раунд
    this.roundHandler.pauseRound();

    // Обновляем счет
    if (scorer === "player") {
      this.incrementPlayer();
    } else {
      this.incrementOpponent();
    }

    // Обновляем счет в React компоненте
    this.config.onScoreUpdate?.(this.playerScore, this.opponentScore);

    (this.scene as any).messageHandler.showScore(this.playerScore, this.opponentScore);

    // Проверяем конец игры
    const gameOverCheck = this.gameStateHandler.checkGameOver(
      this.playerScore, 
      this.opponentScore
    );

    if (gameOverCheck.isOver) {
      // Завершаем игру
      this.handleGameOver(gameOverCheck.message);
    } else {
      // Запускаем следующий раунд через 1 секунду
      this.roundHandler.scheduleNextRound(() => {
        this.roundHandler.startNewRound();
      });
    }
  }

  private handleGameOver(message: string) {
    this.player.setVelocity(0);
    this.opponent.setVelocity(0);
    this.config.onGameOver?.(message);
  }

  reset() {
    this.playerScore = 0;
    this.opponentScore = 0;
  }

  incrementPlayer() {
    this.playerScore++;
  }

  incrementOpponent() {
    this.opponentScore++;
  }

  getScores() {
    return { player: this.playerScore, opponent: this.opponentScore };
  }
}