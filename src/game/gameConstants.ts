//CANVAS_SETTINGS
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

//OBJECTS_SETTINGS
export const PLAYER_WIDTH = 100;
export const PLAYER_HEIGHT = 20;
export const OPPONENT_WIDTH = 100;
export const OPPONENT_HEIGHT = 20;
export const BALL_SIZE = 20;

//INITIAL_OBJECTS_POSITIONS
export const START_PLAYER_Y = GAME_HEIGHT - PLAYER_HEIGHT;
export const START_PLAYER_X = GAME_WIDTH / 2;
export const START_OPPONENT_Y = PLAYER_HEIGHT;
export const START_BALL_X = GAME_WIDTH / 2;
export const START_BALL_Y = GAME_HEIGHT / 2;

//OBJECTS_BEHAVIOUR
export const MIN_BALL_DIRECTION_ANGLE = -45;
export const MAX_BALL_DIRECTION_ANGLE = -5;
export const MAX_BOUNCE_DEG = 75;
export const PLAYER_SPEED = 300;
export const INITIAL_BALL_SPEED = 400;
export const BOT_SPEED = 200;

//ROUNDS_AND_WIN_SETTINGS
export const RESTART_DELAY = 1000;
export const WINNING_SCORE = 11;
export const TIE_BREAK_SCORE_DIFFERENCE = 2;
export const SPECIAL_SCORES = [
      { player1: 7, player2: 0 },
      { player1: 0, player2: 7 },
      { player1: 9, player2: 1 },
      { player1: 1, player2: 9 }
    ];

//MESSAGES
export const COUNTDOWN_VALUES = ["3", "2", "1", "Поехали!"];
export const DIFFICULTY_INCREASE_MESSAGE_DURATION = 600;

//DIFFICULTY_MANAGEMENT
export const BALL_SPEED_INCREASE_RATIO = 1.05;
export const DIFFICULTY_INCREASE_INTERVAL = 10;