import Cluster from './models/Cluster.js';
import Asteroid from './models/entities/Asteroid.js';
import { Spaceship } from './models/entities/Spaceship.js';

import Game from './models/Game.js';
import Renderer from './models/Renderer.js';

export const canvas = document.getElementById('canvas');
export const context = canvas.getContext('2d');
export const keysPressed = {};

document.addEventListener('keydown', (e) => {
	keysPressed[e.key.toLowerCase()] = true;
	let keyElement = document.getElementById(e.key.toLowerCase())
	if (keyElement) keyElement.classList.add('key-down')
});
document.addEventListener('keyup', (e) => {
	keysPressed[e.key.toLowerCase()] = false;
	let keyElement = document.getElementById(e.key.toLowerCase())
	if (keyElement) keyElement.classList.remove('key-down')
});

const spaceshipSize = 50
const players = [
	new Spaceship(spaceshipSize, (canvas.height / 3) - (spaceshipSize / 2), spaceshipSize, 1, './img/spaceship0.png'),
	new Spaceship(spaceshipSize, (canvas.height / 3 * 2) - (spaceshipSize / 2), spaceshipSize, 1, './img/spaceship1.png')
];

const levels = [
	{
		index: 0,
		scoreGoal: 2500,
		clusters: [
			new Cluster(Asteroid, 4, 8, 60, 80, 4, 6, './img/asteroid.png')
		],
		background: './img/levels/level_1.png'
	},
	{
		index: 1,
		scoreGoal: 5000,
		clusters: [
			new Cluster(Asteroid, 4, 8, 70, 90, 4, 6, './img/asteroid.png')
		],
		background: './img/levels/level_2.png'
	},
	{
		index: 2,
		scoreGoal: 10000,
		clusters: [
			new Cluster(Asteroid, 4, 8, 80, 100, 4, 6, './img/asteroid.png')
		],
		background: './img/levels/level_3.png'
	},
];

const game = new Game(players, levels);
const renderer = new Renderer(game);

function main() {
	game.update();
	renderer.render();
}

setInterval(main, 1000 / 60); // so ta assim por enquanto pra eu saber como que vai rodar nos computadores da escola, no meu pessoal roda bem mais rapido se usar da outra forma
