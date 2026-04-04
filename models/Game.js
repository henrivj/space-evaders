import { keysPressed } from '../index.js';

export default class Game {
	constructor(players) {
		this.players = players;
	}

	handlePlayerCollision() {
		const [p1, p2] = this.players;
		if (!p1.collidesWith(p2)) return;

		// descobre a direcao da batida
		const dirX = p2.position.x - p1.position.x;
		const dirY = p2.position.y - p1.position.y;

		// calcula a forca (https://stackoverflow.com/questions/345838/ball-to-ball-collision-detection-and-handling)
		let force = ((p2.velocity.x - p1.velocity.x) * dirX + (p2.velocity.y - p1.velocity.y) * dirY) / (dirX ** 2 + dirY ** 2);
		
		// forca minima p nao se atravessarem (so acontece quando perfeitamente alinhados)
		force = Math.min(force, -0.055);

		p1.velocity.x += force * dirX;
		p1.velocity.y += force * dirY;
		p2.velocity.x -= force * dirX;
		p2.velocity.y -= force * dirY;
	}

	handlePlayerMovement() {
		this.players.forEach((player, index) => {
			player.direction.x = 0;
			player.direction.y = 0;

			if (index === 0) {
				if (keysPressed['w']) player.direction.y -= 1;
				if (keysPressed['s']) player.direction.y += 1;
				if (keysPressed['a']) player.direction.x -= 1;
				if (keysPressed['d']) player.direction.x += 1;
			} else if (index === 1) {
				if (keysPressed['arrowup']) player.direction.y -= 1;
				if (keysPressed['arrowdown']) player.direction.y += 1;
				if (keysPressed['arrowleft']) player.direction.x -= 1;
				if (keysPressed['arrowright']) player.direction.x += 1;
			}
		});
	}

	handlePlayer() {
		this.handlePlayerMovement();
		this.handlePlayerCollision();
	}

	update() {
		this.handlePlayer();
		this.players.forEach((p) => p.update());
	}
}
