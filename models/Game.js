import Asteroid from './entities/Asteroid.js'
import Star from './entities/Star.js'

export default class Game {
    constructor(players, levels, keysPressed) {
        this.players = players
        this.levels = levels
        this.currentLevel = 0
        this.score = 0
        this.state = 'menu'
        this.keysPressed = keysPressed
    }

    reset() {

    }

    update() {
        this.handleGameState()
        if (this.state === 'playing') {
            this.handlePlayerMovement()
            this.players.forEach(player => { player.update() })

            this.levels[this.currentLevel].clusters.forEach(cluster => {
                cluster.update()
            });

            this.handlePlayerDeath()
            this.handleCurrentLevel()
            this.handlePreviousLevel()
            this.handleLevelTransition()
        }
    }

    handleGameState() {
        if (!this.keysPressed['Enter']) return

        switch (this.state) {
            case 'victory':
            case 'defeat':
                this.reset()
                this.state = 'menu'
                break
            case 'menu':
                this.reset()
            case 'paused':
                this.state = 'playing'
                break
            case 'playing':
                this.state = 'paused'
                break
        }
        this.keysPressed['Enter'] = false
    }

    handlePlayerMovement() {
        const w = this.keysPressed['w']
        const s = this.keysPressed['s']
        const arrowUp = this.keysPressed['ArrowUp']
        const arrowDown = this.keysPressed['ArrowDown']

        if (w && s || !w && !s) this.players[0].direction = 0
        else if (w) this.players[0].direction = -1
        else if (s) this.players[0].direction = 1

        if (arrowUp && arrowDown || !arrowUp && !arrowDown) this.players[1].direction = 0
        else if (arrowUp) this.players[1].direction = -1
        else if (arrowDown) this.players[1].direction = 1

        if (this.players[0].collidesWith(this.players[1])) {
            const p0 = this.players[0]
            const p1 = this.players[1]
            const isP0Above = p0.posY < p1.posY

            // nao deixa p0 passar p1
            if (isP0Above && p0.direction === 1) p0.direction = 0
            if (!isP0Above && p0.direction === -1) p0.direction = 0

            // nao deixa p1 passar p0
            if (isP0Above && p1.direction === -1) p1.direction = 0
            if (!isP0Above && p1.direction === 1) p1.direction = 0
        }
    }

    handleLevelTransition() {

    }

    processLevel(level, isCurrentLevel) {
        level.clusters.forEach(cluster => {
            cluster.entities.forEach(entity => {

                this.players.forEach(player => {
                    if (player.collidesWith(entity)) {
                        if (cluster.EntityType === Star) {
                            player.health++
                            this.score += 1000
                        } else {
                            player.health -= Math.max(Math.trunc(entity.size), 0)
                        }

                        if (isCurrentLevel) {
                            entity.reset()
                        } else {
                            entity.kill()
                        }
                    }
                })

                if (entity.hasPassedX(this.players[0].posX)) {  // player 0 so de referencia, os dois tem o mesmo X sempre
                    if (isCurrentLevel && cluster.EntityType === Asteroid && entity.canRespawn) {
                        this.score += Math.trunc(entity.size)
                    }
                    if (isCurrentLevel) {
                        entity.reset()
                    } else {
                        entity.kill()
                    }
                }
            })
        })

        level.clusters.forEach(cluster => cluster.update())
    }

    handlePlayerDeath() {
        this.players.forEach(player => {
            if (player.health <= 0) {
                this.state = 'defeat'

                if (this.score > localStorage.getItem('highScore')) {
                    localStorage.setItem('highScore', this.score)
                }
            }
        })
    }

    handleCurrentLevel() {
        this.processLevel(this.levels[this.currentLevel], true)
    }

    handlePreviousLevel() {
        if (this.currentLevel === 0) {
            return
        }
        this.processLevel(this.levels[this.currentLevel - 1], false)
    }
}