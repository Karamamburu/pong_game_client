import Phaser from "phaser";
import { RoundHandler } from "./RoundHandler";
import { MessageHandler } from "./MessageHandler";
import { INITIAL_BALL_SPEED } from "../gameConstants";

export class DifficultyHandler {
  private scene: Phaser.Scene;
  private roundHandler: RoundHandler;
  private messageHandler: MessageHandler;
  private paddleHitCount: number = 0;
  private speedMultiplier: number = 1;

  constructor(
    scene: Phaser.Scene,
    roundHandler: RoundHandler,
    messageHandler: MessageHandler
  ) {
    this.scene = scene;
    this.roundHandler = roundHandler;
    this.messageHandler = messageHandler;
  }

  /** Регистрируем касание ракетки */
  public registerPaddleHit() {
    this.paddleHitCount++;

    if (this.paddleHitCount % 10 === 0) {
      this.speedMultiplier *= 1.05;
      this.applySpeedToBall();
      this.messageHandler.showMessage("🚀", 600);

    }
  }

  /** Увеличиваем скорость мяча */
  public applySpeedToBall() {
    const ball = this.roundHandler.getBall();
    if (!ball) return;

    const body = ball.body as Phaser.Physics.Arcade.Body;
    const angle = Math.atan2(body.velocity.y, body.velocity.x);
    const newSpeed = INITIAL_BALL_SPEED * this.speedMultiplier;

    body.velocity.x = newSpeed * Math.cos(angle);
    body.velocity.y = newSpeed * Math.sin(angle);

    console.log(`Мяч ускорен! Новая скорость: ${newSpeed.toFixed(2)}`);
  }

  public getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }
}
