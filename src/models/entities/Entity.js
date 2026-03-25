import { context } from '../../index.js';

export default class Entity {
	constructor(posX, posY, speed, size, sprite) {
		this.posX = posX;
		this.posY = posY;
		this.speed = speed;
		this.size = size;
		this.sprite = new Image();
		this.sprite.src = sprite;
		this.alive = true;
	}

	render() {
		context.drawImage(this.sprite, this.posX, this.posY, this.size, this.size);
	}

	collidesWith(object) {
		const combinedRadius = ((this.size + object.size) / 2) * 0.9;
		const distanceX = this.posX - object.posX;
		const distanceY = this.posY - object.posY;

		return distanceX ** 2 + distanceY ** 2 < combinedRadius ** 2;
	}

	hasPassedX(posX) {
		return this.posX <= -this.size + posX;
	}
}
