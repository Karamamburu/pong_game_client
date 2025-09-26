export interface SceneInterface {
  onGameOver?: (message: string) => void;
  onTouch?: () => void;
  onScoreUpdate?: (playerScore: number, opponentScore: number) => void;
}
