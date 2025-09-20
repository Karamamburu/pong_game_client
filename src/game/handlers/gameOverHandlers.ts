import Phaser from "phaser";
import { RESTART_DELAY } from "../gameConstants";

export function checkGameOver(
  scene: Phaser.Scene,
  ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
  onGameOver: (message: string) => void
) {
  const ballHeight = ball.displayHeight;
  if (ball.y - ballHeight / 2 > scene.scale.height) {
    onGameOver("Вы проиграли!");
    ball.setVelocity(0, 0);
    scene.time.delayedCall(RESTART_DELAY, () => {});
  }
  if (ball.y + ballHeight / 2 < 0) {
    onGameOver("Вы выиграли!");
    ball.setVelocity(0, 0);
    scene.time.delayedCall(RESTART_DELAY, () => {});
  }
}
