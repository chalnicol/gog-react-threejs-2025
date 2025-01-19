class Room {
	constructor(
		id,
		creatorData,
		playerInvitedId,
		type,
		password,
		allowSpectators
	) {
		this.id = id; // Unique ID
		this.withPassword = password !== "";
		this.password = password; // Whether
		this.allowSpectators = allowSpectators; // Whether spectators are allowed or not
		this.type = type;
		this.players = [];
		this.players.push(creatorData);

		this.playerInvitedId = playerInvitedId; // Unique
		this.status = playerInvitedId !== "" ? "pending" : "open";
		this.timer = null;
	}

	inviteSent() {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => this.inviteResponse(0), 5000);
	}

	inviteResponse(response) {
		if (response === 0) {
			this.status = "open";
		}
	}

	setStatus(status) {
		this.status = status;
	}
	addPlayer(playerId) {
		if (this.players.length < 2) {
			this.players.push(playerId);
		}
	}

	removePlayer(playerId) {
		this.players = this.players.filter((player) => player.id !== playerId);
	}
	checkPassword(password) {
		return this.withPassword && this.password === password;
	}
	getPlayers() {
		return this.players;
	}
}

export default Room;
