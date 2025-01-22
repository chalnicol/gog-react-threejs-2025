class Room {
	constructor(
		id,
		hostData,
		playerInvitedId,
		type,
		privateMatch,
		allowSpectators,
		eventCallback,
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
		this.eventCallback = eventCallback;
		this.timer = null;
		this.turn = 0;
		this.phase = "";
		this.clock = 5;
		//add host to players..
		this.addPlayer(hostData);
	}

	initGame() {
		// Initialize game logic here
		this.setPlayersPiecesColor();
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
			this.players[0].pieceColor = hostPieceColor === 0 ? "white" : "black";
			this.players[1].pieceColor = hostPieceColor === 1 ? "white" : "black";
		} else {
			this.players[0].pieceColor =
				this.players[0].pieceColor === "white" ? "black" : "white";
			this.players[1].pieceColor =
				this.players[1].pieceColor === "white" ? "black" : "white";
		}
	}

	toSendGameIniData() {}

	addPlayer(playerData) {
		if (this.players.length < 2) {
			playerData["wins"] = 0;
			playerData["loss"] = 0;
			playerData["pieceColor"] = 0;

			this.players.push(playerData);

			if (this.players.length >= 2) {
				this.status = "closed";
			}
		}
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
