// Game.js
import { keysPressed } from '../index.js';
import Level from './Level.js';

export default class Game {
	constructor(players, levels) {
		this.players = players;
		this.levels = this.generateLevels(levels);
		this.currentLevel = 0;
		this.state = 'menu';
	}

	generateLevels(levels) {
		const generatedLevels = [];
		levels.forEach((level) => {
			generatedLevels.push(new Level(level.index, level.scoreGoal, level.clusters, level.background));
		});
		return generatedLevels;
	}

	getScore() {
		let score = 0;
		this.players.forEach((player) => {
			score += player.score / this.players.length;
		});
		return Math.floor(score);
	}

	recycleEntities() {
		this.levels.forEach((level) => {
			level.recycleEntities();
		});
	}

	drainPreviousLevels() {
		this.levels.forEach((level) => {
			if (level.isComplete(this.getScore())) level.drainClusters();
		});
	}

	handlePlayerDeath() {
		this.players.forEach((player) => {
			player.handleDeathAnimation();
		});
	}

	handlePlayerWallCollision() {
		this.players.forEach((player) => {
			// cima/baixo
			if (player.position.y < -player.size / 2) {
				player.position.y += canvas.height;
			} else if (player.position.y > canvas.height - player.size / 2) {
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

	handlePlayerEnemyCollision() {
		this.players.forEach((player) => {
			this.levels.forEach((level, index) => {
				if (index > this.currentLevel) return;

				level.clusters.forEach((cluster) => {
					cluster.entities.forEach((entity) => {
						if (player.collidesWith(entity)) {
							player.resolveCollision(entity);
							player.takeDamage(entity);
						}
					});
				});
			});
		});
	}

	handlePlayerPlayerCollision() {
		const [p1, p2] = this.players;
		p1.resolveCollision(p2);
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
		this.handlePlayerEnemyCollision();
		this.handlePlayerWallCollision();
		this.handlePlayerDeath();
		this.players.forEach((p) => p.update());
	}

	updateClusters() {
		this.levels.forEach((level, index) => {
			if (index > this.currentLevel) return;
			level.updateClusters();
		});
	}

	updateCurrentLevel() {
		this.levels.forEach((level) => {
			if (!level.isComplete(this.getScore())) return;
			this.currentLevel = level.index + 1;
		});
	}

	resetGame() {
		this.levels.forEach((level) => {
			level.reset();
		});
		this.players.forEach((player) => {
			player.reset();
		});
	}

	updateGameState() {
		if (this.levels[this.currentLevel].isComplete(this.getScore()) && !this.levels[this.currentLevel + 1]) this.state = 'victory';

		let bothDead = true;
		this.players.forEach((player) => {
			if (!player.isDead()) bothDead = false;
		});
		if (bothDead) this.state = 'defeat';

		if (!keysPressed['enter']) return;

		switch (this.state) {
			case 'playing':
				this.state = 'pause';
				break;
			case 'pause':
			case 'menu':
				this.state = 'playing';
				break;
			case 'victory':
			case 'defeat':
				this.resetGame();
				this.state = 'menu';
				break;
		}

		keysPressed['enter'] = false;
	}

	update() {
		this.updateGameState();

		if (this.state !== 'playing') return;

		this.updateCurrentLevel();
		this.updateClusters();
		this.updatePlayer();

		this.drainPreviousLevels();
		this.recycleEntities();
	}
}
