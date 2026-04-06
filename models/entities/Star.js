import Entity from './Entity.js';
import { context } from '../../index.js';

export default class Star extends Entity {
	rotationSpeed = Math.random() * (0.01 - 0.001) + 0.001;
	canBeReset = true;

	update() {
		if (!this.alive) {
			this.handleDestructionAnimation();
			return;
		}

		if (this.position.x < -this.size) return;

		this.rotation += this.rotationSpeed;
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.velocity.y *= 0.95;
		if (this.velocity.x > -this.speed) this.velocity.x -= 0.1;
	}

	render() {
		if (this.position.x < -this.size) return;
		context.save();
		context.translate(this.position.x + this.size / 2, this.position.y + this.size / 2);
		context.rotate(this.rotation);
		context.drawImage(this.sprite, -this.size / 2, -this.size / 2, this.size, this.size);
		context.restore();
	}
}
