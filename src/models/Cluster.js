import { canvas } from '../index.js';

export default class Cluster {
	constructor(EntityType, quantity, minSpeed, maxSpeed, minSize, maxSize, spawnOffset, sprite) {
		this.EntityType = EntityType;
		this.quantity = quantity;
		this.minSpeed = minSpeed;
		this.maxSpeed = maxSpeed;
		this.minSize = minSize;
		this.maxSize = maxSize;
		this.spawnOffset = spawnOffset;
		this.sprite = sprite;
		this.entities = this.generateEntities();
	}

	generateEntities() {
		const entities = [];
		for (let i = 0; i < this.quantity; i++) {
			const size = Math.random() * (this.maxSize - this.minSize) + this.minSize;
			const speed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;

			const posX = (canvas.width + 1) * this.spawnOffset + i * canvas.width * Math.random();
			const posY = Math.random() * (canvas.height - size);

			entities.push(new this.EntityType(posX, posY, speed, size, this.sprite));
		}
		return entities;
	}

	drain() {
		this.entities.forEach((entity) => (entity.canRespawn = false));
	}

	reset() {
		this.entities.forEach((entity) => entity.reset());
	}

	update() {
		this.entities.forEach((entity) => entity.update());
	}

	render() {
		this.entities.forEach((entity) => entity.render());
	}
}