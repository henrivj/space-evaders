import { context, keysPressed } from '../../index.js';

export default class Entity {
	constructor(posX, posY, size, speed, sprite) {
		this.position = { x: posX, y: posY };
		this.size = size;
		this.speed = speed;
		this.sprite = new Image();
		this.sprite.src = sprite;
	}

	render() {
		context.drawImage(this.sprite, this.position.x, this.position.y, this.size, this.size);
	}

	collidesWith(object) {
		const combinedRadius = ((this.size + object.size) / 2) * 0.9;

		const centerX1 = this.position.x + this.size / 2;
		const centerY1 = this.position.y + this.size / 2;
		const centerX2 = object.position.x + object.size / 2;
		const centerY2 = object.position.y + object.size / 2;

		const distanceX = centerX1 - centerX2;
		const distanceY = centerY1 - centerY2;

		// se a distancia dos centros for menor que a soma dos raios, colide
		return distanceX ** 2 + distanceY ** 2 < combinedRadius ** 2;
	}
}
