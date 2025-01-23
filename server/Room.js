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
		this.prepTime = type === "classic" ? 0 : 30; //seconds
		this.turnTime = type === "classic" ? 0 : 45;
		this.grid = null;
		this.timer = null;

		//add host to players..
		this.addPlayer(hostData);
	}

	initGame() {
		// Initialize game logic here
		this.setPlayersPiecesColor();
		this.initGrid();
	}

	initGrid() {
		// Initialize game 8x9 grid here..
		this.grid = Array.from({ length: 8 }, () => Array(9).fill(null));
	}

	playerMove(playerIndex, pieceRankValue, pieceColor) {
		this.grid[row][col] = {
			index: playerIndex,
			value: pieceRankValue,
			color: pieceColor,
		};
	}

	isValidMove(socketId) {
		const player = this.players.find((plyr) => plyr.socketId === socketId);
		if (!player) {
			return false;
		}
		if (player.pieceColor !== this.turn) {
			return false;
		}
		return true;
	}

	startPrep() {
		this.turn = 0;
		this.phase = "prep";
	}

	startClock(maxSeconds) {
		// let tick = 0;
		// this.timer = setInterval(() => {
		// 	tick++;
		// 	//..emit
		// 	this.emitData({ event: "clockTick", clock: maxSeconds - tick });
		// 	//stop timer if..
		// 	if (tick >= maxSeconds) {
		// 		// this.endClock();
		// 		clearInterval(this.timer);
		// 		this.switchTurn();
		// 	}
		// }, 1000);
		// this.timer = setTimeout(() => this.switchTurn(), maxSeconds * 1000);
		// this.timer = setInterval(() => {
		// 	this.eventCallback({ event: "clockTick", clock: 30 });
		// }, 1000);
	}

	endClock() {
		if (this.phase === "prep") {
			this.startGame();
		} else {
			this.endGame();
		}
	}

	startGame() {
		//..
	}

	endGame() {
		//..
	}

	addRound() {
		this.roundsPlayed++;
	}

	switchTurn() {
		this.turn = this.turn === 0 ? 1 : 0;
	}

	setPlayersPiecesColor() {
		if (this.roundsPlayed == 0) {
			const hostPieceColor = Math.floor(Math.random() * 2);
			this.players[0].pieceColor = hostPieceColor;
			this.players[1].pieceColor = hostPieceColor === 0 ? 1 : 0;
		} else {
			this.players[0].pieceColor = this.players[0].pieceColor === 0 ? 1 : 0;
			this.players[1].pieceColor = this.players[1].pieceColor === 0 ? 1 : 0;
		}
	}

	toSendGameIniData() {}

	addPlayer(playerData) {
		if (this.players.length < 2) {
			const toAddData = {
				wins: 0,
				loss: 0,
				pieceColor: 0,
				isReady: false,
			};

			this.players.push({ ...playerData, ...toAddData });

			if (this.players.length >= 2) {
				this.status = "closed";
			}
		}
	}

	setPlayerReady(socketId) {
		const playerIndex = this.players.findIndex(
			(plyr) => plyr.socketId === socketId
		);

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

	removePlayer(socketId) {
		this.players = this.players.filter(
			(player) => player.socketId !== socketId
		);
	}

	getPlayers() {
		return this.players;
	}

	stopTimers() {
		clearInterval(this.timer);
		this.timer = null;
	}
}

export default Room;
