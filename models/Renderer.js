import { context, canvas } from '../index.js'

export default class Renderer {
    constructor(game) {
        this.game = game
        this.displayHealth = []
    }

    render() {
        if (this.game.state !== 'menu') this.renderGame()

        switch (this.game.state) {
            case 'paused':
                this.renderScreen('JOGO PAUSADO', null, 'PRESSIONE ENTER PARA DESPAUSAR', '#33ff33', 0.75)
                break
            case 'menu':
                this.renderScreen('SPACE EVADER', `MAIOR PONTUAÇÃO: ${this.highScore}`, 'PRESSIONE ENTER PARA COMEÇAR', '#33ff33')
                break
            case 'victory':
                this.renderScreen('VOCÊ VENCEU!', `PONTUAÇÃO FINAL: ${this.game.player.score}`, 'PRESSIONE ENTER PARA VOLTAR AO MENU', '#33ff33', 0)
                break
            case 'defeat':
                this.renderScreen('GAME OVER', `PONTUAÇÃO FINAL: ${this.game.player.score}`, 'PRESSIONE ENTER PARA VOLTAR AO MENU', '#ff4444', 0)
                break
        }
    }

    renderGame() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        this.game.players.forEach(player => player.render())
        this.game.levels[this.game.currentLevel].clusters.forEach(cluster => {
            cluster.render()
        });
        this.renderHUD()
    }

    renderHUD() {
        const smooth = 0.05
        const barWidth = 300
        const barHeight = 16
        const marginLeft = 20
        const marginTop = 40
        const marginBottom = 40

        this.game.players.forEach((player, index) => {
            if (this.displayHealth[index] === undefined) {
                this.displayHealth[index] = player.health
            }

            this.displayHealth[index] += (player.health - this.displayHealth[index]) * smooth

            const fill = Math.max(this.displayHealth[index] / 500, 0)

            let barY = marginTop
            if (index === 1) barY = canvas.height - marginBottom

            let color = '#33ff33'
            if (fill < 0.5) color = '#ff9800'
            if (fill < 0.25) color = '#ff4444'

            context.font = 'bold 10px "Press Start 2P", monospace'
            context.fillStyle = '#2a7a2a'
            context.textAlign = 'left'
            context.fillText(`P${index + 1}`, marginLeft, barY - 8)

            context.fillStyle = '#0a1f0a'
            context.fillRect(marginLeft, barY, barWidth, barHeight)

            context.fillStyle = color
            context.shadowColor = color
            context.shadowBlur = 3
            context.fillRect(marginLeft, barY, barWidth * fill, barHeight)

            context.shadowBlur = 0
            context.strokeStyle = '#1a3d1a'
            context.strokeRect(marginLeft, barY, barWidth, barHeight)
        })

        const scoreY = marginTop - 10

        context.font = '14px "Press Start 2P", monospace'
        context.fillStyle = '#33ff33'
        context.shadowColor = '#33ff33'
        context.shadowBlur = 6
        context.textAlign = 'center'
        context.fillText(`${this.game.score}`, canvas.width / 2, scoreY)
        context.shadowBlur = 0
    }

    renderScreen(title, subtitle, prompt, color, opacity) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const lineHeight = 80

        context.fillStyle = `rgba(0, 0, 0, ${opacity})`
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.textAlign = 'center'
        context.font = 'bold 64px "Press Start 2P", monospace'
        context.fillStyle = color
        context.shadowColor = color
        context.shadowBlur = 24
        context.fillText(title, centerX, centerY - lineHeight)

        if (subtitle) {
            context.font = '20px "Press Start 2P", monospace'
            context.fillStyle = '#aaaaaa'
            context.shadowBlur = 0
            context.fillText(subtitle, centerX, centerY)
        }

        context.font = '14px "Press Start 2P", monospace'
        context.fillStyle = '#2a7a2a'
        context.shadowBlur = 0
        context.fillText(prompt, centerX, centerY + lineHeight)
    }
}