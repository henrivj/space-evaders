import { keysPressed, canvas } from '../index.js';
import Level from './Level.js';
import Asteroid from './entities/Asteroid.js';
import Star from './entities/Star.js';

export default class Game {
	constructor(players, levels) {
		this.players = players;
		this.levels = this.generateLevels(levels);
		this.currentLevel = 0;
		this.state = 'menu';
		this.winningPlayer = null;
		this.sounds = {
			collision: new Audio('/sound/collision.mp3'),
			star: new Audio('/sound/star.mp3'),
			death: new Audio('/sound/death.mp3'),
			defeat: new Audio('/sound/defeat.mp3'),
			victory: new Audio('/sound/victory.mp3')
		};
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
			score += player.score;
		});
		return Math.floor(score);
	}

	playSound(soundName) {
		if (!this.sounds[soundName]) return;
		this.sounds[soundName].currentTime = 0;
		this.sounds[soundName].play();
	}

	recycleEntities() {
		this.levels.forEach((level) => {
			level.recycleEntities();
		});
	}

	drainPreviousLevels() {
		this.levels.forEach((level) => {
			let completed = false;
			this.players.forEach((player) => {
				if (level.isComplete(player.score)) completed = true;
			});
			if (completed) level.drainClusters();
		});
	}

	handlePlayerDestruction() {
		this.players.forEach((player) => {
			player.handleDestructionAnimation();
		});
	}

	handlePlayerWallCollision() {
		this.players.forEach((player) => {
			if (!player.isAlive()) return;

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
				this.playSound('collision');
			} else if (player.position.x >= canvas.width - player.size) {
				player.position.x = canvas.width - player.size;
				player.velocity.x = -player.velocity.x;
				this.playSound('collision');
			}
		});
	}

	handlePlayerEnemyCollision() {
		this.players.forEach((player) => {
			if (!player.isAlive()) return;

			this.levels.forEach((level, index) => {
				if (index > this.currentLevel) return;

				level.clusters.forEach((cluster) => {
					if (cluster.Entity === Asteroid) {
						cluster.entities.forEach((entity) => {
							if (player.collidesWith(entity)) {
								const wasAlive = player.isAlive();
								player.resolveCollision(entity);
								player.takeDamage(entity);
								this.playSound('collision');
								if (wasAlive && !player.isAlive()) {
									this.playSound('death');
								}
							}
						});
					} else if (cluster.Entity === Star) {
						cluster.entities.forEach((entity) => {
							if (player.collidesWith(entity) && entity.isAlive()) {
								player.score += entity.score;
								entity.health = 0;
								this.playSound('star');
							}
						});
					}
				});
			});
		});
	}

	handlePlayerPlayerCollision() {
		const [p1, p2] = this.players;
		if (!p1.isAlive() || !p2.isAlive()) return;

		if (p1.collidesWith(p2)) {
			p1.resolveCollision(p2);
			this.playSound('collision');
		}
	}

	handlePlayerMovement() {
		this.players.forEach((player, index) => {
			player.direction.x = 0;
			player.direction.y = 0;

			if (!player.isAlive()) return;

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

	updatePlayers() {
		this.handlePlayerMovement();
		this.handlePlayerPlayerCollision();
		this.handlePlayerEnemyCollision();
		this.handlePlayerWallCollision();
		this.handlePlayerDestruction();
		this.players.forEach((p) => p.update());
	}

	updateClusters() {
		this.levels.forEach((level, index) => {
			if (index > this.currentLevel) return;
			level.updateClusters();
		});
	}

	updateCurrentLevel() {
		const previousLevel = this.currentLevel;

		this.levels.forEach((level) => {
			this.players.forEach((player) => {
				if (level.isComplete(player.score) && this.levels[level.index + 1]) this.currentLevel = level.index + 1;
			});
		});

		if (this.currentLevel !== previousLevel) this.levels[this.currentLevel].bgOffset = canvas.width;
	}

	updateLevelBackground() {
		const currentLevel = this.levels[this.currentLevel];

		if (currentLevel.bgOffset > 0) {
			currentLevel.bgOffset -= 5;
			if (currentLevel.bgOffset < 0) currentLevel.bgOffset = 0;
		}
	}

	resetGame() {
		this.levels.forEach((level) => {
			level.reset();
		});
		this.players.forEach((player) => {
			player.reset();
		});
		this.currentLevel = this.bgOffset = 0;
		this.winningPlayer = null;
	}

	updateGameState() {
		this.players.forEach((player, i) => {
			if (this.levels[this.currentLevel].isComplete(player.score) && !this.levels[this.currentLevel + 1]) {
				if (this.state !== 'victory') {
					this.winningPlayer = i;
					this.playSound('victory');
					this.state = 'victory';
				}
			}
		});

		let bothDead = true;
		this.players.forEach((player) => {
			if (player.isAlive() || player.size > 0) bothDead = false;
		});

		if (bothDead && this.state !== 'defeat') {
			this.playSound('defeat');
			this.state = 'defeat';
		}

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
		this.updateLevelBackground();
		this.updateClusters();
		this.updatePlayers();

		this.drainPreviousLevels();
		this.recycleEntities();
	}
}
