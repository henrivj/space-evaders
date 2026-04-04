import { canvas, context } from "../index.js";

export default class Renderer {
    constructor(game) {
        this.game = game
    }

    renderClusters() {
        this.game.levels.forEach(level => {
            level.renderClusters()
        })
    }

    renderPlayers() {
        this.game.players.forEach((player) => {
            player.render();
        });
    }

    render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.renderPlayers()
        this.renderClusters()
    }
}