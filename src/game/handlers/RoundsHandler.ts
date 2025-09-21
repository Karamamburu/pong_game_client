import Phaser from "phaser";
import { BALL_SPEED, MIN_BALL_DIRECTION_ANGLE, MAX_BALL_DIRECTION_ANGLE, RESTART_DELAY } from "../gameConstants";

export class RoundHandler {
  private scene: Phaser.Scene;
  private ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  public isWaitingForRestart: boolean = false;

  constructor(scene: Phaser.Scene, ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
    this.scene = scene;
    this.ball = ball;
  }

  startNewRound() {
    this.isWaitingForRestart = false;
    
    // Сбрасываем мяч в центр
    this.ball.setPosition(this.scene.scale.width / 2, this.scene.scale.height / 2);
    this.ball.setVisible(true);

    // Рандомное стартовое направление мяча
    const minAngle = MIN_BALL_DIRECTION_ANGLE;
    const maxAngle = MAX_BALL_DIRECTION_ANGLE;
    const angleDeg = Phaser.Math.Between(minAngle, maxAngle);
    const angleRad = Phaser.Math.DegToRad(angleDeg);
    const dirY = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;

    this.ball.setVelocity(
      BALL_SPEED * Math.sin(angleRad),
      BALL_SPEED * Math.cos(angleRad) * dirY
    );
  }

  pauseRound() {
    this.isWaitingForRestart = true;
    this.ball.setVelocity(0, 0);
    this.ball.setVisible(false);
  }

  scheduleNextRound(callback: () => void) {
    this.scene.time.delayedCall(RESTART_DELAY, callback);
  }
}