class Piece {
	constructor(playerIndex, index, row, col, color, rank) {
		this.index = index;
		this.row = row;
		this.col = col;
		this.color = color;
		this.rank = rank;
		this.playerIndex = playerIndex;
		this.isCaptured = false;
	}

	setCaptured() {
		this.isCaptured = true;
		this.row = null;
		this.col = null;
	}
	setPosition(row, col) {
		this.row = row;
		this.col = col;
	}
}

export default Piece;
