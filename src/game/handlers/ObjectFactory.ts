import Phaser from "phaser";
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  OPPONENT_WIDTH,
  OPPONENT_HEIGHT,
  BALL_SIZE,
  START_PLAYER_Y,
  START_OPPONENT_Y,
  START_BALL_X,
  START_BALL_Y
} from "../gameConstants";

export class ObjectFactory {
  public static createPlayer(
    scene: Phaser.Scene,
    x: number
  ): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
    return scene.physics.add.image(x, START_PLAYER_Y, "")
      .setDisplaySize(PLAYER_WIDTH, PLAYER_HEIGHT)
      .setImmovable(true);
  }

  public static createOpponent(
    scene: Phaser.Scene,
    x: number
  ): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
    return scene.physics.add.image(x, START_OPPONENT_Y, "")
      .setDisplaySize(OPPONENT_WIDTH, OPPONENT_HEIGHT)
      .setImmovable(true);
  }

  public static createBall(
    scene: Phaser.Scene
  ): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
    return scene.physics.add.image(START_BALL_X, START_BALL_Y, "")
      .setDisplaySize(BALL_SIZE, BALL_SIZE)
      .setBounce(1, 1)
  }
}