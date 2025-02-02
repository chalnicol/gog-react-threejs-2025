import React, { useEffect, useRef, useState } from "react";
import CreateGame from "./CreateGame";
import QuickPlay from "./QuickPlay";
import About from "./About";
import NavBar from "./NavBar";
import UserDetails from "./UserDetails";
import FlashMessage from "./FlashMessage";
import RoomsTable from "./RoomsTable";
import PlayersTable from "./PlayersTable";
import ChatBox from "./ChatBox";
import InvitePlayerModal from "./InvitePlayerModal";
import LoadingScreen from "./LoadingScreen";
import GuideAndGameRules from "./GuideAndGameRules";
import GameComponent from "./GameComponent";

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
	const [chats, setChats] = useState([]);
	const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
	const [chatIndex, setChatIndex] = useState(null);
	const [showPlayerInviteModal, setShowPlayerInviteModal] = useState(false);
	const [toJoinRoom, setToJoinRoom] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingCaption, setLoadingCaption] = useState("Loading");

	const [gameInited, setGameInited] = useState(false);
	const [gameUpdates, setGameUpdates] = useState(null);
	const chatIndexRef = useRef(null);
	const sidebarRef = useRef(null);

	const socketRef = useRef(null);

	useEffect(() => {
		// const socketInstance = io("http://localhost:3000");
		const socketInstance = io(
			import.meta.env.VITE_API_URL || "http://localhost:3000"
		);

		setSocket(socketInstance);

		socketInstance.emit("join", playerName);

		socketInstance.on("playerData", (player) => {
			// console.log("player", player);
			setUserData(player);
		});

		socketInstance.on("sendStatus", (data) => {
			// console.log("status", data);
			setStatus(data);
			// setTimeout(() => setStatus(null), 3000);
		});

		socketInstance.on("createRoomSuccess", (data) => {
			setCreateRoomSuccess(true);
			setTimeout(() => setCreateRoomSuccess(false), 10); //
			setCreateRoomErrors(null);
			setStatus(data);
			// setTimeout(() => setStatus(null), 3000);
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
			processReceiveMessage(data);
		});

		socketInstance.on("quickPlayFailed", (data) => {
			setStatus(data);
			// setTimeout(() => setStatus(null), 3000);
			setLoading(false);
		});

		socketInstance.on("sendGameUpdate", (data) => {
			// console.log("sending game updates", data);
			if (data.event == "initGame") {
				setGameInited(true);
				setLoading(false);
				setChatIndex(null);
				setContent("welcome");
			}
			setGameUpdates(data);
		});

		const handleResize = () => {
			// Hide sidebar if resizing to smaller screens
			if (window.innerWidth >= 1024) {
				setIsSidebarOpen(false);
			}
		};
		window.addEventListener("resize", handleResize);
		console.log("io inited..");
		// Cleanup event listener
		return () => {
			window.removeEventListener("resize", handleResize);
			const evnts = [
				"playerData",
				"sendStatus",
				"createRoomSuccess",
				"createRoomError",
				"updatePlayers",
				"updateRooms",
				"updateGameData",
				"receivedMessage",
				"initGame",
				"quickPlayFailed",
			];

			evnts.forEach((e) => socketInstance.off(e));

			socketInstance.disconnect();
		};
	}, []);

	useEffect(() => {
		if (content === "chats") {
			if (chats.length > 0 && chatIndex === null) {
				// Automatically set chatIndex to 0 if none is selected
				setChatIndex(0);
			}

			if (chatIndex !== null && chatIndex >= 0 && chatIndex < chats.length) {
				// Mark all messages in the current chat as read
				setChats((prevChats) => {
					const updatedChats = prevChats.map((chat, index) => {
						if (index === chatIndex) {
							return {
								...chat,
								messages: chat.messages.map((message) => ({
									...message,
									isRead: true, // Mark all messages in this chat as read
								})),
							};
						}
						return chat;
					});

					// Update unread messages count
					const unreadCount = updatedChats.reduce(
						(totalUnread, chat) =>
							totalUnread +
							chat.messages.filter((message) => !message.isRead).length,
						0
					);
					setUnreadMessagesCount(unreadCount);

					return updatedChats;
				});
			}
		} else {
			setChatIndex(null);
		}
		chatIndexRef.current = chatIndex;
	}, [content, chats.length, chatIndex]);

	const menuItems = [
		{ id: 1, name: "welcome", label: "Welcome Page" },
		{ id: 2, name: "players", label: "View Online Players" },
		{ id: 3, name: "rooms", label: "View All Games" },
		{ id: 4, name: "chats", label: "Chats" },
		{ id: 5, name: "guides", label: "Guide & Game Rules" },
		{ id: 6, name: "about", label: "About" },
	];

	const updateSentMessage = (data) => {
		const { target, message } = data;

		setChats((prevChats) => {
			const index = prevChats.findIndex(
				(chat) => chat.id === target.socketId
			);

			let updatedChats;
			if (index !== -1) {
				updatedChats = [...prevChats];
				updatedChats[index] = {
					...updatedChats[index],
					messages: [
						...updatedChats[index].messages,
						{
							...message,
							isRead: true, // Mark as read if it's the active chat
						},
					],
				};
			}
			return updatedChats;
		});
	};

	const processReceiveMessage = (data) => {
		const { sender, message } = data;

		setChats((prevChats) => {
			const index = prevChats.findIndex(
				(chat) => chat.id === sender.socketId
			);

			let updatedChats;

			if (index !== -1) {
				// console.log("Updating the current chat.");
				updatedChats = [...prevChats];

				updatedChats[index] = {
					...updatedChats[index],
					messages: [
						...updatedChats[index].messages,
						{
							...message,
							isRead: index === chatIndexRef.current, // Mark as read if it's the active chat
						},
					],
				};
			} else {
				updatedChats = [
					...prevChats,
					{
						id: sender.socketId,
						user: sender.username,
						messages: [
							{
								...message,
								isRead: index === chatIndexRef.current, // New chat, messages are unread
							},
						],
					},
				];
			}

			// Update unread messages count
			const unreadCount = updatedChats.reduce(
				(totalUnread, chat) =>
					totalUnread +
					chat.messages.filter((message) => !message.isRead).length,
				0
			);
			setUnreadMessagesCount(unreadCount);

			return updatedChats;
		});
	};

	const handleGameCreated = (data) => {
		// console.log("game room created..");
		socket.emit("createRoom", data);
	};

	const handleMenuClick = () => {
		// console.log("menu icon clicked");
		setIsSidebarOpen((currValue) => !currValue);
	};

	const handleMenuItemClick = (name) => {
		setContent(name);
		setIsSidebarOpen(false);
		setCreateRoomErrors(null);
		setStatus(null);
	};

	const handleRoomsTableActionClick = (data) => {
		// console.log("action clicks", data);
		if (data.action === "invitePlayer") {
			//TODO:
			setToJoinRoom(data.id);
			setShowPlayerInviteModal(true);
		} else {
			socket.emit(data.action, data.id);
		}
	};

	const handlePlayerInviteModalSubmit = (playerId) => {
		// console.log("password submitted, joining room");
		setShowPlayerInviteModal(false);
		socket.emit("invitePlayer", { id: toJoinRoom, playerId: playerId });
	};

	const handleRemoveChat = (id) => {
		const currChatsLength = chats.length;

		const index = chats.findIndex((chat) => chat.id === id); // Find the current element index

		setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));

		if (currChatsLength > 1) {
			if (index > 0) {
				setChatIndex[index - 1];
			} else {
				setChatIndex(0);
			}
		} else {
			setChatIndex(null);
		}
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
			// setMessages([]);

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
		// const newMessages = chats[newIndex].messages;
		// setMessages(newMessages);
	};

	const handleSendMessage = (message) => {
		socket.emit("privateMessage", {
			message: message,
			targetSocket: chats[chatIndex].id,
		});
	};

	const handleInviteResponse = (data) => {
		console.log("invite response received", data.response);
		socket.emit("inviteResponse", data);
	};

	const handleQuickPlay = (data) => {
		console.log(data);
		setLoading(true);
		setLoadingCaption(data.opponent === "online" ? "Searching" : "Loading");
		socket.emit("quickPlay", data);
	};

	const handleGameAction = (data) => {
		// console.log("game actions received", data);
		if (data.action === "leaveGame") {
			setGameInited(false);
		}
		socket.emit("gameAction", data);
	};

	return (
		<>
			<div className="fixed top-0 left-0 h-screen w-screen overflow-hidden">
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
										{item.name === "chats" ? (
											<div className="flex items-center">
												<p>{item.label}</p>
												{unreadMessagesCount > 0 && (
													<p className="ms-2 bg-red-500 h-4 w-6 leading-[15px] text-center rounded-full text-[0.7rem] font-bold text-white">
														{unreadMessagesCount}
													</p>
												)}
											</div>
										) : (
											<span>{item.label}</span>
										)}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* content */}
					<div className="flex-1 h-full overflow-auto bg-white">
						{/* welcome page */}
						{content === "welcome" && (
							<div className="w-[95%] max-w-3xl  mx-auto">
								<h1 className="text-lg font-bold border-y border-gray-400 text-gray-400 px-3 py-2 bg-gray-50 mt-8 text-center">
									Welcome to Game of the Generals (Salpakan)
								</h1>
								<FlashMessage
									status={status}
									onClose={() => setStatus(null)}
								/>

								<QuickPlay onQuickPlay={handleQuickPlay} />
							</div>
						)}

						{/* game rooms page */}
						{content === "rooms" && (
							<>
								<div className="w-11/12 max-w-5xl  mx-auto">
									<FlashMessage
										status={status}
										onClose={() => setStatus(null)}
									/>

									<CreateGame
										reset={createRoomSuccess}
										errors={createRoomErrors}
										onCreateGame={handleGameCreated}
									/>
								</div>

								<div className="w-11/12 max-w-5xl bg-white shadow-lg p-4 mt-6 rounded mx-auto border border-gray-400">
									<div className="flex items-center">
										<h1 className="font-semibold text-lg ">Games</h1>
										{/* <button className="ms-auto text-xs px-3 py-0.5 bg-sky-700 hover:bg-sky-600 rounded font-semibold text-white">
											Refresh
										</button> */}
									</div>

									<div className="mt-2 overflow-x-auto">
										{roomsData.length > 0 ? (
											<RoomsTable
												rooms={roomsData}
												user={userData}
												socketId={userData.socketId}
												onActionClick={handleRoomsTableActionClick}
											/>
										) : (
											<div className="text-gray-600 font-medium px-3 py-2 text-white bg-gray-700">
												No games to display.
											</div>
										)}
									</div>
								</div>
							</>
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
								chatIndex={chatIndex}
								onRemoveChat={handleRemoveChat}
								onChangeIndex={handleChangeChatIndex}
								onSendMessage={handleSendMessage}
								onInviteResponse={handleInviteResponse}
							/>
						)}

						{/* about page */}
						{content === "about" && <About />}

						{/* settings page */}
						{content === "guides" && <GuideAndGameRules />}
					</div>
				</div>

				{showPlayerInviteModal && (
					<InvitePlayerModal
						onSubmit={handlePlayerInviteModalSubmit}
						onClose={() => setShowPlayerInviteModal(false)}
					/>
				)}
				{loading && <LoadingScreen caption={loadingCaption} />}
			</div>
			{gameInited && (
				<GameComponent
					gameUpdates={gameUpdates}
					onGameAction={handleGameAction}
				/>
			)}
		</>
	);
};

export default MainPage;
