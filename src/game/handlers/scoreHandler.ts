import Phaser from "phaser";

export class ScoreHandler {
  private scene: Phaser.Scene;
  private scoreTextTop: Phaser.GameObjects.Text;
  private scoreTextBottom: Phaser.GameObjects.Text;
  public playerScore: number = 0;
  public opponentScore: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    
    // Создаем текстовые элементы для счета
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

  showScoreTemporarily() {
    // Обновляем текст счета
    this.scoreTextTop.setText(this.opponentScore.toString());
    this.scoreTextBottom.setText(this.playerScore.toString());

    // Сбрасываем позицию и масштаб для анимации
    this.scoreTextTop.setScale(0.5).setAlpha(0);
    this.scoreTextBottom.setScale(0.5).setAlpha(0);

    // Анимация появления
    this.scene.tweens.add({
      targets: [this.scoreTextTop, this.scoreTextBottom],
      scale: 1,
      alpha: 1,
      duration: 200,
      ease: "Back.easeOut",
    });

    // Через 0.8 секунды начинаем скрывать
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

  reset() {
    this.playerScore = 0;
    this.opponentScore = 0;
  }

  incrementPlayer() {
    this.playerScore++;
  }

  incrementOpponent() {
    this.opponentScore++;
  }

  getScores() {
    return { player: this.playerScore, opponent: this.opponentScore };
  }
}