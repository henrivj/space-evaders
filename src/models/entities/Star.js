import Entity from './Entity.js';
import { context } from '../../index.js';

export default class Star extends Entity {
	score = Math.floor(Math.sqrt(this.speed * this.size ** 2)); // essa formula nao significa nada, so fica bem balanceada
	rotationSpeed = Math.random() * (0.01 - 0.001) + 0.001;
	canBeReset = true;

	update() {
		if (!this.isAlive()) {
			this.handleDestructionAnimation();
			return;
		}

		if (this.position.x < -this.size) return;

		this.rotation += this.rotationSpeed;
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
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
