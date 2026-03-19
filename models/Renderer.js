import { context, canvas } from '../index.js'

export default class Renderer {
    constructor(game) { this.game = game }

    render() {
        if (this.game.state !== 'menu') this.renderGame()

        const score = `PONTUAÇÃO FINAL: ${this.game.score}`
        switch (this.game.state) {
            case 'paused':  this.renderScreen('JOGO PAUSADO', null,  'PRESSIONE ENTER PARA DESPAUSAR',      '#33ff33', 0.75); break
            case 'menu':    this.renderScreen('SPACE EVADER', `MAIOR PONTUAÇÃO: ${Number(localStorage.getItem('highScore'))}`, 'PRESSIONE ENTER PARA COMEÇAR', '#33ff33', 0); break
            case 'victory': this.renderScreen('VOCÊ VENCEU!', score, 'PRESSIONE ENTER PARA VOLTAR AO MENU', '#33ff33', 0); break
            case 'defeat':  this.renderScreen('GAME OVER',    score, 'PRESSIONE ENTER PARA VOLTAR AO MENU', '#ff4444', 0); break
        }
    }

    renderGame() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        this.game.players.forEach(p => p.render())
        this.game.levels[this.game.currentLevel].clusters.forEach(c => c.render())
        this.renderHUD()
    }

    renderHUD() {
        this.game.players.forEach((player, i) => {
            const fill = Math.max(0, player.health / 500)
            const barX = 20
            const barY = i === 0 ? 40 : canvas.height - 40
            const color = fill < 0.25 ? '#ff4444' : fill < 0.5 ? '#ff9800' : '#33ff33'
            const iconSize = 24

            context.fillStyle = '#0a1f0a'
            context.fillRect(barX, barY, 300, 16)

            context.fillStyle = color
            context.shadowColor = color
            context.shadowBlur = 3
            context.fillRect(barX, barY, 300 * fill, 16)
            context.shadowBlur = 0

            context.strokeStyle = '#1a3d1a'
            context.strokeRect(barX, barY, 300, 16)

            context.drawImage(player.sprite, barX + 300 * fill - iconSize / 2, barY + 8 - iconSize / 2, iconSize, iconSize)
        })
    }

    renderScreen(title, subtitle, prompt, color, opacity) {
        const cx = canvas.width / 2
        const cy = canvas.height / 2

        context.fillStyle = `rgba(0,0,0,${opacity})`
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.textAlign = 'center'
        context.shadowColor = color
        context.shadowBlur = 3

        context.font = 'bold 64px "Press Start 2P", monospace'
        context.fillStyle = color
        context.fillText(title, cx, cy - 80)

        if (subtitle) {
            context.shadowBlur = 0
            context.font = '20px "Press Start 2P", monospace'
            context.fillStyle = '#aaaaaa'
            context.fillText(subtitle, cx, cy)
        }

        context.shadowBlur = 0
        context.font = '14px "Press Start 2P", monospace'
        context.fillStyle = '#2a7a2a'
        context.fillText(prompt, cx, cy + 80)
    }
}