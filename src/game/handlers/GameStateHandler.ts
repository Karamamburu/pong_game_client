import { WINNING_SCORE } from "../gameConstants";

export class GameStateHandler {
  public isGameOver: boolean = false;

  checkPointScored(
    scene: Phaser.Scene,
    ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  ): 'player' | 'opponent' | null {
    const ballHeight = ball.displayHeight;
    
    // Если мяч ушел за нижнюю границу - очко противнику
    if (ball.y - ballHeight / 2 > scene.scale.height) {
      return 'opponent';
    }
    
    // Если мяч ушел за верхнюю границу - очко игроку
    if (ball.y + ballHeight / 2 < 0) {
      return 'player';
    }
    
    return null;
  }

  checkGameOver(
    playerScore: number,
    opponentScore: number
  ): { isOver: boolean; message: string } {
    if (playerScore >= WINNING_SCORE || opponentScore >= WINNING_SCORE) {
      this.isGameOver = true;
      const message = playerScore >= WINNING_SCORE
        ? "Вы выиграли матч!"
        : "Вы проиграли матч!";
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