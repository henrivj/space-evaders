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

const player1 = new Spaceship(50, canvas.height / 3, 7.5, 50, 1, '/img/spaceship0.png');
const player2 = new Spaceship(50, (canvas.height / 3) * 2, 7.5, 50, 1, '/img/spaceship1.png');

const levelConfigs = [
	{
		scoreGoal: 2500,
		clusters: [new Cluster(Asteroid, 10, 6, 7, 25, 50, 2, '/img/asteroid.png'), new Cluster(Star, 0, 0, 0, 0, 0, 0, '/img/star.png')],
		background: '/img/levels/level_1.png'
	},
	{
		scoreGoal: 5000,
		clusters: [new Cluster(Asteroid, 15, 7, 8, 25, 75, 2, '/img/asteroid.png'), new Cluster(Star, 1, 5, 10, 30, 40, 5, '/img/star.png')],
		background: '/img/levels/level_2.png'
	},
	{
		scoreGoal: 10000,
		clusters: [new Cluster(Asteroid, 20, 7, 8, 50, 100, 2, '/img/asteroid.png'), new Cluster(Star, 2, 10, 15, 35, 40, 5, '/img/star.png')],
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
