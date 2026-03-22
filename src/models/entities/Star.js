import Entity from './Entity.js';
import { canvas, context } from '../../index.js';

export default class Star extends Entity {
	rotation = 0;
	rotationSpeed = Math.random() * (0.01 - 0.001) + 0.001;
	canRespawn = true;

	update() {
		this.rotation += this.rotationSpeed;
		this.posX -= this.speed;
	}

	render() {
		if (this.hasPassedX(0)) return;
		context.save();
		context.translate(this.posX + this.size / 2, this.posY + this.size / 2);
		context.rotate(this.rotation);
		context.drawImage(this.sprite, -this.size / 2, -this.size / 2, this.size, this.size);
		context.restore();
	}

	reset() {
		if (!this.canRespawn) return;
		this.posX = canvas.width + (canvas.width * Math.random()) / 2;
		this.posY = Math.random() * (canvas.height - this.size);
	}

	kill() {
		this.Alive = false;
		this.canRespawn = false;
		this.posX = -this.size;
	}
}