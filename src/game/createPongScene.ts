import Phaser from "phaser";
import { createPlayer, createOpponent, createBall } from "./handlers/createObjectsHandlers";
import { movePlayer, moveBot } from "./handlers/paddlesHandlers";
import { addBallPaddleColliders } from "./handlers/ballCollisionsHandlers";
import { checkGameOver } from "./handlers/gameOverHandlers";
import { BALL_SPEED, START_PLAYER_X, MIN_BALL_DIRECTION_ANGLE, MAX_BALL_DIRECTION_ANGLE } from "./gameConstants";

interface SceneConfig {
  onGameOver?: (message: string) => void;
  onTouch?: () => void;
}

export default function createPongScene(config: SceneConfig = {}): Phaser.Scene {
  class PongScene extends Phaser.Scene {
    player!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    opponent!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    ball!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    isGameOver = false;

    constructor() {
      super("PongScene");
    }

    create() {
      this.isGameOver = false;
      // Создаём объекты
      this.player = createPlayer(this, START_PLAYER_X);
      this.opponent = createOpponent(this, START_PLAYER_X);
      this.ball = createBall(this);

      // --- Рандомное стартовое направление мяча ---
      const minAngle = MIN_BALL_DIRECTION_ANGLE;
      const maxAngle = MAX_BALL_DIRECTION_ANGLE;
      const angleDeg = Phaser.Math.Between(minAngle, maxAngle);
      const angleRad = Phaser.Math.DegToRad(angleDeg);
      const dirY = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
      this.ball.setVelocity(
        (BALL_SPEED || 200) * Math.sin(angleRad),
        (BALL_SPEED || 200) * Math.cos(angleRad) * dirY
      );

      this.player.setCollideWorldBounds(true);
      this.opponent.setCollideWorldBounds(true);
      this.physics.world.setBoundsCollision(true, true, false, false);
      this.ball.setCollideWorldBounds(true);

      // --- Коллизии мяча с ракетками ---
      addBallPaddleColliders(this, this.ball, this.player, this.opponent, {
        onTouch: () => {
          config.onTouch?.();
        },
      });

      // Управление
      this.cursors = this.input.keyboard!.createCursorKeys();
      this.input.keyboard!.addKeys("A,D");
    }

    update() {
      if (this.isGameOver) return;
      
      movePlayer(this.player, this.cursors, this.input.keyboard!.addKeys("A,D"));
      moveBot(this.opponent, this.ball);

      // Проверка конца игры — если есть результат, показываем текст и вызываем callback
      checkGameOver(this, this.ball, (message: string) => {
        this.ball.setVelocity(0, 0);
        this.player.setVelocity(0);
        this.opponent.setVelocity(0);
        this.isGameOver = true;
        config.onGameOver?.(message);
      });
    }
  }

  return new PongScene();
}
