export default class GameObject {
    constructor(canvas, posX, posY, size, speed, spriteSrc) {
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.posX = posX
        this.posY = posY
        this.size = size
        this.speed = speed
        this.sprite = new Image()
        this.sprite.src = spriteSrc
    }

    render() {
        this.context.drawImage(this.sprite, this.posX, this.posY, this.size, this.size)
    }

    collidesWith(object) {
        const combinedRadius = (this.size / 2 + object.size / 2)

        // preferi usar circulos pois os asteroides sao circulares e a nave 
        // se a distancia entre centros for menor que a soma dos raios, bateu
        const horizontalDistance = (this.posX + this.size / 2) - (object.posX + object.size / 2)
        const verticalDistance = (this.posY + this.size / 2) - (object.posY + object.size / 2)
        const distanceBetweenCenters = Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2)

        return distanceBetweenCenters < (combinedRadius * 0.9) // * 0.9 para ignorar batidas leves
    }
}