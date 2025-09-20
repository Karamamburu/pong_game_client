import Phaser from "phaser";
import { createPlayer, createOpponent, createBall } from "./createObjects";
import { movePlayer, moveBot } from "./paddles";
import { addBallPaddleColliders } from "./ballCollisions";
import { checkGameOver } from "./gameOver";
import { PLAYER_SPEED } from "./constants";

export default function createPongScene(): Phaser.Scene {
  class PongScene extends Phaser.Scene {
    player!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    opponent!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    ball!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    messageText!: Phaser.GameObjects.Text;

    constructor() {
      super("PongScene");
    }

    create() {
      // Создание объектов
      this.player = createPlayer(this, 400);
      this.opponent = createOpponent(this, 400);
      this.ball = createBall(this);

      // Стартовое направление мяча
      const minAngle = -45;
      const maxAngle = 45;
      const angleDeg = Phaser.Math.Between(minAngle, maxAngle);
      const angleRad = Phaser.Math.DegToRad(angleDeg);
      const dirY = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
      this.ball.setVelocity(
        this.ball.body.speed * Math.sin(angleRad) || 200,
        (this.ball.body.speed || 200) * Math.cos(angleRad) * dirY
      );

      this.player.setCollideWorldBounds(true);
      this.opponent.setCollideWorldBounds(true);
      this.physics.world.setBoundsCollision(true, true, false, false);
      this.ball.setCollideWorldBounds(true);

      // Коллизии мяча с ракетками
      addBallPaddleColliders(this, this.ball, this.player, this.opponent);

      // Управление
      this.cursors = this.input.keyboard!.createCursorKeys();
      this.input.keyboard!.addKeys("A,D");

      // Сообщение о победе/поражении
      this.messageText = this.add
        .text(400, 300, "", { fontSize: "32px", color: "#fff" })
        .setOrigin(0.5);
    }

    update() {
      movePlayer(this.player, this.cursors, this.input.keyboard!.addKeys("A,D"));
      moveBot(this.opponent, this.ball);
      checkGameOver(this, this.ball, this.messageText);
    }
  }

  return new PongScene();
}
