export default class Level {
    constructor({ index, background, scoreGoal, playerSpeed, asteroidCluster, starCluster }) {
        this.index = index
        this.background = new Image()
        this.background.src = background
        this.scoreGoal = scoreGoal
        this.playerSpeed = playerSpeed
        this.asteroidCluster = asteroidCluster
        this.starCluster = starCluster
    }

    isComplete(score) {
        return score >= this.scoreGoal
    }
}