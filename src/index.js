import Game from './models/Game.js';
import Renderer from './models/Renderer.js';
import Level from './models/Level.js';
import Cluster from './models/Cluster.js';

import Spaceship from './models/entities/Spaceship.js';
import Asteroid from './models/entities/Asteroid.js';
import Star from './models/entities/Star.js';

export const canvas = document.getElementById('canvas');
export const context = canvas.getContext('2d');
// so pra nao ficar passando o canvas toda hora, ja que estou separando as classes
// nao sei se e boa pratica exportar uma variavel, mas achei legal isso ser uma possibilidade

const keysPressed = {};
document.addEventListener('keydown', (e) => (keysPressed[e.key] = true));
document.addEventListener('keyup', (e) => (keysPressed[e.key] = false));

const PLAYER_SIZE = 50;
const PLAYER_SPEED = 6;

const player1 = new Spaceship(PLAYER_SIZE, canvas.height / 3, PLAYER_SPEED, PLAYER_SIZE, '/img/spaceship0.png');
const player2 = new Spaceship(PLAYER_SIZE, (canvas.height / 3) * 2, PLAYER_SPEED, PLAYER_SIZE, '/img/spaceship1.png');

const levelConfigs = [
	{
		scoreGoal: 2500,
		clusters: [new Cluster(Asteroid, 10, 1.5, 2.5, 25, 55, 2, '/img/asteroid.png'), new Cluster(Star, 1, 0.8, 1.5, 25, 30, 5, '/img/star.png')],
		background: '/img/levels/level_1.png'
	},
	{
		scoreGoal: 5000,
		clusters: [new Cluster(Asteroid, 20, 2.5, 4, 55, 80, 2, '/img/asteroid.png'), new Cluster(Star, 1, 1, 2, 22, 27, 5, '/img/star.png')],
		background: '/img/levels/level_2.png'
	},
	{
		scoreGoal: 10000,
		clusters: [new Cluster(Asteroid, 30, 3.5, 5.5, 80, 120, 2, '/img/asteroid.png'), new Cluster(Star, 1, 1.5, 2.5, 18, 23, 5, '/img/star.png')],
		background: '/img/levels/level_3.png'
	}
];

const levels = [];
for (let i = 0; i < levelConfigs.length; i++) {
	const config = levelConfigs[i];
	levels.push(new Level(config.scoreGoal, config.clusters, config.background));
}

const game = new Game([player1, player2], levels, keysPressed);
const renderer = new Renderer(game);

function main() {
	game.update();
	renderer.render();
	requestAnimationFrame(main);
}

main();
