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

		if (playerInvitedId !== "") {
			this.sendInvite(playerInvitedId);
		}
	}

	sendInvite(playerId) {
		console.log("Invite sent to ", playerId);
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
