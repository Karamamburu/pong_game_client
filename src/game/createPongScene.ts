import Phaser from "phaser";
import { createPlayer, createOpponent, createBall } from "./handlers/createObjectsHandlers";
import { movePlayer, moveBot } from "./handlers/paddlesHandlers";
import { addBallPaddleColliders } from "./handlers/ballCollisionsHandlers";
import { ScoreHandler } from "./handlers/scoreHandler";
import { RoundHandler } from "./handlers/roundHandler";
import { GameStateHandler } from "./handlers/GameStateHandler";
import { START_PLAYER_X } from "./gameConstants";

interface SceneConfig {
  onGameOver?: (message: string) => void;
  onTouch?: () => void;
  onScoreUpdate?: (playerScore: number, opponentScore: number) => void;
}

export default function createPongScene(config: SceneConfig = {}): Phaser.Scene {
  class PongScene extends Phaser.Scene {
    player!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    opponent!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    ball!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    
    // Хендлеры
    scoreHandler!: ScoreHandler;
    roundHandler!: RoundHandler;
    gameStateHandler!: GameStateHandler;

    constructor() {
      super("PongScene");
    }

    create() {
      // Инициализируем хендлеры
      this.gameStateHandler = new GameStateHandler();
      this.gameStateHandler.reset();

      // Создаём объекты
      this.player = createPlayer(this, START_PLAYER_X);
      this.opponent = createOpponent(this, START_PLAYER_X);
      this.ball = createBall(this);

      // Инициализируем RoundHandler
      this.roundHandler = new RoundHandler(this, this.ball);

      // Инициализируем ScoreHandler с зависимостями
      this.scoreHandler = new ScoreHandler(
        this,
        this.roundHandler,
        this.gameStateHandler,
        config,
        this.player,
        this.opponent
      );

      // Начинаем первый раунд
      this.roundHandler.startNewRound();

      // Настройка физики
      this.player.setCollideWorldBounds(true);
      this.opponent.setCollideWorldBounds(true);
      this.physics.world.setBoundsCollision(true, true, false, false);
      this.ball.setCollideWorldBounds(true);

      // Коллизии мяча с ракетками
      addBallPaddleColliders(this, this.ball, this.player, this.opponent, {
        onTouch: () => config.onTouch?.(),
      });

      // Управление
      this.cursors = this.input.keyboard!.createCursorKeys();
      this.input.keyboard!.addKeys("A,D");
    }

    update() {
      // Не обновляем игру если она завершена
      if (this.gameStateHandler.isGameOver) return;

      // Двигаем ракетки всегда
      movePlayer(this.player, this.cursors, this.input.keyboard!.addKeys("A,D"));

      // Бота двигаем только когда мяч активен
      if (!this.roundHandler.isWaitingForRestart) {
        moveBot(this.opponent, this.ball);
      }

      // Проверяем очки только когда мяч активен
      if (!this.roundHandler.isWaitingForRestart) {
        const scorer = this.gameStateHandler.checkPointScored(this, this.ball);
        if (scorer) {
          this.scoreHandler.handlePointScored(scorer);
        }
      }
    }
  }

  return new PongScene();
}