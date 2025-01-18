import React, { useEffect, useRef, useState } from "react";
import CreateGame from "./CreateGame";
import SelectGame from "./SelectGame";
import About from "./About";
import NavBar from "./NavBar";
import UserDetails from "./UserDetails";
import FlashMessage from "./FlashMessage";
import RoomsTable from "./RoomsTable";
import PlayersTable from "./PlayersTable";
import ChatBox from "./ChatBox";

import { io } from "socket.io-client";

const MainPage = ({ playerName }) => {
	const [content, setContent] = useState("welcome");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [socket, setSocket] = useState(null);
	const [createRoomErrors, setCreateRoomErrors] = useState(null);
	const [createRoomSuccess, setCreateRoomSuccess] = useState(false);
	const [status, setStatus] = useState(null);
	const [playersData, setPlayersData] = useState([]);
	const [roomsData, setRoomsData] = useState([]);
	const [userData, setUserData] = useState(null);
	// const [chats, setChats] = useState([
	// 	{
	// 		playerId: "player1_id", // Unique ID for the player
	// 		playerName: "Player 1", // Player's display name
	// 		messages: [
	// 			{
	// 				senderId: "Player 1",
	// 				message: "Hi!",
	// 				timestamp: 1673820000000,
	// 			},
	// 			{ senderId: "You", message: "Hi!", timestamp: 1673820050000 },
	// 			{
	// 				senderId: "Player 1",
	// 				message: "Can we play?",
	// 				timestamp: 1673820100000,
	// 			},
	// 			{
	// 				senderId: "You",
	// 				message:
	// 					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente at eos quidem optio necessitatibus modi dolorum rem repellat. Quam quasi iure commodi voluptates a sapiente. Sed nihil magnam dolore libero!",
	// 				timestamp: 1673820050000,
	// 			},
	// 			{
	// 				senderId: "Player 1",
	// 				message:
	// 					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente at eos quidem optio necessitatibus modi dolorum rem repellat. Quam quasi iure commodi voluptates a sapiente. Sed nihil magnam dolore libero!",
	// 				timestamp: 1673820050000,
	// 			},
	// 			{
	// 				senderId: "You",
	// 				message:
	// 					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente at eos quidem optio necessitatibus modi dolorum rem repellat. Quam quasi iure commodi voluptates a sapiente. Sed nihil magnam dolore libero!",
	// 				timestamp: 1673820050000,
	// 			},
	// 			{
	// 				senderId: "Player 1",
	// 				message:
	// 					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente at eos quidem optio necessitatibus modi dolorum rem repellat. Quam quasi iure commodi voluptates a sapiente. Sed nihil magnam dolore libero!",
	// 				timestamp: 1673820050000,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		playerId: "player3_id",
	// 		playerName: "Player 3",
	// 		messages: [
	// 			{
	// 				senderId: "Player",
	// 				message: "Hi!",
	// 				timestamp: 1673820500000,
	// 			},
	// 			{ senderId: "You", message: "Hi!", timestamp: 1673820600000 },
	// 			{
	// 				senderId: "Player",
	// 				message: "How are you?",
	// 				timestamp: 1673820700000,
	// 			},
	// 		],
	// 	},
	// ]);
	const [chats, setChats] = useState([]);
	const [messages, setMessages] = useState([]);
	const [chatIndex, setChatIndex] = useState(0);

	const sidebarRef = useRef(null);
	const chatsRef = useRef(null);
	const chatIndexRef = useRef(null);

	useEffect(() => {
		const socketInstance = io("http://localhost:3000");
		setSocket(socketInstance);

		socketInstance.emit("join", playerName);

		socketInstance.on("playerData", (player) => {
			console.log("player", player);
			setUserData(player);
		});

		socketInstance.on("sendStatus", (data) => {
			// console.log("status", data);
			setStatus(data);
			setTimeout(() => setStatus(null), 2000);
		});

		socketInstance.on("createRoomSuccess", (data) => {
			setCreateRoomSuccess(true);
			setTimeout(() => setCreateRoomSuccess(false), 10); //
			setCreateRoomErrors(null);
			setStatus(data);
			setTimeout(() => setStatus(null), 2000);
		});

		socketInstance.on("createRoomError", (error) => {
			setCreateRoomSuccess(false);
			setCreateRoomErrors(error);
		});

		socketInstance.on("updatePlayers", (players) => {
			// console.log("all players", players);
			setPlayersData(players);
		});

		socketInstance.on("updateRooms", (rooms) => {
			setRoomsData(rooms);
		});

		socketInstance.on("updateGameData", (data) => {
			// console.log("game data updated", data);
			setRoomsData(data.rooms);
			setPlayersData(data.players);
		});

		socketInstance.on("receivedMessage", (data) => {
			console.log("receivedMessage", data);
			processReceiveMessage(data);
		});
		socketInstance.on("updateMessage", (data) => {
			// console.log("updateMessage", data);
			updateSentMessage(data);
		});

		const handleResize = () => {
			// Hide sidebar if resizing to smaller screens
			if (window.innerWidth >= 1024) {
				setIsSidebarOpen(false);
			}
		};
		window.addEventListener("resize", handleResize);

		// Cleanup event listener
		return () => {
			window.removeEventListener("resize", handleResize);
			socketInstance.off("playerData");
			socketInstance.off("sendStatus");
			socketInstance.off("createRoomSuccess");
			socketInstance.off("createRoomError");
			socketInstance.off("updatePlayers");
			socketInstance.off("updateRooms");
			socketInstance.off("updateGameData");
			socketInstance.disconnect();
		};
	}, []);

	useEffect(() => {
		chatsRef.current = chats;
	}, [chats]);

	useEffect(() => {
		chatIndexRef.current = chatIndex;
	}, [chatIndex]);

	const menuItems = [
		{ id: 1, name: "welcome", label: "Welcome Page" },
		{ id: 2, name: "rooms", label: "View Rooms" },
		{ id: 3, name: "players", label: "View Online Players" },
		{ id: 4, name: "chats", label: "Chats" },
		{ id: 5, name: "about", label: "About" },
	];

	const updateSentMessage = (data) => {
		const { target, message } = data;
		const currentChats = chatsRef.current;

		// Find the index of the chat to update
		const existingIndex = currentChats.findIndex(
			(chat) => chat.id === target.socketId
		);

		if (existingIndex !== -1) {
			// Create a shallow copy of currentChats
			const updatedChats = [...currentChats];

			// Update the specific chat's messages directly
			updatedChats[existingIndex] = {
				...updatedChats[existingIndex],
				messages: [
					...(updatedChats[existingIndex].messages || []),
					message,
				],
			};

			// Update the messages state for the updated chat
			setMessages(updatedChats[existingIndex].messages);

			// Update the chats state
			setChats(updatedChats);
		} else {
			console.log("No chat found with the given socketId");
		}
	};

	const processReceiveMessage = (data) => {
		const { sender, message } = data;

		const currentChats = chatsRef.current;

		const existingIndex = currentChats.findIndex(
			(chat) => chat.id === sender.socketId
		);

		if (existingIndex === -1) {
			const newChat = {
				id: sender.socketId,
				user: sender.username,
				messages: [message],
			};
			currentChats.push(newChat);
			setChats(currentChats);

			if (chatIndexRef.current === 0) {
				setMessages([message]);
			}
		} else {
			const updatedChats = [...currentChats];

			// Update the specific chat's messages directly
			updatedChats[existingIndex] = {
				...updatedChats[existingIndex],
				messages: [
					...(updatedChats[existingIndex].messages || []),
					message,
				],
			};

			// Update the messages state for the updated chat
			if (existingIndex === chatIndexRef.current) {
				setMessages(updatedChats[existingIndex].messages);
			}

			setChats(updatedChats);
		}
		// setChatIndex(sender.socketId);
	};

	const handleGameCreated = (data) => {
		// console.log("game room created..");
		socket.emit("createRoom", data);
	};

	const gameSelected = (data) => {
		console.log(data);
	};

	const handleMenuClick = () => {
		// console.log("menu icon clicked");
		setIsSidebarOpen((currValue) => !currValue);
	};

	const handleMenuItemClick = (name) => {
		setContent(name);
		setIsSidebarOpen(false);
		setCreateRoomErrors(null);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleRoomsTableActionClick = (data) => {
		// console.log("action clicks", data);
		socket.emit(data.action, data.id);
	};

	const handleRemoveChat = (id) => {
		const index = chats.findIndex((chat) => chat.id === id); // Find the current element index
		if (index > 0) {
			setChatIndex[index - 1];
		}
		//remove
		setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
	};

	const handleAddPlayerToChat = (data) => {
		console.log("adding player to chat..");
		const { socketId, username } = data;

		//check if chat exist using socketid
		const existingChat = chats.find((chat) => chat.id === socketId) || null;

		// console.log(socketId, existingChat);
		if (!existingChat) {
			const newChat = {
				id: socketId,
				user: username,
				messages: [],
			};
			setChats((prevChats) => [...prevChats, newChat]);
			setChatIndex(chats.length);
			setMessages([]);

			console.log("new chat created for player..");
		} else {
			//todo..
			const existingChatIndex = chats.indexOf(existingChat);
			setChatIndex(existingChatIndex);
		}
		setContent("chats");
	};

	const handleChangeChatIndex = (id) => {
		const newIndex = chats.findIndex((chat) => chat.id === id);
		setChatIndex(newIndex);

		// Update messages state for the new chat
		const newMessages = chats[newIndex].messages;
		setMessages(newMessages);
	};

	const handleSendMessage = (message) => {
		socket.emit("privateMessage", {
			message: message,
			targetSocket: chats[chatIndex].id,
		});
	};

	return (
		<>
			<div className="fixed top-0 left-0 h-screen w-screen overflow-hidden relative">
				<NavBar onMenuClick={handleMenuClick} />
				<div className="h-[calc(100vh-3rem)] lg:flex relative">
					{/* sidebar */}
					<div
						ref={sidebarRef}
						// className="absolute -translate-x-full lg:translate-x-0 lg:relative min-w-[13rem] bg-gray-200 border-r border-gray-400 overflow-hidden h-full"
						className={`absolute top-0 left-0 h-full w-52 -translate-x-full bg-gray-200 border-r border-gray-400 overflow-hidden h-full transition-transform duration-300 lg:translate-x-0 lg:relative ${
							isSidebarOpen ? "translate-x-0" : "-translate-x-full"
						}`}
					>
						{/* user details */}
						<UserDetails details={userData} />

						{/* menu */}
						<div>
							<h2 className="p-2 font-semibold">Menu</h2>
							<hr className="border-0 border-b border-gray-400" />
							<div className="text-gray-800">
								{menuItems.map((item) => (
									<div
										key={item.id}
										className={`text-sm p-2  ${
											content == item.name
												? "bg-gray-700 text-white"
												: "cursor-pointer hover:bg-gray-400 hover:text-white"
										} `}
										onClick={() => handleMenuItemClick(item.name)}
									>
										{item.label}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* content */}
					<div className="flex-1 h-full overflow-auto bg-white">
						{/* welcome page */}
						{content === "welcome" && (
							<div className="w-[95%] max-w-4xl  mx-auto">
								<FlashMessage status={status} />

								<CreateGame
									reset={createRoomSuccess}
									errors={createRoomErrors}
									onCreateGame={handleGameCreated}
								/>
								<SelectGame onSelectGame={gameSelected} />
							</div>
						)}

						{/* game rooms page */}
						{content === "rooms" && (
							<div className="w-11/12 max-w-4xl bg-white shadow-lg p-4 mt-6 rounded mx-auto border border-gray-400">
								<h1 className="font-semibold text-lg">Rooms</h1>
								<div className="mt-2 overflow-x-auto">
									{roomsData.length > 0 ? (
										<RoomsTable
											rooms={roomsData}
											userId={userData.id}
											onActionClick={handleRoomsTableActionClick}
										/>
									) : (
										<div className="text-gray-600 font-medium px-3 py-2 text-white bg-gray-700">
											No rooms found.
										</div>
									)}
								</div>
							</div>
						)}

						{/* players page */}
						{content === "players" && (
							<PlayersTable
								players={playersData}
								userId={userData.id}
								onAddChatClick={handleAddPlayerToChat}
							/>
						)}

						{/* chat page page */}
						{content === "chats" && (
							<ChatBox
								userSocketId={userData.socketId}
								chats={chats}
								messages={messages}
								chatIndex={chatIndex}
								onRemoveChat={handleRemoveChat}
								onChangeIndex={handleChangeChatIndex}
								onSendMessage={handleSendMessage}
							/>
						)}
						{/* about page */}
						{content === "about" && <About />}
					</div>
				</div>

				{/* {showModal && (
					<EditNameModal
						onSubmit={handleEditNameModalSubmit}
						onClose={handleCloseModal}
						name={username}
					/>
				)} */}
			</div>
		</>
	);
};

export default MainPage;
