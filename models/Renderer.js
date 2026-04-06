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
		if (this.bgOffset === undefined) {
			this.bgOffset = 0;
		}

		if (this.game.targetBgOffset !== undefined) {
			this.bgOffset += (this.game.targetBgOffset - this.bgOffset) * 0.1;
		}

		const finalGoal = this.game.levels[this.game.levels.length - 1].scoreGoal;
		const barH = canvas.height * 0.6;
		const barY = (canvas.height - barH) / 2;
		const barX = canvas.width - 50;

		this.drawBox({ x: barX, y: barY }, { w: 20, h: barH }, '#0a1f0a', '#fff', '#000');

		const p1H = Math.min(this.game.players[0].score / finalGoal, 1) * barH;
		const p2H = Math.min(this.game.players[1].score / finalGoal, 1) * barH;

		this.drawScoreFills(barX, barY, barH, p1H, p2H);
		this.drawLevelTicks(barX, barY, barH, finalGoal);
		this.drawScoreTags(barX, barY, barH, p1H, p2H);
	}

	drawScoreFills(barX, barY, barH, p1H, p2H) {
		context.fillStyle = '#505010';
		context.fillRect(barX + 2, barY + barH - p1H, 16, p1H);

		context.fillStyle = '#F0A840';
		context.fillRect(barX + 2, barY + barH - p2H, 16, p2H);

		const overlapH = Math.min(p1H, p2H);
		if (overlapH > 0) {
			context.fillStyle = '#A07C28';
			context.fillRect(barX + 2, barY + barH - overlapH, 16, overlapH);
		}
	}

	drawLevelTicks(barX, barY, barH, finalGoal) {
		context.strokeStyle = '#ffffff60';
		context.lineWidth = 1;
		this.game.levels.forEach((level, i) => {
			if (i === this.game.levels.length - 1) return;
			const tickY = barY + barH - (level.scoreGoal / finalGoal) * barH + this.bgOffset;
			context.beginPath();
			context.moveTo(barX, tickY);
			context.lineTo(barX + 20, tickY);
			context.stroke();
		});
	}

	drawScoreTags(barX, barY, barH, p1H, p2H) {
		const positions = [barY + barH - p1H, barY + barH - p2H];
		let isOverlapping = false;

		if (Math.abs(positions[0] - positions[1]) < 30) {
			isOverlapping = true;
			const mid = (positions[0] + positions[1]) / 2;
			positions[0] = mid - 15;
			positions[1] = mid + 15;
		}

		let tagCols = [barX - 64, barX - 64];
		if (isOverlapping) {
			tagCols = [barX - 88, barX - 64];
		}

		this.game.players.forEach((player, i) => {
			const tY = positions[i];
			const tTop = tY - 13;
			const tX = tagCols[i];

			let color = '#505010';
			if (i !== 0) {
				color = '#F0A840';
			}

			context.fillStyle = '#000000';
			context.beginPath();
			context.moveTo(tX, tTop);
			context.lineTo(tX + 44, tTop);
			context.lineTo(tX + 52, tY);
			context.lineTo(tX + 44, tTop + 26);
			context.lineTo(tX, tTop + 26);
			context.closePath();
			context.fill();

			context.strokeStyle = color;
			context.lineWidth = 2;
			context.stroke();

			context.drawImage(player.sprite, tX + 12, tY - 10, 20, 20);
		});
	}

	renderHealth() {
		const barW = 250;
		const barH = 20;
		const barX = 20;
		const barYPositions = [20, canvas.height - 20 - barH];

		this.game.players.forEach((player, playerIndex) => {
			const fillRatio = Math.max(0, player.health / player.maxHealth);
			const barY = barYPositions[playerIndex];

			let barColor;
			if (playerIndex === 0) {
				barColor = '#505010';
			} else {
				barColor = '#F0A840';
			}
			if (fillRatio < 0.5) barColor = '#ff9800';
			if (fillRatio < 0.25) barColor = '#ff4444';

			this.drawBox({ x: barX, y: barY }, { w: barW, h: barH }, '#0a1f0a', '#fff', '#000');

			context.fillStyle = barColor;
			context.fillRect(barX, barY, barW * fillRatio, barH);

			const spriteSize = 26;
			context.drawImage(player.sprite, barX + barW * fillRatio - spriteSize / 2, barY + barH / 2 - spriteSize / 2, spriteSize, spriteSize);
		});
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

		if (current.bgOffset > 0 && prev) {
			context.drawImage(prev.background, -canvas.width + current.bgOffset, 0, canvas.width, canvas.height);
		}

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
			this.renderScreen(`PLAYER ${this.game.winningPlayer} VENCEU!`, null, 'PRESSIONE ENTER PARA VOLTAR AO MENU', '#33ff33', 0.5);
		} else if (this.game.state === 'defeat') {
			this.renderScreen('GAME OVER', `PONTUAÇÃO FINAL: ${Math.floor(this.game.getScore())}`, 'PRESSIONE ENTER PARA VOLTAR AO MENU', '#ff4444', 0.5);
		}
	}
}
