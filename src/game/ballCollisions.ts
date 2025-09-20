import Phaser from "phaser";
import { BALL_SPEED } from "./constants";

export function addBallPaddleColliders(scene: Phaser.Scene, ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody, opponent: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {

  const maxRotation = Phaser.Math.DegToRad(15); // макс. наклон ракетки

  scene.physics.add.collider(ball, player, (ball, paddle) => {
    const relativeIntersectX = (ball.x - paddle.x) / paddle.displayWidth;
    const maxBounceAngle = Phaser.Math.DegToRad(60);
    const bounceAngle = relativeIntersectX * maxBounceAngle;

    ball.body.velocity.x = BALL_SPEED * Math.sin(bounceAngle);
    ball.body.velocity.y = -BALL_SPEED * Math.cos(bounceAngle);

    // наклон ракетки
    paddle.setRotation(relativeIntersectX * maxRotation);

    // мерцание
    scene.tweens.add({
      targets: paddle,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
    });

    // вернуть наклон обратно
    scene.tweens.add({
      targets: paddle,
      rotation: 0,
      duration: 150,
      ease: "Power2",
    });
  });

  scene.physics.add.collider(ball, opponent, (ball, paddle) => {
    const relativeIntersectX = (ball.x - paddle.x) / paddle.displayWidth;
    const maxBounceAngle = Phaser.Math.DegToRad(60);
    const bounceAngle = relativeIntersectX * maxBounceAngle;

    ball.body.velocity.x = BALL_SPEED * Math.sin(bounceAngle);
    ball.body.velocity.y = BALL_SPEED * Math.cos(bounceAngle);

    // наклон и мерцание для оппонента
    paddle.setRotation(relativeIntersectX * maxRotation);
    scene.tweens.add({
      targets: paddle,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
    });
    scene.tweens.add({
      targets: paddle,
      rotation: 0,
      duration: 150,
      ease: "Power2",
    });
  });
}
