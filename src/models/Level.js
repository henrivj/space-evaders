export default class Level {
	constructor(scoreGoal, clusters, background) {
		this.scoreGoal = scoreGoal;
		this.clusters = clusters;
		this.background = new Image();
		this.background.src = background;
		this.bgOffset = 0;
	}

	isComplete(score) {
		return this.scoreGoal <= score;
	}
}
