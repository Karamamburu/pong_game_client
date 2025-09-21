import Phaser from "phaser";
import { PLAYER_SPEED, BOT_SPEED } from "../gameConstants";

export class PaddleController {
  public static movePlayer(
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    keys: any
  ): void {
    if (cursors.left?.isDown || keys.A?.isDown) {
      player.setVelocityX(-PLAYER_SPEED);
    } else if (cursors.right?.isDown || keys.D?.isDown) {
      player.setVelocityX(PLAYER_SPEED);
    } else {
      player.setVelocityX(0);
    }
  }

  public static moveBot(
    opponent: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  ): void {
    const diff = ball.x - opponent.x;
    opponent.setVelocityX(Math.abs(diff) > 10 ? (diff > 0 ? BOT_SPEED : -BOT_SPEED) : 0);
  }
}