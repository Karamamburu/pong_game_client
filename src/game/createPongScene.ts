import Phaser from "phaser";
import { createPlayer, createOpponent, createBall } from "./handlers/createObjectsHandlers";
import { movePlayer, moveBot } from "./handlers/paddlesHandlers";
import { addBallPaddleColliders } from "./handlers/ballCollisionsHandlers";
import { checkPointScored } from "./handlers/gameOverHandlers";
import { BALL_SPEED, START_PLAYER_X, MIN_BALL_DIRECTION_ANGLE, MAX_BALL_DIRECTION_ANGLE, WINNING_SCORE } from "./gameConstants";

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
    isGameOver = false;
    playerScore = 0;
    opponentScore = 0;
    isWaitingForRestart = false;

    constructor() {
      super("PongScene");
    }

    create() {
      this.isGameOver = false;
      this.isWaitingForRestart = false;
      this.playerScore = 0;
      this.opponentScore = 0;
      
      // Создаём объекты
      this.player = createPlayer(this, START_PLAYER_X);
      this.opponent = createOpponent(this, START_PLAYER_X);
      this.ball = createBall(this);

      this.startNewRound();

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

    startNewRound() {
      // Сбрасываем мяч в центр
      this.ball.setPosition(this.scale.width / 2, this.scale.height / 2);
      this.ball.setVisible(true);
      
      // Рандомное стартовое направление мяча
      const minAngle = MIN_BALL_DIRECTION_ANGLE;
      const maxAngle = MAX_BALL_DIRECTION_ANGLE;
      const angleDeg = Phaser.Math.Between(minAngle, maxAngle);
      const angleRad = Phaser.Math.DegToRad(angleDeg);
      const dirY = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
      
      this.ball.setVelocity(
        (BALL_SPEED || 200) * Math.sin(angleRad),
        (BALL_SPEED || 200) * Math.cos(angleRad) * dirY
      );
    }

    update() {
      if (this.isGameOver) return;
      
      // Двигаем ракетки всегда, даже во время ожидания следующего раунда
      movePlayer(this.player, this.cursors, this.input.keyboard!.addKeys("A,D"));
      
      // Бота двигаем только когда мяч активен (не во время ожидания)
      if (!this.isWaitingForRestart) {
        moveBot(this.opponent, this.ball);
      }

      // Проверяем очки только когда мяч активен
      if (!this.isWaitingForRestart) {
        checkPointScored(this, this.ball, (scorer: 'player' | 'opponent') => {
          this.isWaitingForRestart = true;
          this.ball.setVelocity(0, 0);
          this.ball.setVisible(false); // Скрываем мяч во время ожидания
          
          if (scorer === 'player') {
            this.playerScore++;
          } else {
            this.opponentScore++;
          }
          
          // Обновляем счет в React компоненте
          config.onScoreUpdate?.(this.playerScore, this.opponentScore);
          
          // Проверяем, не достиг ли кто-то победного счета
          if (this.playerScore >= WINNING_SCORE || this.opponentScore >= WINNING_SCORE) {
            this.isGameOver = true;
            const message = this.playerScore >= WINNING_SCORE 
              ? "Вы выиграли матч!" 
              : "Вы проиграли матч!";
            config.onGameOver?.(message);
          } else {
            // Запускаем новый раунд через 1 секунду
            this.time.delayedCall(1000, () => {
              this.isWaitingForRestart = false;
              this.startNewRound();
            });
          }
        });
      }
    }
  }

  return new PongScene();
}