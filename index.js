import Game from './models/Game.js'
import Renderer from './models/Renderer.js'
import Level from './models/Level.js'
import Cluster from './models/Cluster.js'

import Spaceship from './models/entities/Spaceship.js'
import Asteroid from './models/entities/Asteroid.js'
import Star from './models/entities/Star.js'

export const canvas = document.getElementById('canvas')
export const context = canvas.getContext('2d')
// so pra nao ficar passando o canvas toda hora, ja que estou separando as classes
// nao sei se e boa pratica exportar uma variavel, mas achei legal isso ser uma possibilidade

const keysPressed = {}
document.addEventListener('keydown', e => keysPressed[e.key] = true)
document.addEventListener('keyup', e => keysPressed[e.key] = false)

const PLAYER_SPEED = 4
const PLAYER_SIZE = 50

const player1 = new Spaceship(PLAYER_SIZE, canvas.height / 3, PLAYER_SPEED, PLAYER_SIZE, './img/spaceship0.png')
const player2 = new Spaceship(PLAYER_SIZE, canvas.height / 3 * 2, PLAYER_SPEED, PLAYER_SIZE, './img/spaceship1.png')

const levelConfigs = [
    {
        scoreGoal: 2500,
        playerSpeed: 6,
        clusters: [
            new Cluster(Asteroid, 10, 1.5, 2.5, 25, 55, 2, './img/asteroid.png'),
            new Cluster(Star,     1,  0.8, 1.5, 25, 30, 5, './img/star.png')
        ],
        background: './img/levels/level_1.jpg'
    },
    {
        scoreGoal: 5000,
        playerSpeed: 7.5,
        clusters: [
            new Cluster(Asteroid, 20, 2.5, 4,   55, 80, 2, './img/asteroid.png'),
            new Cluster(Star,     1,  1,   2,   22, 27, 5, './img/star.png')
        ],
        background: './img/levels/level_2.jpg'
    },
    {
        scoreGoal: 10000,
        playerSpeed: 9,
        clusters: [
            new Cluster(Asteroid, 30, 3.5, 5.5, 80, 120, 2, './img/asteroid.png'),
            new Cluster(Star,     1,  1.5, 2.5, 18, 23, 5, './img/star.png')
        ],
        background: './img/levels/level_3.jpg'
    }
]

const levels = []
for (let i = 0; i < levelConfigs.length; i++) {
    const config = levelConfigs[i]
    levels.push(new Level(config.scoreGoal, config.playerSpeed, config.clusters, config.background))
}

const game = new Game([player1, player2], levels, keysPressed)
const renderer = new Renderer(game)

function main() {
    game.update()
    renderer.render()
    requestAnimationFrame(main)
}

main()