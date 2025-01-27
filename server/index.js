import express from "express";
import { Server } from "socket.io";
import http from "http";
import path, { join } from "path";
import { fileURLToPath } from "url";
import Player from "./Player.js";
import Room from "./Room.js";

// Create Express and HTTP server
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173", // Your Vite server URL
		methods: ["GET", "POST"],
		allowedHeaders: ["Content-Type"],
		credentials: true, // Allow credentials (cookies, authentication)
	},
});

// For serving static files (e.g., React build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

//game codes..
const players = {};
const rooms = {};
const timers = {};

const generateUniqueId = () => {
	const randomPart = Math.floor(Math.random() * 1000000000); // 9 digits random number
	const timestampPart = Date.now() % 1000000000; // Get last 9 digits of timestamp
	return (randomPart + timestampPart).toString().slice(0, 10); // Ensure it's 10 digits long
};

const getSanitizedRooms = () => {
	return Object.values(rooms).map((room) => {
		const { password, ...rest } = room; // Exclude password
		return rest;
	});
};

const getPlayer = (id) => {
	return Object.values(players).find((player) => player.id === id) || null;
};

const joinRoom = (roomId, socketId) => {
	//get room
	const room = rooms[roomId] || null;
	//get player..
	const player = players[socketId] || null;

	if (!player || !room) return;

	//set player id..
	player.joinRoom(room.id);

	//set host status..
	const host = players[room.players[0].socketId];
	host.setStatus("playing");

	//add player to the room players list..
	room.addPlayer(player);

	//initialize game..
	// room.initGame();
	initGame(room.id);

	console.log(`${player.username} has joined a room. Game ID : ${roomId}`);
};

const initGame = (roomId) => {
	const room = rooms[roomId];
	room.initGame();

	clearTimeout(timers[roomId]);
	timers[roomId] = setTimeout(() => startPrep(roomId), 2000);

	//emit..

	let toSendData = [];

	room.players.forEach((player, i) => {
		const mirrored = i == 0 ? true : false;
		toSendData.push({
			event: "initGame",
			players: room.getPlayers(i),
			fieldColor: player.fieldColor,
			playerPieces: room.getPieces(mirrored, true, i),
		});
	});

	emitData(roomId, toSendData, true);
};

const startPrep = (roomId) => {
	const room = rooms[roomId];
	room.startPrep();

	//emit..
	emitData(roomId, {
		event: "startPrep",
		clock: room.prepTime,
		// phase: "prep",
	});

	//..
	if (room.type === "blitz") {
		startClock(roomId);
	}
};

const startClock = (roomId) => {
	const room = rooms[roomId];

	const maxTime = room.phase == "prep" ? room.prepTime : room.turnTime;

	let tick = 0;

	clearInterval(timers[roomId]);
	timers[roomId] = setInterval(() => {
		tick++;
		emitData(roomId, { event: "clockTick", clock: maxTime - tick });

		if (tick >= maxTime) {
			//perfom action when clock ends..
			if (room.phase === "prep") {
				endPrep(roomId);
			} else {
				endGame(roomId);
			}
		}
	}, 1000);
};

const endPrep = (roomId) => {
	//..
	const room = rooms[roomId];
	room.endPrep();

	if (room.type === "blitz") {
		clearInterval(timers[roomId]);
	}

	// console.log(room.pieces);

	const toSendData = [
		{
			event: "endPrep",
			players: room.players,
			oppoPieces: room.getPieces(true, false, 1),
		},
		{
			event: "endPrep",
			players: [...room.players].reverse(),
			oppoPieces: room.getPieces(false, false, 0),
		},
	];

	// console.log(room.pieces);
	emitData(roomId, toSendData, true);

	timers[roomId] = setTimeout(() => startGame(roomId), 2000);

	console.log(`Game: ${roomId} preparations has ended.`);
};

const startGame = (roomId) => {
	const room = rooms[roomId] || null;

	if (!room) return;

	room.startGame();
	if (room.type === "blitz") {
		startClock(roomId);
	}
	if (room.vsAi && room.players[1].turn === room.turn) {
		setTimeout(() => aiMove(roomId), 500);
	}

	const toSendData = [
		{
			event: "startGame",
			clock: room.turnTime,
			isTurn: room.isPlayerTurn(),
		},
		{
			event: "startGame",
			clock: room.turnTime,
			isTurn: room.isPlayerTurn(1),
		},
	];
	emitData(roomId, toSendData, true);

	console.log(`Game: ${roomId} has started.`);
};

const endGame = (roomId) => {
	const room = rooms[roomId];
	room.endGame();
	if (room.type === "blitz") {
		clearInterval(timers[roomId]);
	}
};

const switchTurn = (roomId) => {
	const room = rooms[roomId];
	room.switchTurn();

	if (room.type === "blitz") {
		startClock(roomId);
	}
	if (room.vsAi && room.players[1].turn === room.turn) {
		setTimeout(() => aiMove(roomId), 1500);
	}
	// showGrid(room.tiles);

	const toSendData = [
		{
			event: "switchTurn",
			isTurn: room.isPlayerTurn(),
			move: room.getMove(0),
		},
		{
			event: "switchTurn",
			isTurn: room.isPlayerTurn(1),
			move: room.getMove(1),
		},
	];

	emitData(roomId, toSendData, true);
	// console.log(`Game: ${roomId} switch turn.`);
};

const emitData = (roomId, data, isSeparate = false) => {
	const room = rooms[roomId];
	room.players.forEach((player, index) => {
		if (!player.isAi) {
			io.to(player.socketId).emit(
				"sendGameUpdate",
				isSeparate ? data[index] : data
			);
		}
	});
};

const createRoom = (socketId, type, isPrivate, allowSpectators, vsAi) => {
	const host = players[socketId];

	if (!host) return;

	if (!rooms[socketId]) {
		const newRoom = new Room(
			socketId,
			host,
			type,
			isPrivate,
			allowSpectators,
			vsAi
		);
		rooms[socketId] = newRoom;

		//add events to this room..
		host.setRoom(socketId);

		if (vsAi) {
			//create ai player..
			const aiId = generateUniqueId();
			const aiPlayer = new Player(
				aiId,
				aiId,
				`Player${aiId.substring(0, 6)} (AI)`,
				true
			);
			newRoom.addPlayer(aiPlayer);

			//set host status to playing..
			host.setStatus("playing");

			console.log("Room created..");
		}
	}
};

const leaveRoom = (socketId) => {
	const player = players[socketId];

	const room = rooms[player.roomId];

	if (player && room) {
		const roomId = room.id;
		const username = player.username;

		player.leaveRoom();

		room.removePlayer(socketId);

		clearInterval(timers[room.id]);
		clearTimeout(timers[room.id]);

		if (!room.vsAi && room.players.length > 0) {
			emitData(room.id, { event: "playerLeave", username: username });
		} else {
			//delete room..
			delete rooms[roomId];
		}
		console.log(`${username} has left a room.`);
	}
};

const getAvailableRoom = (type, socketId) => {
	return (
		Object.values(rooms).find(
			(room) =>
				room.status === "open" &&
				!room.privateMatch &&
				!room.vsAi &&
				room.type === type &&
				room.players.some((player) => player.socketId !== socketId)
		) || null
	);
};

//players
const playerReady = (socketId) => {
	const player = players[socketId];
	const room = rooms[player.roomId];

	if (player && room) {
		room.setPlayerReady(socketId);

		if (room.bothPlayersReady()) {
			//..end preparations..
			endPrep(room.id);
		} else {
			//emits players ready while waiting for other player to get ready..
			const toSendData = [
				{ event: "playerReady", players: room.players },
				{ event: "playerReady", players: [...room.players].reverse() },
			];
			emitData(room.id, toSendData, true);
		}
	}
};

const playerMove = (socketId, data) => {
	const player = players[socketId];
	const room = rooms[player.roomId];

	if (!player || !room) return;

	//check move if is valid..
	const isValidMove = room.isValidMove(socketId, data);
	// console.log("valid", isValidMove);

	if (isValidMove) {
		room.setPlayerMove(socketId, data);
		proceed(room.id);
	}
};

const showGrid = (tiles) => {
	tiles.forEach((innerTiles) => {
		let str = "";
		innerTiles.forEach((tile) => {
			str += `[${tile.pieceIndex == null ? "-" : tile.playerIndex}] `;
		});
		console.log(str);
	});
};

const aiMove = (roomId) => {
	const room = rooms[roomId];

	if (!room) return;

	const aiMove = room.generateAIRandomMove();
	// console.log("AI move", aiMove);
	if (aiMove !== null) {
		room.setAiMove(aiMove);
		proceed(room.id);
	}
};

const proceed = (roomId) => {
	const room = rooms[roomId];
	if (!room) return;

	if (room.phase !== "prep") {
		if (!room.isFinished) {
			switchTurn(roomId);
		} else {
			endGame(roomId);
		}
	}
	//..
};

const broadcastGameData = () => {
	io.emit("updateGameData", {
		players: Object.values(players),
		rooms: getSanitizedRooms(),
	});
};

io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);
	//user joined..
	socket.on("join", (username) => {
		console.log("A user connected");

		const player = new Player(generateUniqueId(), socket.id, username);
		players[socket.id] = player;
		//send to self only...
		socket.emit("playerData", player);

		//sent to all including self..
		broadcastGameData();
	});

	//create game room
	socket.on("createRoom", (roomData) => {
		const { type, isPrivate, playerInvited, allowSpectators } = roomData;

		const host = players[socket.id];

		const invited = getPlayer(playerInvited);

		//check if creator already has a room created..
		if (host.roomId !== "") {
			socket.emit("sendStatus", {
				error: "You have an ongoing game request.",
			});
			return;
		}

		//consolidated form errors and send to client..
		const errors = {};

		if (isPrivate && playerInvited === "") {
			errors.playerInvited = "Player ID is required for private match.";
		}
		if (playerInvited !== "" && playerInvited === host.id) {
			errors.playerInvited = "Invalid player id.";
		}
		if (playerInvited !== "" && invited === null) {
			errors.playerInvited = "Player not found.";
		}
		if (
			playerInvited !== "" &&
			invited !== null &&
			invited.status === "playing"
		) {
			errors.playerInvited = "Player is busy.";
		}

		if (Object.keys(errors).length > 0) {
			// console.log("Error creating the room:", errors);
			socket.emit("createRoomError", errors);
			return;
		}

		//create the room and add to list..
		createRoom(socket.id, type, isPrivate, allowSpectators, false);

		//send invite if playerInvited is 	present
		if (playerInvited !== "" && invited !== null) {
			const senderData = {
				username: host.username,
				socketId: socket.id,
			};

			const targetData = {
				username: invited.username,
				socketId: invited.socketId,
			};

			const targetMessageData = {
				sender: senderData,
				game: {
					id: socket.id,
					type: type,
				},
				type: "invite",
				timeStamp: Date.now(),
			};

			//send to target..
			io.to(invited.socketId).emit("receivedMessage", {
				sender: senderData,
				message: targetMessageData,
			});

			//send to creator..

			const messageData = {
				sender: senderData,
				message: `(Invite Sent. Game ID: ${socket.id})`,
				type: "regular",
				timeStamp: Date.now(),
			};

			socket.emit("receivedMessage", {
				sender: targetData,
				message: messageData,
			});

			console.log("invite has been sent to ", invited.username);
		}
		//send status success..
		socket.emit("createRoomSuccess", {
			success: "Game room has been created successfully!",
		});

		//sent to all including self..
		broadcastGameData();

		console.log("A room created by " + host.username);
	});

	//delete room
	socket.on("deleteRoom", (roomId) => {
		//get player and room..
		const room = rooms[roomId];

		const player = players[socket.id];

		//check if player is in the room..
		if (
			room &&
			player &&
			room.players.some((plyr) => plyr.socketId === socket.id)
		) {
			player.leaveRoom();

			room.removePlayer(socket.id);

			if (room.players.length === 0) {
				delete rooms[roomId];
			}
			console.log("Room has been deleted : ", roomId);
		}

		//update game data..
		broadcastGameData();
	});

	//join room..
	socket.on("joinRoom", (roomId) => {
		//join player in the room..
		const player = players[socket.id] || null;

		if (!player) return;

		if (player.status !== "idle") {
			socket.emit("sendStatus", {
				error: "You have an ongoing game request.",
			});
			return;
		}

		joinRoom(roomId, socket.id);

		//update game info..
		broadcastGameData();
	});

	//spectate room..
	socket.on("spectateRoom", (roomId) => {
		console.log("A user spectated room : ", roomId);
	});

	//send message
	socket.on("privateMessage", (data) => {
		const { message, targetSocket } = data;

		const sender = players[socket.id];

		const targetPlayer = players[targetSocket];

		// console.log(sender, targetPlayer);
		if (sender && targetPlayer) {
			const senderData = {
				username: sender.username,
				socketId: socket.id,
			};

			const targetData = {
				username: targetPlayer.username,
				socketId: targetSocket,
			};

			const messageData = {
				sender: senderData,
				message: message,
				type: "regular",
				timestamp: Date.now(),
				// isRead: false,
			};

			//update chats..
			io.to(targetSocket).emit("receivedMessage", {
				sender: senderData,
				message: messageData,
			});
			socket.emit("receivedMessage", {
				sender: targetData,
				message: messageData,
			});

			// socket.emit("updateMessage", {
			// 	target: targetData,
			// 	message: messageData,
			// });

			console.log("A message was sent successfully.");
		}
	});

	//invite response
	socket.on("inviteResponse", (data) => {
		const { response, id } = data;
		const player = players[socket.id];

		const room = rooms[id];

		if (room && player && player.id === room.playerInvitedId) {
			//remove the invited player from the room..
			room.removeInvited();

			if (response === "accept") {
				//join player in the room..
				joinRoom(room.id, socket.id);
				console.log(player.username, "has accepted the invite");
			} else {
				const senderData = {
					username: player.username,
					socketId: socket.id,
				};

				const targetData = {
					username: room.players[0].username,
					socketId: room.players[0].socketId,
				};

				io.to(room.players[0].socketId).emit("receivedMessage", {
					sender: senderData,
					message: {
						sender: senderData,
						message: `(Game invitation has been declined. Game ID : ${room.id})`,
						type: "regular",
						timeStamp: Date.now(),
					},
				});

				socket.emit("receivedMessage", {
					sender: targetData,
					message: {
						sender: senderData,
						message: `(You declined the game invite. Game ID : ${room.id})`,
						type: "regular",
						timeStamp: Date.now(),
					},
				});

				console.log(player.username, "has declined the invite");
			}
		}

		//update game info..
		broadcastGameData();
	});

	socket.on("invitePlayer", (data) => {
		const { id, playerId } = data;

		const host = players[socket.id];

		const room = rooms[id];

		const invited = getPlayer(playerId);

		if (!invited) {
			socket.emit("sendStatus", {
				error: "Player not found.",
			});
			return;
		}
		if (invited.socketId === socket.id) {
			socket.emit("sendStatus", {
				error: "Invalid player ID.",
			});
			return;
		}
		if (invited.status !== "idle") {
			socket.emit("sendStatus", {
				error: "Player is already in a game.",
			});
			return;
		}

		if (host && room && invited) {
			room.setInvited(playerId);

			const senderData = {
				username: host.username,
				socketId: socket.id,
			};

			const targetData = {
				username: invited.username,
				socketId: invited.socketId,
			};

			const targetMessageData = {
				sender: senderData,
				game: {
					id: socket.id,
					type: room.type,
				},
				type: "invite",
				timeStamp: Date.now(),
			};

			//send to target..
			io.to(invited.socketId).emit("receivedMessage", {
				sender: senderData,
				message: targetMessageData,
			});

			//send to creator..

			const messageData = {
				sender: senderData,
				message: `(Invite Sent. Game ID: ${room.id})`,
				type: "regular",
				timeStamp: Date.now(),
			};

			socket.emit("receivedMessage", {
				sender: targetData,
				message: messageData,
			});

			console.log("invite has been sent to ", invited.username);
		}
	});

	//quick play
	socket.on("quickPlay", (data) => {
		console.log("quick play..");
		const { opponent, type } = data;

		const player = players[socket.id];

		if (!player) return;

		if (player.status !== "idle") {
			socket.emit("quickPlayFailed", {
				error: "You have an ongoing game request.",
			});
			return;
		}

		if (opponent === "online") {
			const maxRetries = 10;
			const interval = 500;
			let attempts = 0;

			timers[socket.id] = setInterval(() => {
				const room = getAvailableRoom(type, socket.id);
				if (room) {
					joinRoom(room.id, socket.id);
					broadcastGameData();
					clearInterval(timers[socket.id]);
					delete timers[socket.id];
				} else if (++attempts >= maxRetries) {
					socket.emit("quickPlayFailed", { error: "Failed to join game" });
					clearInterval(timers[socket.id]);
					delete timers[socket.id];
				} else {
					console.log(
						`${player.username} failed to find room. Retrying...`
					);
				}
			}, interval);
		} else {
			//type : vsAI
			createRoom(socket.id, type, true, false, true);

			initGame(socket.id);

			broadcastGameData();
		}
	});

	socket.on("gameAction", (data) => {
		if (data.action === "leaveGame") {
			leaveRoom(socket.id);
			broadcastGameData();
		}
		switch (data.action) {
			case "leaveGame":
				leaveRoom(socket.id);
				broadcastGameData();
				break;
			case "playerReady":
				playerReady(socket.id);
				break;
			case "playerPieceMove":
				const { action, ...rest } = data;
				playerMove(socket.id, { ...rest });
				break;
			default:
		}
	});
	//spectate game room

	//user left..
	socket.on("disconnect", () => {
		//get player
		const player = players[socket.id];

		//leave room..
		if (player && player.roomId !== "") {
			leaveRoom(socket.id);
		}
		if (timers[socket.id]) {
			clearInterval(timers[socket.id]);
			delete timers[socket.id];
		}

		//remove player..
		delete players[socket.id];

		//broadcast update game data..
		broadcastGameData();

		console.log("A user disconnected");
	});
});

server.listen(3000, () => {
	console.log("Server listening on http://localhost:3000");
});
