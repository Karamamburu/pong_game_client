import Phaser from "phaser";
import { createPlayer, createOpponent, createBall } from "./createObjects";
import { movePlayer, moveBot } from "./paddles";
import { addBallPaddleColliders } from "./ballCollisions";
import { checkGameOver } from "./gameOver";
import { BALL_SPEED } from "./constants";

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
    messageText!: Phaser.GameObjects.Text;
    isGameOver = false;

    constructor() {
      super("PongScene");
    }

    create() {
      this.isGameOver = false;
      // Создаём объекты
      this.player = createPlayer(this, 400);
      this.opponent = createOpponent(this, 400);
      this.ball = createBall(this);

      // --- Рандомное стартовое направление мяча ---
      const minAngle = -45;
      const maxAngle = 45;
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

      // Сообщение посередине (для отображения "Вы выиграли/проиграли")
      this.messageText = this.add
        .text(this.scale.width / 2, this.scale.height / 2, "", {
          fontSize: "32px",
          color: "#fff",
        })
        .setOrigin(0.5);

      // --- Коллизии мяча с ракетками (внешняя функция) ---
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
        this.messageText.setText(message);
        this.ball.setVelocity(0, 0);
        this.isGameOver = true;
        config.onGameOver?.(message);
      });
    }
  }

  return new PongScene();
}
