class Move {
	constructor() {
		this.row = -1;
		this.col = -1;
		this.pieceIndex = -1;
		this.playerIndex = -1;
		this.winner = -1;
		this.clashResult = -1;
		this.captured = [];
	}

	setPiece(pieceData) {
		const { row, col, pieceIndex, playerIndex } = pieceData;
		this.row = row;
		this.col = col;
		this.pieceIndex = pieceIndex;
		this.playerIndex = playerIndex;
	}

	setWin(playerIndex) {
		// this.win = true;
		this.winner = playerIndex;
	}

	setCapturedPiece(pieceIndex, playerIndex) {
		this.captured.push({
			pieceIndex: playerIndex === 1 ? pieceIndex - 21 : pieceIndex,
			playerIndex: playerIndex,
		});
	}
	setClash(result) {
		this.clashResult = result;
	}
}

export default Move;
