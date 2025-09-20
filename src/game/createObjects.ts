import Phaser from "phaser";
import {
  PLAYER_WIDTH, PLAYER_HEIGHT,
  OPPONENT_WIDTH, OPPONENT_HEIGHT,
  BALL_SIZE, BALL_SPEED,
  START_PLAYER_Y, START_OPPONENT_Y, START_BALL_X, START_BALL_Y
} from "./constants";

export function createPlayer(scene: Phaser.Scene, x: number) {
  return scene.physics.add.image(x, START_PLAYER_Y, "")
    .setDisplaySize(PLAYER_WIDTH, PLAYER_HEIGHT)
    .setImmovable(true);
}

export function createOpponent(scene: Phaser.Scene, x: number) {
  return scene.physics.add.image(x, START_OPPONENT_Y, "")
    .setDisplaySize(OPPONENT_WIDTH, OPPONENT_HEIGHT)
    .setImmovable(true);
}

export function createBall(scene: Phaser.Scene) {
  return scene.physics.add.image(START_BALL_X, START_BALL_Y, "")
    .setDisplaySize(BALL_SIZE, BALL_SIZE)
    .setBounce(1, 1)
    .setVelocity(BALL_SPEED, BALL_SPEED);
}
