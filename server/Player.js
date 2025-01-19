class Player {
	constructor(id, socketId, username) {
		this.id = id; // Unique player ID
		this.username = username; // Default username
		this.socketId = socketId;
		this.credits = 1000;
		this.status = "idle";
		this.roomId = "";
	}

	// Method to set the player's username
	// setUsername(username) {
	// 	this.username = username;
	// }
	setRoom(roomId) {
		this.roomId = roomId; //
		this.status = "waiting";
	}
	joinRoom(roomId) {
		this.roomId = roomId;
	}
	leaveRoom() {
		this.roomId = "";
	}
}

export default Player;
