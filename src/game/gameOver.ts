import Phaser from "phaser";
import { RESTART_DELAY } from "./constants";

export function checkGameOver(scene: Phaser.Scene, ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, messageText: Phaser.GameObjects.Text) {
  const ballHeight = ball.displayHeight;
  if (ball.y - ballHeight / 2 > scene.scale.height) {
    messageText.setText("Вы проиграли!");
    ball.setVelocity(0, 0);
    scene.time.delayedCall(RESTART_DELAY, () => scene.scene.restart());
  }
  if (ball.y + ballHeight / 2 < 0) {
    messageText.setText("Вы выиграли!");
    ball.setVelocity(0, 0);
    scene.time.delayedCall(RESTART_DELAY, () => scene.scene.restart());
  }
}
