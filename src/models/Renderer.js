import { context, canvas } from '../index.js';

const HEALTH = {
	START_X: 20,
	BAR_WIDTH: 300,
	BAR_HEIGHT: 16,
	Y_OFFSET: 40,
	ICON_SIZE: 24,
	LOW_THRESHOLD: 0.25,
	MID_THRESHOLD: 0.5,
	COLOR_LOW: '#ff4444',
	COLOR_MID: '#ff9800',
	COLOR_HIGH: '#33ff33',
	BACKGROUND_COLOR: '#0a1f0a',
	BORDER_COLOR: '#1a3d1a'
};

const SCORE = {
	BAR_WIDTH: 20,
	BAR_MARGIN: 20,
	HEIGHT_RATIO: 0.6,
	LABEL_OFFSET: 6,
	BACKGROUND_COLOR: '#000000',
	FILL_COLOR: '#33ff33',
	BORDER_COLOR: '#1a3d1a',
	FONT: '10px "Press Start 2P", monospace'
};

const SCREEN = {
	TITLE_FONT: 'bold 64px "Press Start 2P", monospace',
	SUBTITLE_FONT: '20px "Press Start 2P", monospace',
	PROMPT_FONT: '14px "Press Start 2P", monospace',
	SHADOW_BLUR: 3,
	TITLE_Y_OFFSET: -80,
	PROMPT_Y_OFFSET: 80,
	SUBTITLE_COLOR: '#aaaaaa',
	PROMPT_COLOR: '#2a7a2a'
};

export default class Renderer {
	constructor(game) {
		this.game = game;
	}

	render() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		if (this.game.state !== 'menu') {
			this.renderGame();
		}

		switch (this.game.state) {
			case 'paused':
				this.renderScreen('JOGO PAUSADO', null, 'PRESSIONE ENTER PARA DESPAUSAR', HEALTH.COLOR_HIGH, 0.75);
				break;
			case 'menu':
				this.renderScreen('SPACE EVADERS', `MAIOR PONTUAÇÃO: ${Number(localStorage.getItem('highScore'))}`, 'PRESSIONE ENTER PARA COMEÇAR', HEALTH.COLOR_HIGH, 0);
				break;
			case 'victory':
				this.renderScreen('VOCÊ VENCEU!', `PONTUAÇÃO FINAL: ${this.game.score}`, 'PRESSIONE ENTER PARA VOLTAR AO MENU', HEALTH.COLOR_HIGH, 0);
				break;
			case 'defeat':
				this.renderScreen('GAME OVER', `PONTUAÇÃO FINAL: ${this.game.score}`, 'PRESSIONE ENTER PARA VOLTAR AO MENU', HEALTH.COLOR_LOW, 0);
				break;
		}
	}

	renderGame() {
		this.renderBackground();
		this.renderEntities();
		this.renderHUD();
	}

	renderBackground() {
		const currentLevel = this.game.levels[this.game.currentLevel];
		const previousLevel = this.game.levels[this.game.currentLevel - 1];

		if (currentLevel.bgOffset > 0) {
			currentLevel.bgOffset -= currentLevel.playerSpeed;
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

	renderHUD() {
		this.renderHealth();
		this.renderScore();
	}

	renderHealth() {
		const barYPositions = [HEALTH.Y_OFFSET, canvas.height - HEALTH.Y_OFFSET];

		this.game.players.forEach((player, playerIndex) => {
			const fillRatio = Math.max(0, player.health / player.maxHealth);
			let barColor = HEALTH.COLOR_HIGH;
			if (fillRatio < HEALTH.MID_THRESHOLD) {
				barColor = HEALTH.COLOR_MID;
			}
			if (fillRatio < HEALTH.LOW_THRESHOLD) {
				barColor = HEALTH.COLOR_LOW;
			}

			const barX = HEALTH.START_X;
			const barY = barYPositions[playerIndex];

			context.fillStyle = HEALTH.BACKGROUND_COLOR;
			context.fillRect(barX, barY, HEALTH.BAR_WIDTH, HEALTH.BAR_HEIGHT);

			context.fillStyle = barColor;
			context.fillRect(barX, barY, HEALTH.BAR_WIDTH * fillRatio, HEALTH.BAR_HEIGHT);

			context.strokeStyle = HEALTH.BORDER_COLOR;
			context.strokeRect(barX, barY, HEALTH.BAR_WIDTH, HEALTH.BAR_HEIGHT);

			context.drawImage(player.sprite, barX + HEALTH.BAR_WIDTH * fillRatio - HEALTH.ICON_SIZE / 2, barY + HEALTH.BAR_HEIGHT / 2 - HEALTH.ICON_SIZE / 2, HEALTH.ICON_SIZE, HEALTH.ICON_SIZE);
		});
	}

	renderScore() {
		const totalScoreGoal = this.game.levels[this.game.levels.length - 1].scoreGoal;
		const scoreBarHeight = canvas.height * SCORE.HEIGHT_RATIO;
		const scoreBarX = canvas.width - SCORE.BAR_MARGIN - SCORE.BAR_WIDTH;
		const scoreBarY = (canvas.height - scoreBarHeight) / 2;
		const filledHeight = scoreBarHeight * Math.min(this.game.score / totalScoreGoal, 1);

		context.fillStyle = SCORE.BACKGROUND_COLOR;
		context.fillRect(scoreBarX, scoreBarY, SCORE.BAR_WIDTH, scoreBarHeight);

		context.fillStyle = SCORE.FILL_COLOR;
		context.fillRect(scoreBarX, scoreBarY + scoreBarHeight - filledHeight, SCORE.BAR_WIDTH, filledHeight);

		context.strokeStyle = SCORE.BORDER_COLOR;
		this.game.levels.forEach((level, index) => {
			if (index === this.game.levels.length - 1) return;
			const tickY = scoreBarY + scoreBarHeight - (level.scoreGoal / totalScoreGoal) * scoreBarHeight;
			context.beginPath();
			context.moveTo(scoreBarX, tickY);
			context.lineTo(scoreBarX + SCORE.BAR_WIDTH, tickY);
			context.stroke();
		});

		context.textAlign = 'center';
		context.font = SCORE.FONT;
		context.fillStyle = SCORE.FILL_COLOR;
		context.fillText(this.game.score, scoreBarX + SCORE.BAR_WIDTH / 2, scoreBarY + scoreBarHeight - filledHeight - SCORE.LABEL_OFFSET);

		context.strokeRect(scoreBarX, scoreBarY, SCORE.BAR_WIDTH, scoreBarHeight);
	}

	renderScreen(title, subtitle, prompt, titleColor, overlayOpacity) {
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		context.fillStyle = `rgba(0,0,0,${overlayOpacity})`;
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.textAlign = 'center';
		context.font = SCREEN.TITLE_FONT;
		context.fillStyle = titleColor;
		context.fillText(title, centerX, centerY + SCREEN.TITLE_Y_OFFSET);

		if (subtitle) {
			context.font = SCREEN.SUBTITLE_FONT;
			context.fillStyle = SCREEN.SUBTITLE_COLOR;
			context.fillText(subtitle, centerX, centerY);
		}

		context.font = SCREEN.PROMPT_FONT;
		context.fillStyle = SCREEN.PROMPT_COLOR;
		context.fillText(prompt, centerX, centerY + SCREEN.PROMPT_Y_OFFSET);
	}
}