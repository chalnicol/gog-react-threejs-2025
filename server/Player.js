class Player {
	constructor(id, socketId, username, isAi = false) {
		this.id = id; // Unique player ID
		this.username = username; // Default username
		this.socketId = socketId;
		this.credits = 1000;
		this.status = "idle";
		this.roomId = "";
		this.isAi = isAi;
		this.turn = 0;
		this.wins = 0;
		this.loss = 0;
		this.fieldColor = 0;
		this.isReady = false;
		this.isReached = false;
		this.playAgain = false;
	}

	setRoom(roomId) {
		this.roomId = roomId; //
		this.status = "waiting";
	}

	joinRoom(roomId) {
		this.roomId = roomId;
		this.status = "playing";
	}

	setStatus(status) {
		this.status = status;
	}

	leaveRoom() {
		this.roomId = "";
		this.status = "idle";
		this.reset();
	}

	gameReset() {
		this.isReady = false;
		this.isReached = false;
		this.playAgain = false;
		// console.log("player reset");
	}

	reset() {
		this.wins = 0;
		this.loss = 0;
		this.turn = 0;
		this.fieldColor = 0;
		this.gameReset();
	}
}

export default Player;
