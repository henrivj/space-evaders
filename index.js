import AsteroidCluster from "./models/clusters/AsteroidCluster.js"
import StarCluster from "./models/clusters/StarCluster.js"
import Spaceship from "./models/entities/Spaceship.js"
import Game from "./models/Game.js"
import Level from "./models/Level.js"

const canvas = document.getElementById('canvas')
const spaceship = new Spaceship(canvas, 100, canvas.height / 2, 50, 5, './img/spaceship.png')

const levels = [
    new Level({
        index: 1,
        background: './img/bg1.jpg',
        scoreGoal: 1500,
        playerSpeed: 10,
        asteroidCluster: new AsteroidCluster(canvas, {
            min: 10, max: 14,
            small: { size: 40, speed: 3 },
            medium: { size: 65, speed: 2.5 },
            large: { size: 90, speed: 2 },
        }),
        starCluster: new StarCluster(canvas, { count: 3 }),
    }),
    new Level({
        index: 2,
        background: './img/bg2.jpg',
        scoreGoal: 3500,
        playerSpeed: 12.5,
        asteroidCluster: new AsteroidCluster(canvas, {
            min: 10, max: 14,
            small: { size: 50, speed: 4 },
            medium: { size: 75, speed: 3.5 },
            large: { size: 100, speed: 3 },
        }),
        starCluster: new StarCluster(canvas, { count: 2 }),
    }),
    new Level({
        index: 3,
        background: './img/bg3.jpg',
        scoreGoal: 7000,
        playerSpeed: 17.5,
        asteroidCluster: new AsteroidCluster(canvas, {
            min: 14, max: 18,
            small: { size: 55, speed: 5 },
            medium: { size: 80, speed: 4.5 },
            large: { size: 110, speed: 4 },
        }),
        starCluster: new StarCluster(canvas, { count: 2 }),
    }),
]

const game = new Game(canvas, spaceship, levels)
game.start()

function main() {
    game.update()
    game.render()
    requestAnimationFrame(main)
}
main()