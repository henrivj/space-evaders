import Game from "./models/Game.js";
import Renderer from "./models/Renderer.js";
import Level from "./models/Level.js";
import Cluster from "./models/Cluster.js";

import Spaceship from "./models/entities/Spaceship.js";
import Asteroid from "./models/entities/Asteroid.js";
import Star from "./models/entities/Star.js";

export const canvas = document.getElementById("canvas");
export const context = canvas.getContext("2d");

const keysPressed = {};
document.addEventListener("keydown", (e) => (keysPressed[e.key] = true));
document.addEventListener("keyup", (e) => (keysPressed[e.key] = false));

const PLAYER_SPEED = 6;
const PLAYER_SIZE = 50;
const PLAYER1_Y_RATIO = 1 / 3;
const PLAYER2_Y_RATIO = 2 / 3;

const LEVEL1_SCORE_GOAL = 2500;
const LEVEL2_SCORE_GOAL = 5000;
const LEVEL3_SCORE_GOAL = 10000;

const LEVEL1_AST_COUNT = 16;
const LEVEL1_AST_MIN_SPEED = 5;
const LEVEL1_AST_MAX_SPEED = 7;
const LEVEL1_AST_MIN_SIZE = 30;
const LEVEL1_AST_MAX_SIZE = 50;

const LEVEL2_AST_COUNT = 20;
const LEVEL2_AST_MIN_SPEED = 4.5;
const LEVEL2_AST_MAX_SPEED = 6;
const LEVEL2_AST_MIN_SIZE = 40;
const LEVEL2_AST_MAX_SIZE = 75;

const LEVEL3_AST_COUNT = 22;
const LEVEL3_AST_MIN_SPEED = 5.5;
const LEVEL3_AST_MAX_SPEED = 8;
const LEVEL3_AST_MIN_SIZE = 50;
const LEVEL3_AST_MAX_SIZE = 100;

const AST_SPAWN_OFFSET = 2;

const LEVEL1_STAR_COUNT = 1;
const LEVEL1_STAR_MIN_SPEED = 1.2;
const LEVEL1_STAR_MAX_SPEED = 2;
const LEVEL1_STAR_MIN_SIZE = 25;
const LEVEL1_STAR_MAX_SIZE = 30;

const LEVEL2_STAR_COUNT = 2;
const LEVEL2_STAR_MIN_SPEED = 1;
const LEVEL2_STAR_MAX_SPEED = 2;
const LEVEL2_STAR_MIN_SIZE = 22;
const LEVEL2_STAR_MAX_SIZE = 27;

const LEVEL3_STAR_COUNT = 4;
const LEVEL3_STAR_MIN_SPEED = 1;
const LEVEL3_STAR_MAX_SPEED = 1.8;
const LEVEL3_STAR_MIN_SIZE = 18;
const LEVEL3_STAR_MAX_SIZE = 23;

const STAR_SPAWN_OFFSET = 3;

const player1 = new Spaceship(
  PLAYER_SIZE,
  canvas.height * PLAYER1_Y_RATIO,
  PLAYER_SPEED,
  PLAYER_SIZE,
  "/img/spaceship0.png"
);
const player2 = new Spaceship(
  PLAYER_SIZE,
  canvas.height * PLAYER2_Y_RATIO,
  PLAYER_SPEED,
  PLAYER_SIZE,
  "/img/spaceship1.png"
);

const levelConfigs = [
  {
    scoreGoal: LEVEL1_SCORE_GOAL,
    playerSpeed: PLAYER_SPEED,
    clusters: [
      new Cluster(
        Asteroid,
        LEVEL1_AST_COUNT,
        LEVEL1_AST_MIN_SPEED,
        LEVEL1_AST_MAX_SPEED,
        LEVEL1_AST_MIN_SIZE,
        LEVEL1_AST_MAX_SIZE,
        AST_SPAWN_OFFSET,
        "/img/asteroid.png"
      ),
      new Cluster(
        Star,
        LEVEL1_STAR_COUNT,
        LEVEL1_STAR_MIN_SPEED,
        LEVEL1_STAR_MAX_SPEED,
        LEVEL1_STAR_MIN_SIZE,
        LEVEL1_STAR_MAX_SIZE,
        STAR_SPAWN_OFFSET,
        "/img/star.png"
      ),
    ],
    background: "/img/levels/level_1.jpg",
  },
  {
    scoreGoal: LEVEL2_SCORE_GOAL,
    playerSpeed: PLAYER_SPEED,
    clusters: [
      new Cluster(
        Asteroid,
        LEVEL2_AST_COUNT,
        LEVEL2_AST_MIN_SPEED,
        LEVEL2_AST_MAX_SPEED,
        LEVEL2_AST_MIN_SIZE,
        LEVEL2_AST_MAX_SIZE,
        AST_SPAWN_OFFSET,
        "/img/asteroid.png"
      ),
      new Cluster(
        Star,
        LEVEL2_STAR_COUNT,
        LEVEL2_STAR_MIN_SPEED,
        LEVEL2_STAR_MAX_SPEED,
        LEVEL2_STAR_MIN_SIZE,
        LEVEL2_STAR_MAX_SIZE,
        STAR_SPAWN_OFFSET,
        "/img/star.png"
      ),
    ],
    background: "/img/levels/level_2.jpg",
  },
  {
    scoreGoal: LEVEL3_SCORE_GOAL,
    playerSpeed: PLAYER_SPEED,
    clusters: [
      new Cluster(
        Asteroid,
        LEVEL3_AST_COUNT,
        LEVEL3_AST_MIN_SPEED,
        LEVEL3_AST_MAX_SPEED,
        LEVEL3_AST_MIN_SIZE,
        LEVEL3_AST_MAX_SIZE,
        AST_SPAWN_OFFSET,
        "/img/asteroid.png"
      ),
      new Cluster(
        Star,
        LEVEL3_STAR_COUNT,
        LEVEL3_STAR_MIN_SPEED,
        LEVEL3_STAR_MAX_SPEED,
        LEVEL3_STAR_MIN_SIZE,
        LEVEL3_STAR_MAX_SIZE,
        STAR_SPAWN_OFFSET,
        "/img/star.png"
      ),
    ],
    background: "/img/levels/level_3.jpg",
  },
];

const levels = [];
for (let i = 0; i < levelConfigs.length; i++) {
  const config = levelConfigs[i];
  levels.push(
    new Level(
      config.scoreGoal,
      config.playerSpeed,
      config.clusters,
      config.background
    )
  );
}

const game = new Game([player1, player2], levels, keysPressed);
const renderer = new Renderer(game);

function main() {
  game.update();
  renderer.render();
  requestAnimationFrame(main);
}

main();