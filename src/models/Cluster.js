import { canvas } from '../index.js';

export default class Cluster {
	constructor(Entity, lanes, quantity, minSize, maxSize, minSpeed, maxSpeed, sprite) {
		this.Entity = Entity;
		this.lanes = lanes;
		this.quantity = quantity;
		this.size = { min: minSize, max: maxSize };
		this.speed = { min: minSpeed, max: maxSpeed };
		this.sprite = sprite;
		this.entities = this.generateEntities();
	}

	getRandomSize() {
		return Math.random() * (this.size.max - this.size.min) + this.size.min;
	}

	getRandomSpeed() {
		return Math.random() * (this.speed.max - this.speed.min) + this.speed.min;
	}

	getRandomPosition(size) {
		if (!this.laneQueue || this.laneQueue.length === 0) {
			let lanes = [];
			for (let i = 0; i < this.lanes; i++) {
				lanes.push(i);
			}

			// fisher-yates
			for (let i = lanes.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));
				[lanes[i], lanes[j]] = [lanes[j], lanes[i]];
			}

			if (lanes[0] === this.lastLane) {
				[lanes[0], lanes[lanes.length - 1]] = [lanes[lanes.length - 1], lanes[0]];
			}

			this.laneQueue = lanes;
		}

		let chosenLane = this.laneQueue.shift();
		this.lastLane = chosenLane;

		let laneHeight = canvas.height / this.lanes;

		return {
			x: canvas.width + Math.random() * canvas.width,
			y: laneHeight * chosenLane + laneHeight / 2 - size / 2
		};
	}

	generateEntities() {
		let generatedEntities = [];

		for (let i = 0; i < this.quantity; i++) {
			let size = this.getRandomSize();
			let speed = this.getRandomSpeed();
			let position = this.getRandomPosition(size);

			let entity = new this.Entity(position.x, position.y, size, speed, this.sprite);
			entity.velocity.x = -speed;
			generatedEntities.push(entity);
		}

		return generatedEntities;
	}

	recycleEntities() {
		this.entities.forEach((entity) => {
			if (entity.canBeReset === false) return;

			if (entity.position.x <= -entity.size || (!entity.isAlive() && entity.size <= 0)) {
				this.resetEntity(entity);
			}
		});
	}

	resetEntity(entity) {
		entity.size = this.getRandomSize();
		entity.speed = this.getRandomSpeed();
		let position = this.getRandomPosition(entity.size);

		entity.position.x = position.x;
		entity.position.y = position.y;

		entity.velocity.x = -entity.speed;
		entity.velocity.y = 0;
		entity.health = entity.maxHealth || 1;
		entity.canBeReset = true;
	}

	drain() {
		this.entities.forEach((entity) => {
			entity.canBeReset = false;
		});
	}

	update() {
		this.entities.forEach((entity) => {
			entity.update();
		});
	}

	render() {
		this.entities.forEach((entity) => {
			entity.render();
		});
	}
}
