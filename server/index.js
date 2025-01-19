import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import Player from "./Player.js";
import Room from "./Room.js";
import Chat from "./Chat.js";

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
const chats = {};

const generateUniqueId = () => {
	const randomPart = Math.floor(Math.random() * 1000000000); // 9 digits random number
	const timestampPart = Date.now() % 1000000000; // Get last 9 digits of timestamp
	return (randomPart + timestampPart).toString().slice(0, 10); // Ensure it's 10 digits long
};

const playerExistsById = (playerId) => {
	return Object.values(players).some((player) => player.id === playerId);
};

const getChat = (userId1, userId2) => {
	//
	return Object.values(chats).find(
		(chat) =>
			chat.participants.includes(userId1) ||
			chat.participants.includes(userId2)
	);
};

const getSanitizedRooms = () => {
	return Object.values(rooms).map((room) => {
		const { password, ...rest } = room; // Exclude password
		return rest;
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
		const { type, password, playerInvited, allowSpectators } = roomData;

		const gameCreator = players[socket.id];

		//check if creator already has a room created..
		if (gameCreator.roomId !== "") {
			socket.emit("sendStatus", {
				error: "You already have a room created!",
			});
			return;
		}

		//consolidated form errors and send to client..
		const errors = {};
		if (playerInvited !== "" && !playerExistsById(playerInvited)) {
			errors.playerInvited = "Player not found.";
		}

		if (playerInvited !== "" && playerInvited === gameCreator.id) {
			errors.playerInvited = "Invalid player id.";
		}

		if (password !== "" && password.length < 3) {
			errors.password = "Password must be at least 3 characters long.";
		}

		if (Object.keys(errors).length > 0) {
			// console.log("Error creating the room:", errors);
			socket.emit("createRoomError", errors);
			return;
		}

		const gameCreatorData = {
			username: gameCreator.username,
			id: gameCreator.id,
		};

		const newRoom = new Room(
			socket.id,
			gameCreatorData,
			playerInvited,
			type,
			password,
			allowSpectators
		);
		rooms[socket.id] = newRoom;
		gameCreator.roomId = socket.id;

		const sanitizedRooms = Object.values(rooms).map((room) => {
			const { password, ...rest } = room; // Exclude password
			return rest;
		});

		//send status success..
		socket.emit("sendStatus", {
			success: "Room has been created successfully!",
		});

		//sent to all including self..
		io.emit("updateGameData", {
			players: Object.values(players),
			rooms: getSanitizedRooms(),
		});

		console.log("A room created by " + gameCreator.username);
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
			room.players.some((plyr) => plyr.id === player.id)
		) {
			player.roomId = "";

			room.removePlayer(player.id);

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
		console.log("A user joined room : ", roomId);
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
				timestamp: new Date().toISOString(),
				// isRead: false,
			};

			//update chats..
			io.to(targetSocket).emit("receivedMessage", {
				sender: senderData,
				message: messageData,
			});

			socket.emit("updateMessage", {
				target: targetData,
				message: messageData,
			});

			// const existingChat = getChat(sender.id, targetPlayer.id) || null;
			// if (!existingChat) {
			// 	const newChat = new Chat(socket.id, 2, [
			// 		sender.id,
			// 		targetPlayer.id,
			// 	]);
			// 	newChat.addMessage(messageData);
			// 	chats[socket.id] = newChat;

			// 	io.to(targetSocket).emit("receivedMessage", {
			// 		sender: senderData,
			// 		messages: newChat.getMessages(),
			// 	});
			// 	socket.emit("updateMessage", {
			// 		target: targerData,
			// 		messages: newChat.getMessages(),
			// 	});
			// } else {
			// 	existingChat.addMessage(messageData);
			// 	io.to(targetSocket).emit("receivedMessage", {
			// 		sender: senderData,
			// 		messages: existingChat.getMessages(),
			// 	});
			// 	socket.emit("updateMessage", {
			// 		target: targerData,
			// 		messages: existingChat.getMessages(),
			// 	});
			// }

			console.log("A message was sent successfully.");
		}
	});

	//join game room
	socket.on("joinGameRoom", (gameRoomId) => {
		console.log("A user joined game room : ", gameRoomId);
	});

	//spectate game room

	//user left..
	socket.on("disconnect", () => {
		//get player
		const player = players[socket.id];

		if (player) {
			//get current player room and remove player, delete if no players..
			const room = rooms[player.roomId];
			if (room) {
				room.removePlayer(player.id);
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
