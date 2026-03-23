import Asteroid from './entities/Asteroid.js';
import Star from './entities/Star.js';
import { canvas } from '../index.js';

export default class Game {
	constructor(players, levels, keysPressed) {
		this.players = players;
		this.levels = levels;
		this.currentLevel = 0;
		this.score = 0;
		this.state = 'menu';
		this.keysPressed = keysPressed;
	}

	reset() {
		this.currentLevel = 0;
		this.score = 0;

		this.levels.forEach((level) => {
			level.bgOffset = 0;
			level.clusters.forEach((cluster) => {
				cluster.entities = cluster.generateEntities();
			});
		});

		this.players.forEach((player, index) => {
			player.reset(index);
			player.health = player.maxHealth;
			player.speed = this.levels[this.currentLevel].playerSpeed;
		});
	}

	update() {
		this.handleGameState();
		if (this.state === 'playing') {
			this.handlePlayerMovement();
			this.players.forEach((player) => {
				player.update();
			});

			this.handlePlayerDeath();
			this.handleLevelTransition();
			this.handlePreviousLevels();
			this.handleCurrentLevel();
		}
	}

	handleGameState() {
		if (!this.keysPressed['Enter']) return;

		switch (this.state) {
			case 'victory':
			case 'defeat':
				this.state = 'menu';
				break;
			case 'menu':
				this.reset();
				this.state = 'playing';
				break;
			case 'paused':
				this.state = 'playing';
				break;
			case 'playing':
				this.state = 'paused';
				break;
		}

		this.keysPressed['Enter'] = false;
	}

	handlePlayerMovement() {
		const w = this.keysPressed['w'];
		const s = this.keysPressed['s'];
		const arrowUp = this.keysPressed['ArrowUp'];
		const arrowDown = this.keysPressed['ArrowDown'];

		if ((w && s) || (!w && !s)) this.players[0].direction = 0;
		else if (w) this.players[0].direction = -1;
		else if (s) this.players[0].direction = 1;

		if ((arrowUp && arrowDown) || (!arrowUp && !arrowDown)) this.players[1].direction = 0;
		else if (arrowUp) this.players[1].direction = -1;
		else if (arrowDown) this.players[1].direction = 1;

		if (this.players[0].collidesWith(this.players[1])) {
			const p0 = this.players[0];
			const p1 = this.players[1];
			const isP0Above = p0.posY < p1.posY;

			// nao deixa p0 passar p1
			if (isP0Above && p0.direction === 1) p0.direction = 0;
			if (!isP0Above && p0.direction === -1) p0.direction = 0;

			// nao deixa p1 passar p0
			if (isP0Above && p1.direction === -1) p1.direction = 0;
			if (!isP0Above && p1.direction === 1) p1.direction = 0;
		}
	}

	handleLevelTransition() {
		if (!this.levels[this.currentLevel].isComplete(this.score)) return;

		this.levels[this.currentLevel].clusters.forEach((cluster) => cluster.drain());

		if (this.levels[this.currentLevel + 1]) {
			this.currentLevel++;
			this.levels[this.currentLevel].bgOffset = canvas.width;
			this.players.forEach((player) => (player.speed = this.levels[this.currentLevel].playerSpeed));
		} else {
			this.state = 'victory';
			if (this.score > localStorage.getItem('highScore')) {
				localStorage.setItem('highScore', this.score);
			}
		}
	}

	processLevel(level, isCurrentLevel) {
		level.clusters.forEach((cluster) => {
			cluster.entities.forEach((entity) => {
				this.players.forEach((player) => {
					if (player.collidesWith(entity)) {
						if (cluster.EntityType === Star) {
							player.health = Math.min(player.health + Math.trunc(entity.size * cluster.spawnOffset), player.maxHealth);
							this.score += 1000;
						} else {
							player.health = Math.max(player.health - Math.trunc(entity.size), 0);
						}
	
						if (isCurrentLevel) {
							entity.reset();
						} else {
							entity.kill();
						}
					}
				});
	
				if (entity.alive && entity.hasPassedX(0)) {
					if (cluster.EntityType === Asteroid && entity.alive) {
						this.score += Math.trunc(entity.size);
					}
					if (isCurrentLevel) {
						entity.reset();
					} else {
						entity.kill();
					}
				}
			});
		});
	
		level.clusters.forEach((cluster) => cluster.update());
	}

	handlePlayerDeath() {
		this.players.forEach((player) => {
			if (player.health <= 0) {
				this.state = 'defeat';

				if (this.score > localStorage.getItem('highScore')) {
					localStorage.setItem('highScore', this.score);
				}
			}
		});
	}

	handleCurrentLevel() {
		this.processLevel(this.levels[this.currentLevel], true);
	}

	handlePreviousLevels() {
		for (let i = 0; i < this.currentLevel; i++) this.processLevel(this.levels[i], false);
	}
}