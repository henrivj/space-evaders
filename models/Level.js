export default class Level {
    constructor(scoreGoal, playerSpeed, clusters, background) {
        this.scoreGoal = scoreGoal
        this.playerSpeed = playerSpeed
        this.clusters = clusters
        this.background = new Image()
        this.background.src = background
        this.bgOffset = 0
    }

    isComplete(score) {
        return this.scoreGoal <= score
    }
}