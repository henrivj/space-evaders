import { context } from '../../index.js';
import Entity from './Entity.js';

export class Spaceship extends Entity {
	direction = { x: 0, y: 0 };
	velocity = { x: 0, y: 0 };
	maxHealth = 100;
	health = this.maxHealth;
	tilt = 0;

	update() {
		this.velocity.x += this.direction.x * this.speed;
		this.velocity.y += this.direction.y * this.speed;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// a cada update a velocidade vai diminuindo devagar ao invez de parar de vez
		this.velocity.x *= 0.9;
		this.velocity.y *= 0.9;

		this.tilt += this.velocity.y / 360;
		this.tilt *= 0.9
	}

	render() {
		context.save();
		context.translate(this.position.x + this.size / 2, this.position.y + this.size / 2);
		context.rotate(this.tilt);
		context.drawImage(this.sprite, -this.size / 2, -this.size / 2, this.size, this.size);
		context.restore();
	}
}
