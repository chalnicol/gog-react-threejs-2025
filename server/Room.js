class Room {
	constructor(
		id,
		hostData,
		playerInvitedId,
		type,
		privateMatch,
		allowSpectators
	) {
		this.id = id; // Unique ID
		this.allowSpectators = allowSpectators; // Whether spectators are allowed or not
		this.type = type;
		this.privateMatch = privateMatch;
		this.playerInvitedId = playerInvitedId; // Unique
		this.status = "open";
		this.timer = null;
		this.players = [hostData];
	}

	addPlayer(playerData) {
		if (this.players.length < 2) {
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
}

export default Room;
