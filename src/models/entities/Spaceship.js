import Entity from './Entity.js';
import { canvas } from '../../index.js';

export default class Spaceship extends Entity {
	maxHealth = 200;
	health = this.maxHealth;
	direction = 0;

	update() {
		this.posY += this.speed * this.direction;

		if (this.posY < -this.size / 2) this.posY = canvas.height - this.size / 2;
		if (this.posY > canvas.height - this.size / 2) this.posY = -this.size / 2;
	}

	reset(index) {
		if (index === 0) this.posY = canvas.height / 3;
		else if (index === 1) this.posY = (canvas.height / 3) * 2;
	}
}