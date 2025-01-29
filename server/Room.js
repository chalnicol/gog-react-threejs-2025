import Utils from "./Utils.js";
import Piece from "./Piece.js";
import Tiles from "./Tiles.js";
import Move from "./Move.js";

class Room {
	constructor(id, host, type, isPrivate, allowSpectators, vsAi) {
		this.id = id; // Unique ID
		this.allowSpectators = allowSpectators; // Whether spectators are allowed or not
		this.type = type;
		this.isPrivate = isPrivate;
		this.playerInvitedId = "";
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
		this.tiles = [];
		this.isFinished = false;
		this.move = null;
		this.winner = -1;
		//add host to players..
		// this.winData = null;
		this.addPlayer(host);
	}

	getPlayers(index = 0) {
		return index === 0 ? this.players : [...this.players].reverse();
	}

	isPlayerTurn(playerIndex = 0) {
		return this.players[playerIndex].turn === this.turn;
	}

	getMove(index) {
		const base = { ...this.move };

		if (index === 0) {
			base.row = 7 - base.row;
			base.col = 8 - base.col;
		}

		base.pieceIndex =
			index !== base.playerIndex ? base.pieceIndex + 21 : base.pieceIndex;

		base.captured = base.captured.map((captured) => ({
			playerIndex:
				index == 0
					? captured.playerIndex
					: captured.playerIndex == 0
					? 1
					: 0,
			pieceIndex:
				index !== captured.playerIndex
					? captured.pieceIndex + 21
					: captured.pieceIndex,
		}));

		base.playerIndex =
			index === 0 ? base.playerIndex : base.playerIndex == 0 ? 1 : 0;

		return base;
	}

	getPieces(mirrored, withRanks, playerIndex) {
		const mirrorPosition = (row, col) => ({ row: 7 - row, col: 8 - col });

		return mirrored
			? this.pieces
					.filter((piece) => piece.playerIndex === playerIndex)
					.map(({ row, col, color, rank }) => ({
						...mirrorPosition(row, col),
						color,
						...(withRanks && { rank }),
					}))
			: this.pieces
					.filter((piece) => piece.playerIndex === playerIndex)
					.map(({ row, col, color, rank }) => ({
						row,
						col,
						color,
						...(withRanks && { rank }),
					}));
	}

	getPiecesRanks(playerIndex) {
		return this.pieces
			.filter((piece) => piece.playerIndex === playerIndex)
			.map(({ rank }) => ({ rank }));
	}

	getWinningPromptMessage() {
		return `${this.players[this.winner].username} has won the game!`;
	}
	initGame() {
		// Initialize game logic here
		this.setPlayersTurn();
		//..
		this.initGrid();
		this.initPlayerPieces(0);
		this.initPlayerPieces(1);
		this.initFieldColor();
	}

	initGrid() {
		//make a 8x9 multi-dimensional array of grid points
		this.tiles = Array.from({ length: 8 }, () => Array(9).fill(null));

		//create tiles..
		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 9; col++) {
				this.tiles[row][col] = new Tiles(row * 9 + col, row, col);
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

			const piece = new Piece(
				playerIndex,
				playerIndex == 1 ? i + 21 : i,
				newRow,
				newCol,
				this.players[playerIndex].turn,
				ranks[i]
			);
			this.pieces.push(piece);
			// this.tiles[row * 9 + col].pieceIndex = piece.index;
			this.tiles[newRow][newCol].pieceIndex = piece.index;
			this.tiles[newRow][newCol].playerIndex = playerIndex;
		}
	}

	initFieldColor() {
		const fieldColor = Math.floor(Math.random() * 2);
		this.players[0].fieldColor = fieldColor;
		this.players[1].fieldColor = fieldColor === 0 ? 1 : 0;
	}

	generateRandomPiecesPosition(playerIndex) {
		const positions = [];
		for (let i = 0; i < 26; i++) {
			const row = Math.floor(i / 9);
			const col = i % 9;
			positions.push({ row: playerIndex === 0 ? row : 5 + row, col });
		}
		//randomize elements order..
		const shuffledPositions = Utils.shuffleList(positions);
		return shuffledPositions.slice(0, 21);
	}

	generateFixedPosition() {
		let positions = [];
		for (let i = 0; i < 21; i++) {
			const row = Math.floor(i / 7);
			const col = i % 7;
			positions.push({ row: 5 + row, col: col });
		}
		return positions;
	}

	generateAIPosition() {
		this.clearGrid(1);
		// const newPost = this.generateRandomPiecesPosition(1);
		const newPost = this.generateFixedPosition();

		newPost.forEach((post, i) => {
			this.pieces[i + 21].row = post.row;
			this.pieces[i + 21].col = post.col;
			this.tiles[post.row][post.col].pieceIndex = this.pieces[i + 21].index;
			this.tiles[post.row][post.col].playerIndex = 1;
		});
	}

	generateAIRandomMove() {
		const activePieces = this.pieces.filter(
			(piece) => !piece.isCaptured && piece.playerIndex === 1
		);

		const shuffledActivePieces = Utils.shuffleList(activePieces);

		let index = 0;

		while (index < shuffledActivePieces.length) {
			const piece = shuffledActivePieces[index];

			// console.log("org", piece.row, piece.col);
			const adjacentPositions = Utils.getAdjacent(piece.row, piece.col);

			let availablePositions = [];
			// adjacentPositions.forEach((position) => {
			// 	// console.log("pos", position.row, position.col);

			// 	const gridPost = this.tiles[position.row][position.col];
			// 	if (gridPost.playerIndex !== 1) {
			// 		availablePositions.push({
			// 			row: position.row,
			// 			col: position.col,
			// 		});
			// 	}
			// });
			// if (availablePositions.length >= 1) {
			// 	const randomIndex = Math.floor(
			// 		Math.random() * availablePositions.length
			// 	);
			// 	const targetPosition = availablePositions[randomIndex];
			// 	return {
			// 		row: targetPosition.row,
			// 		col: targetPosition.col,
			// 		pieceIndex: piece.index,
			// 	};
			// } else {
			// 	index++;
			// 	console.log("c", index);
			// }

			const position = adjacentPositions[0];
			if (this.tiles[position.row][position.col].playerIndex !== 1) {
				// console.log("move", piece.row, piece.col, position.row, position.col);
				return {
					row: position.row,
					col: position.col,
					pieceIndex: piece.index,
				};
			} else {
				index++;
				// console.log("c", index);
			}
		}

		return null;
	}

	clearGrid(playerIndex) {
		for (let i = 0; i < 26; i++) {
			const row = Math.floor(i / 9);
			const col = i % 9;
			this.tiles[playerIndex === 0 ? row : 5 + row][col].pieceIndex = null;
			this.tiles[playerIndex === 0 ? row : 5 + row][col].playerIndex = null;
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

	isValidMove(socketId, data) {
		const player =
			this.players.find((plyr) => plyr.socketId === socketId) || null;

		// console.log("isMoveGood", this.isMoveGood(socketId, data));
		if (
			!player ||
			(this.phase == "main" && player.turn !== this.turn) ||
			(this.phase == "main" && !this.isMoveGood(socketId, data))
		)
			return false;

		return true;
	}

	isMoveGood(socketId, data) {
		const { row, col, pieceIndex } = data;

		const playerIndex = this.players.findIndex(
			(player) => player.socketId === socketId
		);

		const piece =
			this.pieces[playerIndex == 0 ? pieceIndex : pieceIndex + 21] || null;

		if (playerIndex == -1 || !piece) return false;

		//get if move is
		const newRow = playerIndex == 0 ? 7 - row : row;
		const newCol = playerIndex == 0 ? 8 - col : col;

		const adjacentTiles = Utils.getAdjacent(piece.row, piece.col);

		const isMoveAdjacent =
			adjacentTiles.find(
				(tile) => tile.row == newRow && tile.col == newCol
			) || null;

		if (isMoveAdjacent == null) return false;

		//get current residing pieceIndex
		const residingIndex = this.tiles[newRow][newCol].pieceIndex;
		if (
			residingIndex !== null &&
			this.pieces[residingIndex].playerIndex === playerIndex
		)
			return false;

		return true;
	}

	startPrep() {
		this.phase = "prep";
	}

	endPrep() {
		this.players.forEach((player) => (player.isReady = true));
		if (this.vsAi) {
			this.generateAIPosition();
		}
	}

	startGame() {
		//..
		this.phase = "main";
		this.turn = 0;
	}

	setWinner(playerIndex) {
		this.players[playerIndex].wins += 1;
		this.players[playerIndex == 0 ? 1 : 0].loss += 1;

		this.winner = playerIndex;
		this.isFinished = true;
		console.log(`${this.players[playerIndex].username} wins!!`);
	}

	checkWin(pieceIndex) {
		const piece = this.pieces[pieceIndex];
		if (!piece) return;

		console.log("checking..");

		if (piece.isAtThreshold() && piece.rank == 14) {
			if (this.hasAdjacentOpponentPieces(pieceIndex)) {
				this.players[piece.playerIndex].isReached = true;
				console.log("has opps lurking..");
			} else {
				this.setWinner(piece.playerIndex);
				console.log("winner..");
			}
		}
	}

	clockExpired() {
		const winner = this.players[0].turn == this.turn ? 1 : 0;
		this.setWinner(winner);
		console.log(
			`${this.players[winner == 0 ? 1 : 0].username} clock has expired.`
		);
	}

	hasAdjacentOpponentPieces(pieceIndex) {
		const piece = this.pieces[pieceIndex];
		const adjacents = Utils.getAdjacent(piece.row, piece.col);
		for (let adj of adjacents) {
			const tile = this.tiles[adj.row][adj.col];
			if (
				tile.playerIndex !== null &&
				tile.playerIndex !== piece.playerIndex
			) {
				return true;
			}
		}
		return false;
	}

	addRound() {
		this.roundsPlayed++;
	}

	switchTurn() {
		this.turn = this.turn === 0 ? 1 : 0;

		//check if there is player that is winning..
		const playerIndex = this.players.findIndex((p) => p.turn === this.turn);
		if (playerIndex >= 0 && this.players[playerIndex].isReached) {
			this.setWinner(playerIndex);
		}
	}

	setPlayersTurn() {
		if (this.roundsPlayed == 0) {
			const randomTurn = Math.floor(Math.random() * 2);
			// const randomTurn = 0;
			this.players[0].turn = randomTurn;
			this.players[1].turn = randomTurn === 0 ? 1 : 0;
		} else {
			this.players[0].turn = this.players[0].turn === 0 ? 1 : 0;
			this.players[1].turn = this.players[1].turn === 0 ? 1 : 0;
		}
	}

	addPlayer(player) {
		if (this.players.length < 2) {
			this.players.push(player);

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

	setAiMove(data) {
		const { row, col, pieceIndex } = data;
		this.updateGrid(1, pieceIndex, row, col, true);
	}

	setPlayerMove(socketId, data) {
		const { row, col, pieceIndex } = data;
		const playerIndex = this.getPlayerIndex(socketId);

		if (playerIndex === -1) return;
		//.
		const newRow = playerIndex == 0 ? 7 - row : row;
		const newCol = playerIndex == 0 ? 8 - col : col;
		const newPieceIndex = playerIndex == 0 ? pieceIndex : 21 + pieceIndex;

		this.updateGrid(playerIndex, newPieceIndex, newRow, newCol);
	}

	updateGrid(playerIndex, toMovePieceIndex, newRow, newCol, isAi = false) {
		const toMovePieceRow = this.pieces[toMovePieceIndex].row;
		const toMovePieceCol = this.pieces[toMovePieceIndex].col;

		//set move..
		let newMove = new Move();
		newMove.setPiece({
			row: newRow,
			col: newCol,
			pieceIndex:
				playerIndex == 1 ? toMovePieceIndex - 21 : toMovePieceIndex,
			playerIndex: playerIndex,
		});
		//? playerIndex == 1 ? toMovePieceIndex - 21 : toMovePieceIndex

		if (this.tiles[newRow][newCol].pieceIndex == null) {
			//clear previous post..
			this.tiles[toMovePieceRow][toMovePieceCol].clear();

			//set new indexes for new post..
			this.tiles[newRow][newCol].pieceIndex = toMovePieceIndex;
			this.tiles[newRow][newCol].playerIndex = playerIndex;

			//set piece new post..
			this.pieces[toMovePieceIndex].setPosition(newRow, newCol);

			this.checkWin(toMovePieceIndex);
		} else {
			const stationedPieceIndex = this.tiles[newRow][newCol].pieceIndex;

			if (this.phase == "prep") {
				//get current piece data of the piece to move..
				this.tiles[newRow][newCol].pieceIndex = toMovePieceIndex;
				this.pieces[toMovePieceIndex].setPosition(newRow, newCol);

				this.tiles[toMovePieceRow][toMovePieceCol].pieceIndex =
					stationedPieceIndex;
				this.pieces[stationedPieceIndex].setPosition(
					toMovePieceRow,
					toMovePieceCol
				);

				console.log("switch");
			} else {
				//clear current tile..
				this.tiles[toMovePieceRow][toMovePieceCol].clear();

				const challengeResult = this.compareRanks(
					this.pieces[toMovePieceIndex].rank,
					this.pieces[stationedPieceIndex].rank
				);
				newMove.setClash(challengeResult);

				switch (challengeResult) {
					case 1:
						//toMovePiece wins the challenge
						this.pieces[stationedPieceIndex].setCaptured();
						this.pieces[toMovePieceIndex].setPosition(newRow, newCol);

						this.tiles[newRow][newCol].pieceIndex = toMovePieceIndex;
						this.tiles[newRow][newCol].playerIndex = playerIndex;

						newMove.setCapturedPiece(
							stationedPieceIndex,
							playerIndex == 1 ? 0 : 1
						);

						if (this.pieces[stationedPieceIndex].rank === 14) {
							this.setWinner(playerIndex);
						}

						break;
					case 2:
						//stationed piece wins the challenge
						this.pieces[toMovePieceIndex].setCaptured();

						newMove.setCapturedPiece(toMovePieceIndex, playerIndex);

						if (this.pieces[toMovePieceIndex].rank === 14) {
							this.setWinner(playerIndex == 0 ? 1 : 0);
						}

						break;
					case 0:
						//tie..
						this.pieces[toMovePieceIndex].setCaptured();
						this.pieces[stationedPieceIndex].setCaptured();
						this.tiles[newRow][newCol].clear();

						newMove.setCapturedPiece(toMovePieceIndex, playerIndex);
						newMove.setCapturedPiece(
							stationedPieceIndex,
							playerIndex == 1 ? 0 : 1
						);

						if (
							this.pieces[toMovePieceIndex].rank === 14 &&
							this.pieces[stationedPieceIndex].rank == 14
						) {
							this.setWinner(playerIndex);
						}

						break;
					default:
					//
				}
			}
		}

		// update move..
		this.move = newMove;
	}

	compareRanks(rank1, rank2) {
		// console.log("r", rank1, rank2);
		if (rank1 === 13) {
			return rank2 === 12 ? 2 : 1; // 13 loses to 12, wins against others
		}

		if (rank2 === 13) {
			return rank1 === 12 ? 1 : 2; // 12 wins to 13, wins against others
		}

		// Special case for rank 14 vs 14
		if (rank1 === 14 && rank2 === 14) {
			return 1; // Rank 14 (var1) wins
		}

		if (rank1 === rank2) {
			return 0; // Tie
		}

		return rank1 < rank2 ? 1 : 2; // Smaller rank generally wins
	}

	stopTimers() {
		clearInterval(this.timer);
		this.timer = null;
	}
}

export default Room;
