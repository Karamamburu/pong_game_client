import Phaser from "phaser";
import { ObjectFactory } from "./handlers/ObjectFactory";
import { PaddleController } from "./handlers/PaddlesHandler";
import { CollisionHandler } from "./handlers/CollisionHandler";
import { ScoreHandler } from "./handlers/ScoreHandler";
import { RoundHandler } from "./handlers/RoundHandler";
import { GameStateHandler } from "./handlers/GameStateHandler";
import { MessageHandler } from "./handlers/MessageHandler";
import { DifficultyHandler } from "./handlers/DifficultyHandler";
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
    messageHandler!: MessageHandler;
    difficultyHandler!: DifficultyHandler;

    constructor() {
      super("PongScene");
    }

    create() {

      // Создаём объекты
      this.player = ObjectFactory.createPlayer(this, START_PLAYER_X);
      this.opponent = ObjectFactory.createOpponent(this, START_PLAYER_X);
      this.ball = ObjectFactory.createBall(this);

      // Инициализируем хендлеры
      this.gameStateHandler = new GameStateHandler();
      this.messageHandler = new MessageHandler(this);
      this.roundHandler = new RoundHandler(this, this.ball);
      this.difficultyHandler = new DifficultyHandler(this, this.roundHandler, this.messageHandler);
      this.gameStateHandler.reset();
      this.scoreHandler = new ScoreHandler(
        this,
        this.roundHandler,
        this.gameStateHandler,
        config,
        this.player,
        this.opponent
      );

      this.messageHandler.showCountdown(() => {
        this.roundHandler.startNewRound();
      });

      // Настройка физики
      this.player.setCollideWorldBounds(true);
      this.opponent.setCollideWorldBounds(true);
      this.physics.world.setBoundsCollision(true, true, false, false);
      this.ball.setCollideWorldBounds(true);

      // Коллизии мяча с ракетками
      CollisionHandler.addBallPaddleColliders(
        this,
        this.ball,
        this.player,
        this.opponent,
        {
          onTouch: () => {
            config.onTouch?.();
            this.difficultyHandler.registerPaddleHit();
          },
        }
      );

      // Управление
      this.cursors = this.input.keyboard!.createCursorKeys();
      this.input.keyboard!.addKeys("A,D");
    }

    update() {
      // Не обновляем игру если она завершена
      if (this.gameStateHandler.isGameOver) return;

      // Двигаем ракетки всегда
      PaddleController.movePlayer(this.player, this.cursors, this.input.keyboard!.addKeys("A,D"));

      // Бота двигаем только когда мяч активен
      if (!this.roundHandler.isWaitingForRestart) {
        PaddleController.moveBot(this.opponent, this.ball);
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