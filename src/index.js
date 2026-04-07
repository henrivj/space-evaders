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
	{ index: 0, scoreGoal: 500, clusters: [new Cluster(Asteroid, 5, 8, 55, 75, 4, 5, '/img/asteroid.png'), new Cluster(Star, 4, 5, 20, 40, 2, 4, '/img/star.png')], background: '/img/levels/level_1.png' },
	{ index: 1, scoreGoal: 1000, clusters: [new Cluster(Asteroid, 6, 10, 65, 85, 5, 6, '/img/asteroid.png'), new Cluster(Star, 5, 7, 20, 40, 3, 5, '/img/star.png')], background: '/img/levels/level_2.png' },
	{ index: 2, scoreGoal: 2000, clusters: [new Cluster(Asteroid, 7, 12, 75, 95, 6, 7, '/img/asteroid.png'), new Cluster(Star, 6, 9, 20, 40, 4, 6, '/img/star.png')], background: '/img/levels/level_3.png' }
];

const game = new Game(players, levels);
const renderer = new Renderer(game);

function main() {
	game.update();
	renderer.render();
	// requestAnimationFrame(main); eu sei que o certo é o requestAnimationFrame, mas ele precisa sempre rodar a 60fps se nao fica MUITO rápido
}

setInterval(main, 1000 / 60);
