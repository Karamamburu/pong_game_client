import Phaser from "phaser";
import {
  INITIAL_BALL_SPEED,
  MIN_BALL_DIRECTION_ANGLE,
  MAX_BALL_DIRECTION_ANGLE,
  RESTART_DELAY
} from "../gameConstants";

export class RoundHandler {
  private scene: Phaser.Scene;
  private ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  public isWaitingForRestart: boolean = false;

  constructor(scene: Phaser.Scene, ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
    this.scene = scene;
    this.ball = ball;

    // Убедимся, что мяч не летит сразу при создании сцены:
    // ставим его в центр и обнуляем скорость, но не скрываем (чтобы он был видим во время отсчёта).
    this.resetBallToCenter(true);
    this.pauseRound(false); // остановить, но оставить видимым
  }

  /** Центрируем мяч и опционально делаем видимым/скрытым */
  private resetBallToCenter(visible: boolean = true) {
    const cx = Math.round(this.scene.scale.width / 2);
    const cy = Math.round(this.scene.scale.height / 2);

    this.ball.setPosition(cx, cy);
    this.ball.setVisible(visible);

    // Безопасно обнуляем скорость (через body, если есть)
    if ((this.ball.body as Phaser.Physics.Arcade.Body | undefined)) {
      (this.ball.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    } else {
      this.ball.setVelocity(0, 0);
    }
  }

  /** Вычисляет стартовую скорость по заданным углам */
  private computeLaunchVelocity() {
    const minAngle = MIN_BALL_DIRECTION_ANGLE;
    const maxAngle = MAX_BALL_DIRECTION_ANGLE;
    const angleDeg = Phaser.Math.Between(minAngle, maxAngle);
    const angleRad = Phaser.Math.DegToRad(angleDeg);
    const dirY = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;

    const vx = INITIAL_BALL_SPEED * Math.sin(angleRad);
    const vy = INITIAL_BALL_SPEED * Math.cos(angleRad) * dirY;

    return { vx, vy };
  }

  /** Запускает новый раунд: центрирует мяч, делает видимым и задаёт скорость */
  public startNewRound() {
    this.isWaitingForRestart = false;

    // Центрируем и показываем мяч
    this.resetBallToCenter(true);

    // Вычисляем и применяем скорость
    const { vx, vy } = this.computeLaunchVelocity();

    // Через body.setVelocity если есть body, иначе через setVelocity
    if ((this.ball.body as Phaser.Physics.Arcade.Body | undefined)) {
      (this.ball.body as Phaser.Physics.Arcade.Body).setVelocity(vx, vy);
    } else {
      this.ball.setVelocity(vx, vy);
    }
  }

  /**
   * Пауза раунда — останавливаем мяч.
   * hideBall = true (по умолчанию) — скрываем мяч (используется при очке).
   * hideBall = false — останавливаем, но оставляем видимым (используется для отсчёта).
   */
  public pauseRound(hideBall: boolean = true) {
    this.isWaitingForRestart = true;

    if ((this.ball.body as Phaser.Physics.Arcade.Body | undefined)) {
      (this.ball.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    } else {
      this.ball.setVelocity(0, 0);
    }

    this.ball.setVisible(!hideBall ? true : false);
  }

  /** Планирование следующего раунда с задержкой */
  public scheduleNextRound(callback: () => void) {
    this.scene.time.delayedCall(RESTART_DELAY, callback);
  }
}
