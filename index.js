import { Spaceship } from './models/entities/Spaceship.js';

import Game from './models/Game.js';
import Renderer from './models/Renderer.js';

export const canvas = document.getElementById('canvas');
export const context = canvas.getContext('2d');
export const keysPressed = {};

document.addEventListener('keydown', (e) => {
	keysPressed[e.key.toLowerCase()] = true;
	document.getElementById(e.key.toLowerCase()).classList.add('key-down')
});
document.addEventListener('keyup', (e) => {
	keysPressed[e.key.toLowerCase()] = false;
	document.getElementById(e.key.toLowerCase()).classList.remove('key-down')
});

const spaceshipSize = 50
const players = [
    new Spaceship(spaceshipSize, (canvas.height / 3) - (spaceshipSize / 2), spaceshipSize, 1, './img/spaceship0.png'),
    new Spaceship(spaceshipSize, (canvas.height / 3 * 2) - (spaceshipSize / 2), spaceshipSize, 1, './img/spaceship1.png')
];

const game = new Game(players);
const renderer = new Renderer(game);

function main() {
	game.update();
	renderer.render();
}

setInterval(main, 1000 / 60); // so ta assim por enquanto pra eu saber como que vai rodar nos computadores da escola, no meu pessoal roda bem mais rapido se usar da outra forma
