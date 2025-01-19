import React, { useEffect, useState } from "react";

const ChatBox = ({
	userSocketId,
	chats,

	chatIndex,
	onChangeIndex,
	onRemoveChat,
	onSendMessage,
}) => {
	const [message, setMessage] = useState("");

	const [displayedMessages, setDisplayedMessages] = useState([]);

	useEffect(() => {
		// console.log(chatIndex, chats.length);
		if (chatIndex !== null && chats.length > 0 && chatIndex < chats.length) {
			setDisplayedMessages(chats[chatIndex].messages);
		}
	}, [chats, chatIndex]);

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
		<div className="w-11/12 max-w-4xl bg-white shadow-lg p-4 mt-6 rounded mx-auto border border-gray-400">
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
											: "bg-gray-400 text-gray-500 cursor-pointer hover:bg-gray-500 hover:text-gray-200"
									}`}
								>
									{getUnreadCount(chat.id) > 0 && (
										<div className="me-1 leading-normal">
											<p className="bg-white text-center h-4 w-5 rounded-full text-[0.7rem] leading-[1rem] font-bold text-gray-900">
												{getUnreadCount(chat.id)}
											</p>
										</div>
									)}
									<div
										className="font-medium"
										onClick={() => onChangeIndex(chat.id)}
									>
										{chat.user}
									</div>

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
							<div className="h-[430px] overflow-auto">
								{displayedMessages.length > 0 ? (
									displayedMessages.map((msg, index) => (
										<div
											key={index}
											className={`flex flex-col text-sm text-gray-700 items-start border-b border-green-300 even:bg-green-200 py-1.5 px-2`}
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
											<div className="rounded leading-snug">
												{msg.message}
											</div>
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
						No chats found.
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatBox;
