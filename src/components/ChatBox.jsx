import React, { useEffect, useRef, useState } from "react";

const ChatBox = ({
	userSocketId,
	chats,
	chatIndex,
	onChangeIndex,
	onRemoveChat,
	onSendMessage,
	onInviteResponse,
}) => {
	const [message, setMessage] = useState("");

	const [displayedMessages, setDisplayedMessages] = useState([]);

	const messageWindowRef = useRef(null);

	useEffect(() => {
		// console.log(chatIndex, chats.length);
		if (chatIndex !== null && chats.length > 0 && chatIndex < chats.length) {
			setDisplayedMessages(chats[chatIndex].messages);
		}
	}, [chats, chatIndex]);

	useEffect(() => {
		if (messageWindowRef.current) {
			messageWindowRef.current.scrollTop =
				messageWindowRef.current.scrollHeight;
		}
	}, [displayedMessages]);

	const getUnreadCount = (id) => {
		const index = chats.findIndex((chat) => chat.id === id);
		if (index !== -1) {
			// Count unread messages in the specific chat
			return chats[index].messages.filter((message) => !message.isRead)
				.length;
		}
		return 0; // Return 0 if the chat with the given id is not found
	};

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (message !== "") {
			onSendMessage(message);
			setMessage("");
		}
		//..
	};

	return (
		<div className="w-11/12 max-w-5xl bg-white shadow-lg p-4 mt-6 mb-10 rounded mx-auto border border-gray-400">
			<h1 className="font-semibold text-lg">Chats</h1>
			<hr className="border-0 border-b border-gray-400 my-1" />

			<div className="mt-3 border border-gray-400">
				{chats.length > 0 ? (
					<>
						<div className="flex bg-gray-300 text-white overflow-y-auto">
							{chats.map((chat, index) => (
								<div
									key={chat.id}
									className={`flex items-center px-2 py-1 min-w-40  border-r border-white font-medium text-sm ${
										index === chatIndex
											? "bg-gray-700"
											: "bg-gray-400 text-gray-50 cursor-pointer hover:bg-gray-500 hover:text-gray-200"
									}`}
									onClick={() => onChangeIndex(chat.id)}
								>
									{getUnreadCount(chat.id) > 0 && (
										<div className="me-1 leading-normal">
											<p className="bg-white text-center h-4 w-5 rounded-full text-[0.7rem] leading-[1rem] font-bold text-gray-900">
												{getUnreadCount(chat.id)}
											</p>
										</div>
									)}
									<div className="font-medium">{chat.user}</div>

									<button
										className="ms-auto font-bold hover:text-red-500 px-1 rounded-full text-white text-lg"
										onClick={() => onRemoveChat(chat.id)}
									>
										&times;
									</button>
								</div>
							))}
						</div>

						<div className="w-full bg-green-100">
							<div
								ref={messageWindowRef}
								className="h-[430px] overflow-auto"
							>
								{displayedMessages.length > 0 ? (
									displayedMessages.map((msg, index) => (
										<div
											key={index}
											className={`flex flex-col text-sm text-gray-700 items-start border-b border-gray-300 even:bg-emerald-100 py-1.5 px-2`}
										>
											<div
												className={`font-bold text-xs min-w-28 rounded ${
													msg.sender.socketId === userSocketId
														? "text-blue-500"
														: "text-red-500"
												}`}
											>
												{msg.sender.socketId === userSocketId
													? "You"
													: msg.sender.username}
												:
											</div>
											{msg.type === "regular" && (
												<div className="rounded leading-snug">
													{msg.message}
												</div>
											)}
											{msg.type === "invite" && (
												<div className="border border-gray-400 shadow rounded bg-white my-2 overflow-hidden">
													<div className="font-bold text-xs p-2 bg-gray-700 text-white">
														Game Invite
													</div>
													<div className="px-3 py-2">
														<div className="font-semibold text-gray-600">
															I am challenging you to a{" "}
															<span className="text-xs mx-1 rounded border border-gray-400 px-1.5 font-bold shadow">
																{msg.game.type}
															</span>{" "}
															game! Accept the challenge?
														</div>
														<div className="border rounded my-3 p-2 border border-gray-400 shadow-inner bg-gray-100">
															<p>
																Game ID :{" "}
																<span className="font-semibold">
																	{msg.game.id}
																</span>
															</p>
														</div>
														<div className="space-x-1 mt-3 mb-1">
															<button
																className="text-sm py-0.5 bg-blue-500 hover:bg-blue-600 rounded font-semibold text-white w-16"
																onClick={() =>
																	onInviteResponse({
																		id: msg.game.id,
																		response: "accept",
																	})
																}
															>
																Accept
															</button>
															<button
																className="text-sm py-0.5 bg-red-500 hover:bg-red-600 rounded font-semibold text-white w-16"
																onClick={() =>
																	onInviteResponse({
																		id: msg.game.id,
																		response: "decline",
																	})
																}
															>
																Decline
															</button>
														</div>
													</div>
												</div>
											)}
										</div>
									))
								) : (
									<div className="text-gray-600 text-sm font-medium px-3 py-4">
										Start a conversation to connect and share your
										thoughts!
									</div>
								)}
							</div>

							<form onSubmit={handleSendMessage}>
								<div className="flex border-t border-gray-300">
									<input
										type="text"
										placeholder="Enter your message.."
										className="flex-1 p-2 focus:outline-none"
										name="message"
										value={message}
										autoComplete="off"
										onChange={(e) => setMessage(e.target.value)}
									/>
									<button className="p-2 w-20 bg-gray-700 font-medium text-white active:bg-red-500 hover:bg-gray-600">
										Send
									</button>
								</div>
							</form>
						</div>
					</>
				) : (
					<div className="text-gray-600 font-medium px-3 py-2 text-white bg-gray-700">
						No chats to display.
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatBox;
