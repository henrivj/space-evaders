import Entity from './Entity.js';
import { context } from '../../index.js';

export default class Asteroid extends Entity {
	rotation = 0;
	rotationSpeed = Math.random() * (0.01 - 0.001) + 0.001;
	canBeReset = true;

	update() {
		if (!this.canBeReset && this.position.x < -this.size) return
		this.rotation += this.rotationSpeed;
		this.position.x -= this.speed;
	}

	render() {
		if (!this.canBeReset && this.position.x < -this.size) return
		context.save();
		context.translate(this.position.x + this.size / 2, this.position.y + this.size / 2);
		context.rotate(this.rotation);
		context.drawImage(this.sprite, -this.size / 2, -this.size / 2, this.size, this.size);
		context.restore();
	}
}