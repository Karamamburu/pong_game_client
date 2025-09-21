import Phaser from "phaser";
import { BALL_SPEED, MAX_BOUNCE_DEG } from "../gameConstants";

interface CollisionCallbacks {
  onTouch?: () => void;
}

export class CollisionHandler {
  public static addBallPaddleColliders(
    scene: Phaser.Scene,
    ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    opponent: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    callbacks?: CollisionCallbacks
  ): void {
    const maxBounceDeg = MAX_BOUNCE_DEG;
    const maxBounceRad = Phaser.Math.DegToRad(maxBounceDeg);

    const handleHit = (
      paddle: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
      isPlayer: boolean
    ) => {
      // вычисляем точку попадания по X относительно центра ракетки
      const relativeIntersectX = ball.x - paddle.x;
      const halfWidth = paddle.displayWidth / 2;
      const normalized = Phaser.Math.Clamp(relativeIntersectX / halfWidth, -1, 1);

      // мапим на угол отскока (в радианах)
      const bounceAngle = normalized * maxBounceRad;

      // сохраняем/определяем скорость (не даём нулевой)
      const currentSpeed =
        BALL_SPEED ||
        Math.sqrt(
          (ball.body.velocity.x || 0) * (ball.body.velocity.x || 0) +
            (ball.body.velocity.y || 0) * (ball.body.velocity.y || 0)
        ) ||
        200;

      // вычисляем новые скорости по X/Y
      const vx = currentSpeed * Math.sin(bounceAngle);
      const vy = currentSpeed * Math.cos(bounceAngle) * (isPlayer ? -1 : 1);

      // корректируем позицию мяча, чтобы он не "застревал" в ракетке
      if (isPlayer) {
        ball.y = paddle.y - paddle.displayHeight / 2 - ball.displayHeight / 2 - 1;
      } else {
        ball.y = paddle.y + paddle.displayHeight / 2 + ball.displayHeight / 2 + 1;
      }

      ball.setVelocity(vx, vy);

      // отклонение ракетки: небольшой наклон по углу и возврат
      scene.tweens.killTweensOf(paddle);
      scene.tweens.add({
        targets: paddle,
        angle: normalized * 15, // наклон в зависимости от точки попадания
        duration: 100,
        yoyo: true,
        ease: "Sine.easeOut",
      });

      // небольшая случайная поправка по X чтобы избежать зацикливания (опционально)
      const spinVariation = Phaser.Math.FloatBetween(-0.03, 0.03) * currentSpeed;
      ball.setVelocity(ball.body.velocity.x + spinVariation, ball.body.velocity.y);

      // callback для счётчика касаний
      callbacks?.onTouch?.();
    };

    scene.physics.add.collider(ball, player, () => handleHit(player, true));
    scene.physics.add.collider(ball, opponent, () => handleHit(opponent, false));
  }
}