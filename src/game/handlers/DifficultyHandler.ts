import Phaser from "phaser";
import { RoundHandler } from "./RoundHandler";
import { MessageHandler } from "./MessageHandler";
import {
  BALL_SPEED_INCREASE_RATIO,
  DIFFICULTY_INCREASE_INTERVAL,
  DIFFICULTY_INCREASE_MESSAGE_DURATION,
  DIFFICULTY_LEVELS,
} from "../gameConstants";

type DifficultyKey = keyof typeof DIFFICULTY_LEVELS;

export class DifficultyHandler {
  private scene: Phaser.Scene;
  private roundHandler: RoundHandler;
  private messageHandler: MessageHandler;
  private paddleHitCount: number = 0;
  private speedMultiplier: number = 1;
  private difficulty: DifficultyKey;

  constructor(
    scene: Phaser.Scene,
    roundHandler: RoundHandler,
    messageHandler: MessageHandler,
    difficulty: DifficultyKey = "NORMAL"
  ) {
    this.scene = scene;
    this.roundHandler = roundHandler;
    this.messageHandler = messageHandler;
    this.difficulty = difficulty;
  }

  /** Получаем активные настройки */
  public getSettings() {
    return DIFFICULTY_LEVELS[this.difficulty];
  }

  /** Применяем настройки к игроку, боту и мячу при старте */
  public applyInitialSettings(player: Phaser.Physics.Arcade.Image, opponent: Phaser.Physics.Arcade.Image) {
    const { PLAYER_SPEED, BOT_SPEED, BALL_SPEED } = this.getSettings();

    (player.body as Phaser.Physics.Arcade.Body).setMaxVelocity(PLAYER_SPEED, PLAYER_SPEED);
    (opponent.body as Phaser.Physics.Arcade.Body).setMaxVelocity(BOT_SPEED, BOT_SPEED);

    const ball = this.roundHandler.getBall();
    if (ball) {
      const body = ball.body as Phaser.Physics.Arcade.Body;
      body.setMaxVelocity(BALL_SPEED * 2, BALL_SPEED * 2); // запас сверху
    }

    console.log("[DifficultyHandler] Initial settings applied:", this.getSettings());
  }

  /** Регистрируем касание ракетки */
public registerPaddleHit() {
  this.paddleHitCount++;

  if (this.paddleHitCount % DIFFICULTY_INCREASE_INTERVAL === 0) {
    this.speedMultiplier *= BALL_SPEED_INCREASE_RATIO;
    this.applySpeedToBall();
    this.messageHandler.showMessage("🚀", DIFFICULTY_INCREASE_MESSAGE_DURATION);
  }

  const ball = this.roundHandler.getBall();
  const body = ball.body as Phaser.Physics.Arcade.Body;

  console.log(
    `[DifficultyHandler] Hit #${this.paddleHitCount} | Multiplier: ${this.speedMultiplier.toFixed(
      2
    )} | Current speed: ${Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2).toFixed(
      2
    )}`
  );
}


  /** Увеличиваем скорость мяча */
public applySpeedToBall() {
  const ball = this.roundHandler.getBall();
  if (!ball) return;

  const body = ball.body as Phaser.Physics.Arcade.Body;
  const angle = Math.atan2(body.velocity.y, body.velocity.x);

  const baseSpeed = this.getSettings().BALL_SPEED;
  const newSpeed = baseSpeed * this.speedMultiplier;

  body.velocity.x = newSpeed * Math.cos(angle);
  body.velocity.y = newSpeed * Math.sin(angle);

  console.log(
    `[DifficultyHandler] applySpeedToBall → base: ${baseSpeed}, multiplier: ${this.speedMultiplier.toFixed(
      2
    )}, final: ${newSpeed.toFixed(2)}`
  );
}

  public getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }

  public getDifficultyKey(): DifficultyKey {
    return this.difficulty;
  }
}
