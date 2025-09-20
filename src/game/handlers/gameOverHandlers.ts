import Phaser from "phaser";

export function checkPointScored(
  scene: Phaser.Scene,
  ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
  onPointScored: (scorer: 'player' | 'opponent') => void
) {
  const ballHeight = ball.displayHeight;
  
  // Если мяч ушел за нижнюю границу - очко противнику
  if (ball.y - ballHeight / 2 > scene.scale.height) {
    onPointScored('opponent');
    return true;
  }
  
  // Если мяч ушел за верхнюю границу - очко игроку
  if (ball.y + ballHeight / 2 < 0) {
    onPointScored('player');
    return true;
  }
  
  return false;
}