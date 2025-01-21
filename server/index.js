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
let timer = null;

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
	const room = rooms[roomId];
	//get player..
	const player = players[socketId];

	if (room && player) {
		player.setRoom(room.id);
		player.status = "playing";

		room.addPlayer({
			username: player.username,
			socketId: socketId,
			wins: 0,
			loss: 0,
		});

		const host = players[room.players[0].socketId];
		host.status = "playing";

		room.players.forEach((player) => {
			io.to(player.socketId).emit("initGame", {
				room: room,
			});
		});

		console.log(`${player.username} has joined a room. Game ID : ${roomId}`);
	}
};

const getAvailableRoom = (type, socketId) => {
	return (
		Object.values(rooms).find(
			(room) =>
				room.status === "open" &&
				!room.privateMatch &&
				room.type === type &&
				room.players.some((player) => player.socketId !== socketId)
		) || null
	);
};

const broadcastGameData = () => {
	io.emit("updateGameData", {
		players: Object.values(players),
		rooms: getSanitizedRooms(),
	});
};

io.on("connection", (socket) => {
	//user joined..
	socket.on("join", (username) => {
		console.log("A user connected");

		const player = new Player(generateUniqueId(), socket.id, username);
		players[socket.id] = player;
		//send to self only...
		socket.emit("playerData", player);

		//sent to all including self..
		io.emit("updateGameData", {
			players: Object.values(players),
			rooms: getSanitizedRooms(),
		});
	});

	//create game room
	socket.on("createRoom", (roomData) => {
		const { type, privateGame, playerInvited, allowSpectators } = roomData;

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

		if (privateGame && playerInvited === "") {
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

		//all good to create a new room..

		const hostData = {
			username: host.username,
			socketId: host.socketId,
			wins: 0,
			loss: 0,
		};

		const newRoom = new Room(
			socket.id,
			hostData,
			playerInvited,
			type,
			privateGame,
			allowSpectators
		);

		rooms[socket.id] = newRoom;

		host.setRoom(socket.id);
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
				message: `(Invite Sent. Game ID: ${newRoom.id})`,
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
			success: "Room has been created successfully!",
		});

		//sent to all including self..
		io.emit("updateGameData", {
			players: Object.values(players),
			rooms: getSanitizedRooms(),
		});

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
		io.emit("updateGameData", {
			players: Object.values(players),
			rooms: getSanitizedRooms(),
		});
	});

	//join room..
	socket.on("joinRoom", (roomId) => {
		//join player in the room..
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
		io.emit("updateGameData", {
			players: Object.values(players),
			rooms: getSanitizedRooms(),
		});
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
		console.log("A user started a quick play");
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

			const timer = setInterval(() => {
				const room = getAvailableRoom(type, socket.id);
				if (room) {
					joinRoom(room.id, socket.id);
					broadcastGameData();
					clearInterval(timer);
				} else if (++attempts >= maxRetries) {
					socket.emit("quickPlayFailed", { info: "Failed to join game" });
					clearInterval(timer);
				} else {
					console.log(
						`${player.username} failed to find room. Attempt ${attempts}: Retrying...`
					);
				}
			}, interval);
		}
	});

	//spectate game room
	//TODO..

	//user left..
	socket.on("disconnect", () => {
		//get player
		const player = players[socket.id];

		if (player) {
			//get current player room and remove player, delete if no players..
			const room = rooms[player.roomId];
			if (room) {
				room.removePlayer(player.socketId);
				if (room.players.length === 0) {
					delete rooms[player.roomId];
				}
			}
		}

		//remove player..
		delete players[socket.id];

		io.emit("updateGameData", {
			players: Object.values(players),
			rooms: getSanitizedRooms(),
		});

		console.log("A user disconnected");
	});
});

server.listen(3000, () => {
	console.log("Server listening on http://localhost:3000");
});
