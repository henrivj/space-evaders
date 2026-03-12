import GameObject from "./GameObject.js";

export default class Asteroid extends GameObject {
    rotation = 0
    rotationSpeed = this.getRandomRotationSpeed()

    getRandomRotationSpeed() {
        const speed = Math.random() * (0.01 - 0.001) + 0.001
        if (Math.random() < 0.5) {
            return speed
        } else {
            return -speed
        }
    }

    resetPosition() {
        this.posX = this.canvas.width + Math.random() * 200
        this.posY = Math.random() * (this.canvas.height - this.size)
    }

    updatePosition() {
        this.posX -= this.speed
    }

    updateRotation() {
        this.rotation += this.rotationSpeed
    }

    render() {
        const centerX = this.posX + this.size / 2
        const centerY = this.posY + this.size / 2
        this.context.save()
        this.context.translate(centerX, centerY)
        this.context.rotate(this.rotation)
        this.context.drawImage(this.sprite, -this.size / 2, -this.size / 2, this.size, this.size)
        this.context.restore()
    }
}