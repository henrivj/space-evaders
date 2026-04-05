import { canvas, context, keysPressed } from '../index.js';

export default class Renderer {
	constructor(game) {
		this.game = game;
		this.sidebarKeys = Array.from(document.getElementsByClassName('key')); // https://stackoverflow.com/a/222847
	}

	drawBox(position, size, fill = '#000', stroke = '#fff', shadow = '#fff') {
		const { x, y } = position;
		const { w, h } = size;
		context.fillStyle = shadow;
		context.fillRect(x + 3, y + 3, w, h);
		context.fillStyle = fill;
		context.fillRect(x, y, w, h);
		context.strokeStyle = stroke;
		context.lineWidth = 2;
		context.strokeRect(x, y, w, h);
	}

	drawText(text, position, size, color = '#fff', shadow = null, align = 'center') {
		const { x, y } = position;
		context.textAlign = align;
		context.font = `${size}px "Press Start 2P", monospace`;
		if (shadow) {
			context.fillStyle = shadow;
			context.fillText(text, x + 3, y + 3);
		}
		context.fillStyle = color;
		context.fillText(text, x, y);
	}

	renderScreen(title, subtitle, prompt, shadowColor, opacity) {
		const { width, height } = canvas;
		const centerX = width / 2;
		const centerY = height / 2;

		context.fillStyle = `rgba(0,0,0,${opacity})`;
		context.fillRect(0, 0, width, height);

		this.drawText(title, { x: centerX, y: centerY - 80 }, 64, '#fff', shadowColor);
		if (subtitle) this.drawText(subtitle, { x: centerX, y: centerY }, 20, '#aaa');
		this.drawText(prompt, { x: centerX, y: centerY + 80 }, 14, '#fff');
	}

	renderScore() {
		const totalGoal = this.game.levels[this.game.levels.length - 1].scoreGoal;
		const h = canvas.height * 0.6;
		const x = canvas.width - 40;
		const y = (canvas.height - h) / 2;
		const fillH = h * Math.min(this.game.getScore() / totalGoal, 1);

		this.drawBox({ x, y }, { w: 20, h });
		context.fillStyle = '#fff';
		context.fillRect(x, y + h - fillH, 20, fillH);

		context.strokeStyle = '#333';
		this.game.levels.forEach((level, i) => {
			if (i === this.game.levels.length - 1) return;
			const tickY = y + h - (level.scoreGoal / totalGoal) * h;
			context.beginPath();
			context.moveTo(x, tickY);
			context.lineTo(x + 20, tickY);
			context.stroke();
		});

		this.drawText(Math.floor(this.game.getScore()), { x: x + 10, y: y + h - fillH - 10 }, 10);
	}

	renderHealth() {
		this.game.players.forEach((player, i) => {
			this.renderPlayerStatus(player, i);
		});
	}

	renderPlayerStatus(player, index) {
		const { health, maxHealth, score, sprite } = player;
		const levels = this.game.levels;
		const totalGoal = levels[levels.length - 1].scoreGoal;
		const healthRatio = Math.max(0, health / maxHealth);
		const scoreRatio = Math.max(0, score / totalGoal);

		const cardW = 250;
		const cardH = 64;
		const startX = 20;

		let startY = 20;
		if (index === 1) {
			startY = canvas.height - cardH - 20;
		}

		const pos = { x: startX, y: startY };
		const size = { w: cardW, h: cardH };
		this.drawBox(pos, size, 'rgba(0,0,0,0.8)', '#fff', 'rgba(255,255,255,0.2)');

		const sSize = 40;
		const spriteX = startX + 12;
		const spriteY = startY + (cardH - sSize) / 2;
		context.drawImage(sprite, spriteX, spriteY, sSize, sSize);

		const infoX = spriteX + sSize + 15;
		const barW = cardW - (infoX - startX) - 15;

		this.drawText(`PLAYER ${index + 1}`, { x: infoX, y: startY + 18 }, 10, '#fff', null, 'left');

		const hpY = startY + 28;
		this.drawBox({ x: infoX, y: hpY }, { w: barW, h: 10 }, '#222', '#fff', '#000');

		let hpColor;
		if (healthRatio <= 0) {
			hpColor = `rgb(${Math.floor(180 + 75 * Math.abs(Math.sin(Date.now() / 200)))}, 0, 0)`;
		} else if (healthRatio <= 0.25) {
			hpColor = '#ff2222';
		} else if (healthRatio <= 0.5) {
			hpColor = '#ff8800';
		} else if (healthRatio <= 0.75) {
			hpColor = '#ffdd00';
		} else {
			hpColor = '#44ff44';
		}

		context.fillStyle = hpColor;
		context.fillRect(infoX, hpY, barW * healthRatio, 10);

		const scY = hpY + 16;
		this.drawBox({ x: infoX, y: scY }, { w: barW, h: 4 }, '#222', '#888', '#000');
		context.fillStyle = '#fff';
		context.fillRect(infoX, scY, barW * scoreRatio, 4);

		const scoreText = Math.floor(score);
		this.drawText(scoreText, { x: startX + cardW - 12, y: startY + 18 }, 8, '#aaa', null, 'right');
	}

	renderPlayers() {
		this.game.players.forEach((player) => {
			if (player.size <= 0) return;
			player.render();
		});
	}

	renderClusters() {
		this.game.levels.forEach((level, index) => {
			if (index > this.game.currentLevel) return;
			level.renderClusters();
		});
	}

	renderBackground() {
		const game = this.game;
		const current = game.levels[game.currentLevel];
		const prev = game.levels[game.currentLevel - 1];

		if (current.bgOffset > 0 && game.state === 'playing') {
			current.bgOffset -= (game.players[0].speed + game.players[1].speed) / 2;
			if (prev) context.drawImage(prev.background, -canvas.width + current.bgOffset, 0, canvas.width, canvas.height);
		}
		if (current.bgOffset < 0) current.bgOffset = 0;

		context.drawImage(current.background, current.bgOffset, 0, canvas.width, canvas.height);
	}

	renderSidebarKeys() {
		this.sidebarKeys.forEach((key) => {
			if (keysPressed[key.id]) {
				key.classList.add('key-down');
			} else {
				key.classList.remove('key-down');
			}
		});
	}

	render() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		this.renderSidebarKeys();

		if (this.game.state !== 'menu') {
			this.renderBackground();
			this.renderClusters();
			this.renderPlayers();

			this.renderHealth();
			this.renderScore();
		}

		if (this.game.state === 'pause') {
			this.renderScreen('JOGO PAUSADO', null, 'PRESSIONE ENTER PARA DESPAUSAR', '#fff', 0.75);
		} else if (this.game.state === 'menu') {
			const hi = `MAIOR PONTUAÇÃO: ${Number(localStorage.getItem('highScore'))}`;
			this.renderScreen('SPACE EVADERS', hi, 'PRESSIONE ENTER PARA COMEÇAR', '#fff', 0);
		} else if (this.game.state === 'victory') {
			this.renderScreen('VOCÊ VENCEU!', `PONTUAÇÃO FINAL: ${Math.floor(this.game.getScore())}`, 'PRESSIONE ENTER PARA VOLTAR AO MENU', '#33ff33', 0.5);
		} else if (this.game.state === 'defeat') {
			this.renderScreen('GAME OVER', `PONTUAÇÃO FINAL: ${Math.floor(this.game.getScore())}`, 'PRESSIONE ENTER PARA VOLTAR AO MENU', '#ff4444', 0.5);
		}
	}
}
