import GameObject from "./GameObject.js";

export default class Spaceship extends GameObject {
    health = 3
    direction = 0
    keys = {}

    takeDamage() {
        this.health--
    }

    startControls() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true
            if (e.key === 'ArrowUp' || e.key === 'w') this.direction = -1
            if (e.key === 'ArrowDown' || e.key === 's') this.direction = 1
        })
    
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false
            if (e.key === 'ArrowUp' || e.key === 'w') {
                this.direction = (this.keys['ArrowDown'] || this.keys['s']) ? 1 : 0
            }
            if (e.key === 'ArrowDown' || e.key === 's') {
                this.direction = (this.keys['ArrowUp'] || this.keys['w']) ? -1 : 0
            }
        })
    }
    
    reset() {
        this.posX = 100
        this.poxY = this.canvas.height / 2 + this.size / 2

        this.health = 3
        this.direction = 0
        this.keys = {}
    }

    updateSprite() {
        switch (this.health) {
            case 3: {
                this.spriteSrc = '../img/spaceship.png'
                break
            }
            case 2: {
                this.spriteSrc = '../img/spaceship.png'
                break
            }
            case 1: {
                this.spriteSrc = '../img/spaceship.png'
                break
            }
        }
    }

    updatePosition() {
    this.posY += this.speed * this.direction
    if (this.posY < -this.size / 2){
        this.posY = this.canvas.height - this.size / 2
    }
    if (this.posY > this.canvas.height - this.size / 2){
        this.posY = -this.size / 2
    }
}
}