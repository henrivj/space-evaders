import { context, canvas } from '../index.js';

export default class Renderer {
	constructor(game) {
		this.game = game;
	}

	render() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		if (this.game.state !== 'menu') {
			this.renderBackground();
			this.renderEntities();
			this.renderHealth();
			this.renderScore();
		}

		switch (this.game.state) {
			case 'paused':
				this.renderScreen('JOGO PAUSADO', null, 'PRESSIONE ENTER PARA DESPAUSAR', '#33ff33', 0.75);
				break;
			case 'menu':
				this.renderScreen('SPACE EVADERS', `MAIOR PONTUAÇÃO: ${Number(localStorage.getItem('highScore'))}`, 'PRESSIONE ENTER PARA COMEÇAR', '#33ff33', 0);
				break;
			case 'victory':
				this.renderScreen('VOCÊ VENCEU!', `PONTUAÇÃO FINAL: ${this.game.score}`, 'PRESSIONE ENTER PARA VOLTAR AO MENU', '#33ff33', 0);
				break;
			case 'defeat':
				this.renderScreen('GAME OVER', `PONTUAÇÃO FINAL: ${this.game.score}`, 'PRESSIONE ENTER PARA VOLTAR AO MENU', '#ff4444', 0);
				break;
		}
	}

	renderBackground() {
		const currentLevel = this.game.levels[this.game.currentLevel];
		const previousLevel = this.game.levels[this.game.currentLevel - 1];

		if (currentLevel.bgOffset > 0 && this.game.state === 'playing') {
			currentLevel.bgOffset -= (this.game.players[0].speed + this.game.players[1].speed) / 2;
			if (previousLevel) context.drawImage(previousLevel.background, -canvas.width + currentLevel.bgOffset, 0, canvas.width, canvas.height);
		}
		if (currentLevel.bgOffset < 0) currentLevel.bgOffset = 0;

		context.drawImage(currentLevel.background, currentLevel.bgOffset, 0, canvas.width, canvas.height);
	}

	renderEntities() {
		this.game.players.forEach((player) => player.render());

		this.game.levels.forEach((level, index) => {
			if (index <= this.game.currentLevel) {
				level.clusters.forEach((cluster) => cluster.render());
			}
		});
	}

	renderHealth() {
		const barYPositions = [40, canvas.height - 40];

		this.game.players.forEach((player, playerIndex) => {
			const fillRatio = Math.max(0, player.health / player.maxHealth);
			let barColor = '#33ff33';
			if (fillRatio < 0.5) barColor = '#ff9800';
			if (fillRatio < 0.25) barColor = '#ff4444';

			const barX = 20;
			const barY = barYPositions[playerIndex];

			context.fillStyle = '#0a1f0a';
			context.fillRect(barX, barY, 300, 16);

			context.fillStyle = barColor;
			context.fillRect(barX, barY, 300 * fillRatio, 16);

			context.strokeStyle = '#1a3d1a';
			context.strokeRect(barX, barY, 300, 16);

			context.drawImage(player.sprite, barX + 300 * fillRatio - 12, barY, 24, 24);
		});
	}

	renderScore() {
		const totalScoreGoal = this.game.levels[this.game.levels.length - 1].scoreGoal;
		const scoreBarHeight = canvas.height * 0.6;
		const scoreBarX = canvas.width - 40;
		const scoreBarY = (canvas.height - scoreBarHeight) / 2;
		const filledHeight = scoreBarHeight * Math.min(this.game.score / totalScoreGoal, 1);

		context.fillStyle = '#000000';
		context.fillRect(scoreBarX, scoreBarY, 20, scoreBarHeight);

		context.fillStyle = '#33ff33';
		context.fillRect(scoreBarX, scoreBarY + scoreBarHeight - filledHeight, 20, filledHeight);

		context.strokeStyle = '#1a3d1a';
		this.game.levels.forEach((level, index) => {
			if (index === this.game.levels.length - 1) return;
			const tickY = scoreBarY + scoreBarHeight - (level.scoreGoal / totalScoreGoal) * scoreBarHeight;
			context.beginPath();
			context.moveTo(scoreBarX, tickY);
			context.lineTo(scoreBarX + 20, tickY);
			context.stroke();
		});

		context.textAlign = 'center';
		context.font = '10px "Press Start 2P", monospace';
		context.fillStyle = '#33ff33';
		context.fillText(this.game.score, scoreBarX + 10, scoreBarY + scoreBarHeight - filledHeight - 6);

		context.strokeRect(scoreBarX, scoreBarY, 20, scoreBarHeight);
	}

	renderScreen(title, subtitle, prompt, titleColor, opacity) {
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		context.fillStyle = `rgba(0,0,0,${opacity})`;
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.textAlign = 'center';
		context.font = 'bold 64px "Press Start 2P", monospace';
		context.fillStyle = titleColor;
		context.fillText(title, centerX, centerY - 80);

		if (subtitle) {
			context.font = '20px "Press Start 2P", monospace';
			context.fillStyle = '#aaaaaa';
			context.fillText(subtitle, centerX, centerY);
		}

		context.font = '14px "Press Start 2P", monospace';
		context.fillStyle = '#2a7a2a';
		context.fillText(prompt, centerX, centerY + 80);
	}
}
