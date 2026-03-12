export default class Game {
    constructor(canvas, player, levels) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.player = player
        this.levels = levels

        this.levelIndex = 0
        this.score = 0

        this.state = 'menu'
        this.transition = 0

        this.invFrames = 0
        this.invDuration = 90
    }

    get level() {
        return this.levels[this.levelIndex]
    }

    get nextLevel() {
        return this.levels[this.levelIndex + 1]
    }

    start() {
        this.player.speed = this.level.playerSpeed
        this.player.startControls()

        window.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return
            if (this.state === 'menu') this.state = 'playing'
            if (this.state === 'victory' || this.state === 'defeat') this.restart()
        })
    }

    restart() {
        this.levelIndex = 0
        this.score = 0
        this.transition = 0
        this.invFrames = 0

        this.player.reset()
        this.player.speed = this.level.playerSpeed
        this.state = 'playing'
    }

    update() {
        if (this.state === 'defeat' || this.state === 'victory') return

        if (this.state === 'transition') {
            this.transition += 0.015
            if (this.transition >= 1) {
                this.levelIndex++
                this.player.speed = this.level.playerSpeed
                this.transition = 0
                this.state = 'playing'
            }
        }

        if (this.state === 'playing') {

            if (this.player.health <= 0) {
                this.transition += 0.02

                if (this.transition >= 1) {
                    this.state = 'defeat'
                    this.transition = 0
                }
            }

            else if (this.level.isComplete(this.score)) {

                if (!this.nextLevel) {
                    this.transition += 0.02

                    if (this.transition >= 1) {
                        this.state = 'victory'
                        this.transition = 0
                    }
                }

                else {
                    this.state = 'transition'
                    this.transition = 0
                }
            }
        }

        this.player.updateSprite()
        this.player.updatePosition()

        this.level.asteroidCluster.update()
        this.level.starCluster.update()

        if (this.state === 'transition' && this.nextLevel) {
            this.nextLevel.asteroidCluster.update()
        }

        this.handleCollisions()

        if (this.invFrames > 0) this.invFrames--
    }

    handleCollisions() {
        const level = this.level

        level.asteroidCluster.asteroids.forEach(a => {
            if (a.posX + a.size < 0) {
                this.score += a.size
                a.resetPosition()
                return
            }

            if (this.invFrames > 0) return

            if (this.player.collidesWith(a)) {
                this.player.takeDamage()
                a.resetPosition()
                this.invFrames = this.invDuration
            }
        })

        level.starCluster.stars.forEach(s => {
            if (this.player.collidesWith(s)) {
                s.collect(this.player, this)
            }
        })
    }

    render() {
        switch (this.state) {
            case 'playing':
                this.renderGame()
                break
            case 'transition':
                this.renderTransition()
                break
            case 'menu':
                this.renderScreen('SPACE EVADERS', null, 'PRESS ENTER TO START', '#ffffff')
                break
            case 'victory':
                this.renderScreen('YOU WIN!', `FINAL SCORE: ${this.score}`, 'PRESS ENTER TO RESTART', '#44ff88')
                break
            case 'defeat':
                this.renderScreen('GAME OVER', `FINAL SCORE: ${this.score}`, 'PRESS ENTER TO RESTART', '#ff4444')
                break
        }
    }

    renderGame() {
        const ctx = this.ctx
        const level = this.level

        ctx.globalAlpha = 1
        ctx.drawImage(level.background, 0, 0, this.canvas.width, this.canvas.height)

        level.asteroidCluster.render()
        level.starCluster.render()

        ctx.globalAlpha = this.invFrames > 0 && Math.sin(this.invFrames * 0.4) < 0 ? 0.2 : 1
        this.player.render()
        ctx.globalAlpha = 1

        this.renderHUD()
    }

    renderTransition() {
        const ctx = this.ctx
        const level = this.level
        const next = this.nextLevel

        const fade = this.transition

        ctx.globalAlpha = 1 - fade
        ctx.drawImage(level.background, 0, 0, this.canvas.width, this.canvas.height)

        if (next) {
            ctx.globalAlpha = fade
            ctx.drawImage(next.background, 0, 0, this.canvas.width, this.canvas.height)
        }

        ctx.globalAlpha = 1

        level.asteroidCluster.render()
        level.starCluster.render()

        if (next) next.asteroidCluster.render()

        ctx.globalAlpha = this.invFrames > 0 && Math.sin(this.invFrames * 0.4) < 0 ? 0.2 : 1
        this.player.render()
        ctx.globalAlpha = 1

        this.renderHUD()
    }

    renderHUD() {
        const ctx = this.ctx
        const level = this.level

        ctx.fillStyle = 'white'
        ctx.font = 'bold 22px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(`Score: ${this.score} / ${level.scoreGoal}`, 20, 32)

        ctx.font = '22px sans-serif'
        ctx.fillText('❤️'.repeat(this.player.health) + '🖤'.repeat(3 - this.player.health), 20, 62)

        ctx.textAlign = 'right'
        ctx.fillStyle = '#cccccc'
        ctx.font = '18px sans-serif'
        ctx.fillText(`Level ${level.index}`, this.canvas.width - 20, 32)

        ctx.textAlign = 'left'
    }

    renderScreen(title, subtitle, prompt, color) {
        const ctx = this.ctx
        const cx = this.canvas.width / 2
        const cy = this.canvas.height / 2

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        ctx.textAlign = 'center'

        ctx.fillStyle = color
        ctx.font = 'bold 72px sans-serif'
        ctx.fillText(title, cx, cy - 40)

        if (subtitle) {
            ctx.fillStyle = '#fff'
            ctx.font = '28px sans-serif'
            ctx.fillText(subtitle, cx, cy + 20)
        }

        ctx.fillStyle = subtitle ? '#888' : '#aaa'
        ctx.font = subtitle ? '20px sans-serif' : '24px sans-serif'
        ctx.fillText(prompt, cx, cy + (subtitle ? 70 : 40))

        ctx.textAlign = 'left'
    }
}