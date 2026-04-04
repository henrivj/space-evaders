// Level.js
export default class Level {
	constructor(index, scoreGoal, clusters, background) {
		this.index = index;
		this.scoreGoal = scoreGoal;
		this.clusters = clusters;
		this.background = new Image();
		this.background.src = background;
		this.bgOffset = 0;
	}

	isComplete(score) {
		return score >= this.scoreGoal;
	}

	drainClusters() {
		this.clusters.forEach(cluster => {
			cluster.drain()
		});
	}

	updateClusters() {
		this.clusters.forEach(cluster => {
			cluster.update()
		});
	}

	renderClusters() {
		this.clusters.forEach(cluster => {
			cluster.render()
		});
	}
}
