import { context } from '../../index.js';
import Entity from './Entity.js';

export class Spaceship extends Entity {
	direction = { x: 0, y: 0 };
	velocity = { x: 0, y: 0 };
	maxHealth = 100;
	health = this.maxHealth;

	update() {
		this.velocity.x += this.direction.x * this.speed;
		this.velocity.y += this.direction.y * this.speed;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		
		this.velocity.x *= 0.97;
		this.velocity.y *= 0.97;
	}
}
