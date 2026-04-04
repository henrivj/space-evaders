// Game.js
import { keysPressed } from '../index.js';
import Level from './Level.js';

export default class Game {
	constructor(players, levels) {
		this.players = players;
		this.levels = this.generateLevels(levels);
		this.currentLevel = 0;
	}

	generateLevels(levels) {
		const generatedLevels = [];
		levels.forEach((level) => {
			generatedLevels.push(new Level(level.index, level.scoreGoal, level.clusters, level.background));
		});
		return generatedLevels;
	}

	resetPassedEntities() {
		this.levels.forEach(level => {
			level.clusters.forEach(cluster => {
				cluster.resetPassedEntities()
			})
		})
	}

	drainPreviousLevels() {
		let score = 0;
		this.players.forEach(player => {
			score += player.score / this.players.length;
		})

		this.levels.forEach((level) => {
			if (level.isComplete(score)) level.drainClusters();
		});
	}

	handlePlayerWallCollision() {
		this.players.forEach(player => {
			const halfSize = player.size / 2;

			// cima/baixo
			if (player.position.y < -halfSize) {
				player.position.y += canvas.height;
			} else if (player.position.y > canvas.height - halfSize) {
				player.position.y -= canvas.height;
			}

			// esquerda/direita
			if (player.position.x <= 0) {
				player.position.x = 0;
				player.velocity.x = -player.velocity.x;
			} else if (player.position.x >= canvas.width - player.size) {
				player.position.x = canvas.width - player.size;
				player.velocity.x = -player.velocity.x;
			}
		});
	}


	handlePlayerPlayerCollision() {
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

	updatePlayer() {
		this.handlePlayerMovement();
		this.handlePlayerPlayerCollision();
		this.handlePlayerWallCollision()
		this.players.forEach((p) => p.update());
	}

	updateClusters() {
		this.levels.forEach((level, index) => {
			if (index > this.currentLevel) return;
			level.updateClusters()
		});
	}

	updateLevelIndex() {
		let score = 0;
		this.players.forEach(player => {
			score += player.score / this.players.length;
		})

		this.levels.forEach((level) => {
			if (!level.isComplete(score)) return;
			this.currentLevel = level.index + 1;
		});
	}

	update() {
		this.updateLevelIndex();
		this.updateClusters();
		this.updatePlayer();

		this.drainPreviousLevels()
		this.resetPassedEntities()
	}
}
