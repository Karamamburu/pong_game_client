import {
  SPECIAL_SCORES,
  WINNING_SCORE,
  TIE_BREAK_SCORE_DIFFERENCE,
} from "../gameConstants";

export class GameStateHandler {
  public isGameOver: boolean = false;

  checkPointScored(
    scene: Phaser.Scene,
    ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  ): "player" | "opponent" | null {
    const ballHeight = ball.displayHeight;

    // Если мяч ушел за нижнюю границу - очко противнику
    if (ball.y - ballHeight / 2 > scene.scale.height) {
      return "opponent";
    }

    // Если мяч ушел за верхнюю границу - очко игроку
    if (ball.y + ballHeight / 2 < 0) {
      return "player";
    }

    return null;
  }

  checkGameOver(
    playerScore: number,
    opponentScore: number
  ): { isOver: boolean; message: string } {
    const scoreDifference = Math.abs(playerScore - opponentScore);

    // Функция для создания сообщения
    const getResultMessage = (isWin: boolean) => {
      if (isWin) {
        return `Вы выиграли матч со счётом ${playerScore}:${opponentScore}!`;
      } else {
        return `Вы проиграли матч со счётом ${playerScore}:${opponentScore} :(`;
      }
    };

    for (const score of SPECIAL_SCORES) {
      if (playerScore === score.player1 && opponentScore === score.player2) {
        this.isGameOver = true;
        const message = getResultMessage(playerScore > opponentScore);
        return { isOver: true, message };
      }
    }

    // Стандартное завершение
    const maxScore = Math.max(playerScore, opponentScore);
    if (
      maxScore >= WINNING_SCORE &&
      scoreDifference >= TIE_BREAK_SCORE_DIFFERENCE
    ) {
      this.isGameOver = true;
      const message = getResultMessage(playerScore > opponentScore);
      return { isOver: true, message };
    }

    return { isOver: false, message: "" };
  }

  handleGameOver(
    player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    opponent: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    message: string,
    onGameOverCallback?: (message: string) => void
  ) {
    player.setVelocity(0);
    opponent.setVelocity(0);
    onGameOverCallback?.(message);
  }

  reset() {
    this.isGameOver = false;
  }
}
