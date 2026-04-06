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

	generateEntities() {
		let generatedEntities = [];

		for (let i = 0; i < this.quantity; i++) {
			let size = Math.random() * (this.size.max - this.size.min) + this.size.min;
			let speed = Math.random() * (this.speed.max - this.speed.min) + this.speed.min;

			let laneHeight = canvas.height / this.lanes;

			let position = {
				x: canvas.width + Math.random() * canvas.width,
				y: laneHeight * Math.floor(Math.random() * this.lanes) + laneHeight / 2 - size / 2
			};

			let entity = new this.Entity(position.x, position.y, size, speed, this.sprite);
			entity.velocity.x = -speed;
			generatedEntities.push(entity);
		}

		return generatedEntities;
	}

	recycleEntities() {
		this.entities.forEach((entity) => {
			if (entity.position.x > -entity.size || entity.canBeReset === false || !entity.alive) return;
			entity.size = Math.random() * (this.size.max - this.size.min) + this.size.min;
			entity.speed = Math.random() * (this.speed.max - this.speed.min) + this.speed.min;

			let laneHeight = canvas.height / this.lanes;

			entity.position.x = canvas.width + Math.random() * canvas.width;
			entity.position.y = laneHeight * Math.floor(Math.random() * this.lanes) + laneHeight / 2 - entity.size / 2;

			entity.velocity.x = -entity.speed;
			entity.velocity.y = 0;
		});
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
		this.entities = this.entities.filter((entity) => entity.alive || entity.size > 0);
	}

	render() {
		this.entities.forEach((entity) => {
			entity.render();
		});
	}
}
