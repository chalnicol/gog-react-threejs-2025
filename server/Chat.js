class Chat {
	constructor(id, maxParticipants, participants) {
		this.id = id;
		this.maxParticipants = maxParticipants;
		this.participants = participants; // Array of player IDs that are in the chat room
		this.messages = [];
	}

	addMessage(message) {
		this.messages.push(message);
	}
	addParticipant(participant) {
		if (this.participants.length < this.maxParticipants) {
			this.participants.push(participant);
		}
	}
	removeParticipant(participantId) {
		this.participants = this.participants.filter(
			(participant) => participant.id !== participantId
		);
	}
	isFull() {
		return this.participants.length >= this.maxParticipants;
	}
	getMessages() {
		return this.messages;
	}
}

export default Chat;
