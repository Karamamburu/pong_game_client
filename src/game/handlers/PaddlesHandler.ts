import Phaser from "phaser";

export class PaddleController {
  public static movePlayer(
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    keys: any,
    speed: number
  ): void {
    if (cursors.left?.isDown || keys.A?.isDown) {
      player.setVelocityX(-speed);
    } else if (cursors.right?.isDown || keys.D?.isDown) {
      player.setVelocityX(speed);
    } else {
      player.setVelocityX(0);
    }
  }

  public static moveBot(
    opponent: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    speed: number
  ): void {
    const diff = ball.x - opponent.x;
    opponent.setVelocityX(Math.abs(diff) > 10 ? (diff > 0 ? speed : -speed) : 0);
  }
}
