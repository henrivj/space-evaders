import Cluster from './models/Cluster.js';
import Asteroid from './models/entities/Asteroid.js';
import Star from './models/entities/Star.js';
import { Spaceship } from './models/entities/Spaceship.js';

import Game from './models/Game.js';
import Renderer from './models/Renderer.js';

export const canvas = document.getElementById('canvas');
export const context = canvas.getContext('2d');
export const keysPressed = {};

document.addEventListener('keydown', (e) => {
	keysPressed[e.key.toLowerCase()] = true;
});
document.addEventListener('keyup', (e) => {
	keysPressed[e.key.toLowerCase()] = false;
});

const spaceshipSize = 50;
const players = [new Spaceship(spaceshipSize, canvas.height / 3 - spaceshipSize / 2, spaceshipSize, 1, '/img/spaceship0.png'), new Spaceship(spaceshipSize, (canvas.height / 3) * 2 - spaceshipSize / 2, spaceshipSize, 1, '/img/spaceship1.png')];

const levels = [
	{ index: 0, scoreGoal: 500, clusters: [new Cluster(Asteroid, 10, 10, 45, 75, 4, 5, '/img/asteroid.png'), new Cluster(Star, 5, 5, 15, 25, 2, 4, '/img/star.png')], background: '/img/levels/level_1.png' },
	{ index: 1, scoreGoal: 1000, clusters: [new Cluster(Asteroid, 8, 12, 55, 85, 5, 6, '/img/asteroid.png'), new Cluster(Star, 4, 6, 25, 35, 3, 5, '/img/star.png')], background: '/img/levels/level_2.png' },
	{ index: 2, scoreGoal: 2000, clusters: [new Cluster(Asteroid, 6, 14, 65, 95, 6, 7, '/img/asteroid.png'), new Cluster(Star, 3, 7, 35, 44, 4, 6, '/img/star.png')], background: '/img/levels/level_3.png' }
];

const game = new Game(players, levels);
const renderer = new Renderer(game);

function main() {
	game.update();
	renderer.render();
	requestAnimationFrame(main)
}

main()