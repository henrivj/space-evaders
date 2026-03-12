import Star from '../entities/Star.js'

export default class StarCluster {
    constructor(canvas, config) {
        this.canvas = canvas
        this.config = config
        this.stars = this.generateStars()
    }

    generateStars() {
        const stars = []
        for (let i = 0; i < this.config.count; i++){
            stars.push(this.createStar())
        }
        return stars
    }

    createStar() {
        const x = this.canvas.width + Math.random() * (this.canvas.width * 10)
        const y = Math.random() * (this.canvas.height - 30)
        return new Star(this.canvas, x, y, 30, 1, '../../img/star.png')
    }

    update() {
    this.stars.forEach(star => {
        star.updatePosition()
        star.rotation += star.rotationSpeed
    })
}

    render() {
        this.stars.forEach(star => {
            star.render()
        })
    }
}