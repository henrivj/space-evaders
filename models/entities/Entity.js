export default class Entity {
	constructor(posX, posY, size, speed, sprite) {
		this.position = { x: posX, y: posY };
		this.size = size;
		this.speed = speed;
		this.velocity = { x: 0, y: 0 };
		this.sprite = new Image();
		this.sprite.src = sprite;
		this.force = 0;
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

	resolveCollision(other) {
		if (!this.collidesWith(other)) return;

		const mass1 = this.size ** 2;
		const mass2 = other.size ** 2;

		// descobre a direcao da batida
		const dirX = other.position.x - this.position.x;
		const dirY = other.position.y - this.position.y;

		// calcula a forca (https://stackoverflow.com/questions/345838/ball-to-ball-collision-detection-and-handling)
		this.force = ((other.velocity.x - this.velocity.x) * dirX + (other.velocity.y - this.velocity.y) * dirY) / (dirX ** 2 + dirY ** 2);

		// forca minima p nao se atravessarem (so acontece quando perfeitamente alinhados)
		this.force = Math.min(this.force, -0.055);

		// maior fica com mais forca
		this.velocity.x += (this.force * dirX * mass2) / mass1;
		this.velocity.y += (this.force * dirY * mass2) / mass1;
		other.velocity.x -= (this.force * dirX * mass1) / mass2;
		other.velocity.y -= (this.force * dirY * mass1) / mass2;
	}
}
