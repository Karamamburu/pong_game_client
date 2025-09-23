import Phaser from "phaser";
import { COUNTDOWN_VALUES } from '../gameConstants'

export class MessageHandler {
  private scene: Phaser.Scene;
  private messageText: Phaser.GameObjects.Text;

  private scoreTextTop: Phaser.GameObjects.Text;
  private scoreTextBottom: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Центрированное сообщение
    this.messageText = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2 - 100,
      "",
      {
        fontSize: "64px",
        color: "#fff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 4,
      }
    )
    .setOrigin(0.5)
    .setAlpha(0)
    .setDepth(1000);

    // Текст счёта сверху (соперник)
    this.scoreTextTop = scene.add
      .text(scene.scale.width / 2, 100, "0", {
        fontSize: "48px",
        color: "#fff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Текст счёта снизу (игрок)
    this.scoreTextBottom = scene.add
      .text(scene.scale.width / 2, scene.scale.height - 100, "0", {
        fontSize: "48px",
        color: "#fff",
        fontFamily: "Arial",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0);
  }

  /** Одноразовое сообщение в центре */
  public showMessage(message: string, duration: number = 1000) {
    this.messageText.setText(message);
    this.messageText.setAlpha(0).setScale(0.5);

    this.scene.tweens.add({
      targets: this.messageText,
      alpha: 1,
      scale: 1,
      duration: 200,
      ease: "Back.easeOut",
    });

    this.scene.time.delayedCall(duration, () => {
      this.scene.tweens.add({
        targets: this.messageText,
        alpha: 0,
        scale: 0.5,
        duration: 200,
        ease: "Power2",
      });
    });
  }

  /** Показать счет (с анимацией) */
  public showScore(playerScore: number, opponentScore: number) {
    this.scoreTextTop.setText(opponentScore.toString());
    this.scoreTextBottom.setText(playerScore.toString());

    this.scoreTextTop.setScale(0.5).setAlpha(0);
    this.scoreTextBottom.setScale(0.5).setAlpha(0);

    this.scene.tweens.add({
      targets: [this.scoreTextTop, this.scoreTextBottom],
      scale: 1,
      alpha: 1,
      duration: 200,
      ease: "Back.easeOut",
    });

    this.scene.time.delayedCall(800, () => {
      this.scene.tweens.add({
        targets: [this.scoreTextTop, this.scoreTextBottom],
        alpha: 0,
        scale: 0.5,
        duration: 200,
        ease: "Power2",
      });
    });
  }

  public showCountdown(onComplete: () => void) {
    const countdownValues = ["3", "2", "1", "Поехали!"];
    let index = 0;

    const showNext = () => {
      if (index >= countdownValues.length) {
        // обратный отсчёт закончился → запускаем колбэк
        onComplete();
        return;
      }

      this.messageText.setText(countdownValues[index]);
      this.messageText.setAlpha(0).setScale(0.5);

      this.scene.tweens.add({
        targets: this.messageText,
        alpha: 1,
        scale: 1,
        duration: 150,
        ease: "Back.easeOut",
        onComplete: () => {
          this.scene.time.delayedCall(500, () => {
            this.scene.tweens.add({
              targets: this.messageText,
              alpha: 0,
              scale: 0.5,
              duration: 150,
              ease: "Power2",
              onComplete: () => {
                index++;
                showNext();
              },
            });
          });
        },
      });
    };

    showNext();
  }
}
