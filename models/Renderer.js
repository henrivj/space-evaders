import { context } from "../index.js";

export default class Renderer {
    constructor(game) {
        this.game = game
    }

    render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.game.players.forEach((player) => {
            player.render();
        });
    }
}