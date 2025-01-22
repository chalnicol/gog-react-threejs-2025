class Player {
	constructor(id, socketId, username) {
		this.id = id; // Unique player ID
		this.username = username; // Default username
		this.socketId = socketId;
		this.credits = 1000;
		this.status = "idle";
		this.roomId = "";
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
	}
}

export default Player;
