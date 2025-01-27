class Tiles {
	constructor(index, row, col) {
		this.index = index;
		this.row = row;
		this.col = col;
		this.pieceIndex = null;
		this.playerIndex = null;
	}

	clear() {
		this.pieceIndex = null;
		this.playerIndex = null;
	}
}

export default Tiles;
