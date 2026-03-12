import Asteroid from '../entities/Asteroid.js'

export default class AsteroidCluster {
    constructor(canvas, config) {
        this.canvas = canvas
        this.config = config
        this.asteroids = this.generateAsteroids()
    }

    generateAsteroids() {
        const asteroids = []
        const count = Math.trunc(Math.random() * (this.config.max - this.config.min + 1)) + this.config.min

        for (let i = 0; i < count; i++) {
            asteroids.push(this.createAsteroid(i))
        }
        return asteroids
    }

    createAsteroid() {
        const variants = [this.config.small, this.config.medium, this.config.large]
        const variant = variants[Math.trunc(Math.random() * 3)]

        const x = this.canvas.width + Math.random() * this.canvas.width
        const y = Math.random() * (this.canvas.height - variant.size)
        
        return new Asteroid(this.canvas, x, y, variant.size, variant.speed, '../../img/asteroid.png')
    }

    update() {
        this.asteroids.forEach(asteroid => {
            asteroid.updatePosition()
            asteroid.updateRotation()
        })
    }

    render() {
        this.asteroids.forEach(asteroid => {
            asteroid.render()
        })
    }
}