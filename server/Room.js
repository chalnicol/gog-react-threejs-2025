class Room {
	constructor(
		id,
		hostData,
		playerInvitedId,
		type,
		privateMatch,
		allowSpectators,
		vsAi
	) {
		this.id = id; // Unique ID
		this.allowSpectators = allowSpectators; // Whether spectators are allowed or not
		this.type = type;
		this.privateMatch = privateMatch;
		this.playerInvitedId = playerInvitedId; // Unique
		this.status = "open";
		this.vsAi = vsAi;
		this.players = [];
		this.roundsPlayed = 0;
		this.turn = 0;
		this.phase = "";
		this.prepTime = type === "classic" ? 0 : 5; //seconds
		this.turnTime = type === "classic" ? 0 : 10;
		this.timer = null;
		this.pieces = [];
		this.grid = [];
		this.isFinished = false;
		this.movedPiece = null;
		this.capturePieces = [];

		//add host to players..
		this.addPlayer(hostData);
	}

	getPlayers(index = 0) {
		return index === 0 ? this.players : [...this.players].reverse();
	}

	isPlayerTurn(playerIndex = 0) {
		return this.players[playerIndex].turn === this.turn;
	}

	getMovedPiece(index) {
		const base = { ...this.movedPiece };

		if (index === 0) {
			base.row = 7 - base.row;
			base.col = 8 - base.col;
		}

		base.pieceIndex =
			index !== base.playerIndex ? base.pieceIndex + 21 : base.pieceIndex;

		return base;
	}

	getPieces(mirrored, playerIndex) {
		const mirrorPosition = (row, col) => ({ row: 7 - row, col: 8 - col });

		return mirrored
			? this.pieces
					.filter((piece) => piece.playerIndex === playerIndex)
					.map(({ row, col, color, rank }) => ({
						...mirrorPosition(row, col),
						color,
						rank,
					}))
			: this.pieces
					.filter((piece) => piece.playerIndex === playerIndex)
					.map(({ row, col, color, rank }) => ({
						row,
						col,
						color,
						rank,
					}));
	}

	initGame() {
		// Initialize game logic here
		this.setPlayersTurn();
		//..
		this.initGrid();
		this.initPlayerPieces(0);
		this.initPlayerPieces(1);
	}

	initGrid() {
		//make a 8x9 multi-dimensional array of grid points
		this.grid = Array.from({ length: 8 }, () => Array(9).fill(null));
		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 9; col++) {
				this.grid[row][col] = {
					index: row * 9 + col,
					row: row,
					col: col,
					pieceIndex: null,
				};
			}
		}
	}

	initPlayerPieces(playerIndex) {
		const ranks = this.generateRandomPieceRanks();

		for (let i = 0; i < 21; i++) {
			const row = Math.floor(i / 9);
			const col = i % 9;

			const newRow = playerIndex === 1 ? 5 + row : 2 - row;
			const newCol = playerIndex === 1 ? col : 8 - col;
			const piece = {
				index: playerIndex == 1 ? i + 21 : i,
				row: newRow,
				col: newCol,
				color: this.players[playerIndex].turn,
				rank: ranks[i],
				playerIndex: playerIndex,
			};
			this.pieces.push(piece);
			// this.grid[row * 9 + col].pieceIndex = piece.index;
			this.grid[newRow][newCol].pieceIndex = piece.index;
		}
	}

	generateRandomPiecesPosition(playerIndex) {
		const array = [];
		for (let i = 0; i < 26; i++) {
			const row = Math.floor(i / 9);
			const col = i % 9;
			array.push({ row: playerIndex === 0 ? row : 5 + row, col });
		}
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]]; // Swap elements
		}
		return array.slice(0, 21);
	}

	clearGrid(playerIndex) {
		for (let i = 0; i < 26; i++) {
			const row = Math.floor(i / 9);
			const col = i % 9;
			this.grid[playerIndex === 0 ? row : 5 + row][col].pieceIndex = null;
		}
	}

	generateRandomPieceRanks() {
		//..
		const array = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 13, 13,
			14,
		];
		//..
		return array.sort(() => Math.random() - 0.5);
	}

	isValidMove(socketId) {
		const player =
			this.players.find((plyr) => plyr.socketId === socketId) || null;

		if (!player || (this.phase == "main" && player.turn !== this.turn)) {
			return false;
		}

		return true;
	}

	startPrep() {
		this.phase = "prep";
	}

	endPrep() {
		if (this.vsAi) {
			this.clearGrid(1);
			this.generateRandomPiecesPosition(1);
		}
	}

	startGame() {
		//..
		this.phase = "main";
		this.turn = 0;
	}

	endGame() {
		//..
		this.isFinished = true;
	}

	addRound() {
		this.roundsPlayed++;
	}

	switchTurn() {
		this.turn = this.turn === 0 ? 1 : 0;
	}

	setPlayersTurn() {
		if (this.roundsPlayed == 0) {
			// const randomTurn = Math.floor(Math.random() * 2);
			const randomTurn = 0;
			this.players[0].turn = randomTurn;
			this.players[1].turn = randomTurn === 0 ? 1 : 0;
		} else {
			this.players[0].turn = this.players[0].turn === 0 ? 1 : 0;
			this.players[1].turn = this.players[1].turn === 0 ? 1 : 0;
		}
	}

	toSendGameIniData() {}

	addPlayer(playerData) {
		if (this.players.length < 2) {
			const toAddData = {
				wins: 0,
				loss: 0,
				turn: 0,
				isReady: false,
			};

			this.players.push({ ...playerData, ...toAddData });

			if (this.players.length >= 2) {
				this.status = "closed";
			}
		}
	}

	removePlayer(socketId) {
		this.players = this.players.filter(
			(player) => player.socketId !== socketId
		);
	}

	setPlayerReady(socketId) {
		const playerIndex = this.getPlayerIndex(socketId);

		if (playerIndex >= 0) {
			this.players[playerIndex].isReady = true;
		}
		//set ai player ready if vsAi
		if (this.vsAi) {
			const aiIndex = this.players.findIndex((plyr) => plyr.isAi === true);
			if (aiIndex >= 0) {
				this.players[aiIndex].isReady = true;
			}
		}
	}

	setBothPlayersReady() {
		this.players.forEach((player) => (player.isReady = true));
	}

	bothPlayersReady() {
		return this.players.every((player) => player.isReady);
	}
	setInvited(playerId) {
		this.playerInvitedId = playerId;
	}

	removeInvited() {
		this.playerInvitedId = "";
	}

	getPlayerIndex(socketId) {
		return this.players.findIndex((player) => player.socketId === socketId);
	}

	setPlayerMove(socketId, data) {
		const { row, col, pieceIndex } = data;
		const playerIndex = this.getPlayerIndex(socketId);

		if (playerIndex !== -1) {
			//.
			const newRow = playerIndex == 0 ? 7 - row : row;
			const newCol = playerIndex == 0 ? 8 - col : col;
			const newPieceIndex = playerIndex == 0 ? pieceIndex : 21 + pieceIndex;

			const toMoveRow = this.pieces[newPieceIndex].row;
			const toMoveCol = this.pieces[newPieceIndex].col;

			if (this.grid[newRow][newCol].pieceIndex == null) {
				this.grid[newRow][newCol].pieceIndex = newPieceIndex;
				this.pieces[newPieceIndex].row = newRow;
				this.pieces[newPieceIndex].col = newCol;

				this.grid[toMoveRow][toMoveCol].pieceIndex = null;

				console.log("empty");
			} else {
				if (this.phase == "prep") {
					//get current piece data of the piece to move..
					const residingPieceIndex = this.grid[newRow][newCol].pieceIndex;

					this.grid[toMoveRow][toMoveCol].pieceIndex = residingPieceIndex;
					this.pieces[residingPieceIndex].row = toMoveRow;
					this.pieces[residingPieceIndex].col = toMoveCol;

					this.grid[newRow][newCol].pieceIndex = newPieceIndex;
					this.pieces[newPieceIndex].row = newRow;
					this.pieces[newPieceIndex].col = newCol;
				} else {
					console.log("there is a challenge..");
					//TODO...
				}
			}

			this.movedPiece = {
				playerIndex: playerIndex,
				pieceIndex: pieceIndex,
				row: newRow,
				col: newCol,
			};
		} else {
			console.log("player not found..");
		}
	}

	stopTimers() {
		clearInterval(this.timer);
		this.timer = null;
	}
}

export default Room;
