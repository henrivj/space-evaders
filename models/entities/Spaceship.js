import { context } from '../../index.js';
import Entity from './Entity.js';

export class Spaceship extends Entity {
	score = 0;
	startPosition = { x: this.position.x, y: this.position.y };
	startSize = this.size;
	maxHealth = 100;
	health = this.maxHealth;
	direction = { x: 0, y: 0 };
	tilt = 0;

	isDead() {
		return this.health <= 0 && this.size <= 0;
	}

	calculateCollisionDamage(entity) {
		const distanceX = entity.position.x - this.position.x;
		const distanceY = entity.position.y - this.position.y;
		const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2); // vetor normal (quase mesma logica da resolveCollision())

		return Math.floor(distance + entity.size * 0.01);
	}

	takeDamage(entity) {
		const damage = this.calculateCollisionDamage(entity);
		this.health = Math.max(this.health - damage, 0);
		return damage;
	}

	reset() {
		this.health = this.maxHealth;
		this.score = 0;
		this.size = this.startSize;
		this.position.x = this.startPosition.x;
		this.position.y = this.startPosition.y;
		this.velocity = { x: 0, y: 0 };
		this.tilt = 0;
	}

	handleDeathAnimation() {
		if (this.health <= 0 && this.size > 0) {
			this.size = Math.max(0, this.size - 1);
			this.tilt += 0.1;

			this.position.x += Math.random();
			this.position.y += Math.random();
		}
	}

	update() {
		if (this.isDead() || this.health <= 0) return;

		this.velocity.x += this.direction.x * this.speed;
		this.velocity.y += this.direction.y * this.speed;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// a cada update a velocidade vai diminuindo devagar ao invez de parar de vez
		this.velocity.x *= 0.9;
		this.velocity.y *= 0.9;

		this.tilt += this.velocity.y / 360;
		this.tilt *= 0.9;
	}

	render() {
		if (this.isDead()) return;

		context.save();
		context.translate(this.position.x + this.size / 2, this.position.y + this.size / 2);
		context.rotate(this.tilt);
		context.drawImage(this.sprite, -this.size / 2, -this.size / 2, this.size, this.size);
		context.restore();
	}
}
