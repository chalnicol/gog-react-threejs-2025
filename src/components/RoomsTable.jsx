import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLock,
	faLockOpen,
	faXmark,
	faCheck,
} from "@fortawesome/free-solid-svg-icons";

const RoomsTable = ({ rooms, socketId, onActionClick }) => {
	const isInTheRoom = (room, sid) => {
		return room.players.some((player) => player.socketId === sid);
	};

	const renderRoomActionButton = (room, socketId) => {
		const renderButton = (label, color, action) => (
			<button
				className={`text-xs py-0.5 font-semibold text-white ${color} hover:${color}-400 px-2 min-w-16 rounded`}
				onClick={() => onActionClick({ action, id: room.id })}
			>
				{label}
			</button>
		);
		if (room.status === "open") {
			if (isInTheRoom(room, socketId) && room.privateMatch) {
				if (room.playerInvitedId) {
					return renderButton("Delete", "bg-red-500", "deleteRoom");
				} else {
					return (
						<div className="space-x-1">
							{renderButton(
								"Invite Player",
								"bg-teal-500",
								"invitePlayer"
							)}
							{renderButton("Delete", "bg-red-500", "deleteRoom")}
						</div>
					);
				}
			} else if (isInTheRoom(room, socketId) && !room.privateMatch) {
				return renderButton("Delete", "bg-red-500", "deleteRoom");
			} else if (!isInTheRoom(room, socketId) && !room.privateMatch) {
				return renderButton("Join", "bg-blue-500", "joinRoom");
			}
		}

		if (room.status === "closed") {
			if (room.allowSpectators && !isInTheRoom(room, socketId)) {
				return renderButton("Spectate", "bg-orange-500", "spectateRoom");
			}
		}

		// Default fallback
		return <span>--</span>;
	};

	return (
		<table className="w-full whitespace-nowrap min-w-[620px]">
			<thead className="bg-gray-700 text-white font-semibold text-sm">
				<tr>
					<th className="text-left p-2">Game ID</th>
					<th className="text-left p-2">Created By</th>
					<th className="text-left p-2">Mode</th>
					<th className="text-left p-2">Type</th>
					<th className="text-left p-2">Status</th>
					<th className="text-left p-2">Spectators?</th>
					<th className="text-left p-2">Actions</th>
				</tr>
			</thead>
			<tbody>
				{rooms.map((room) => (
					<tr
						key={room.id}
						className={`${
							isInTheRoom(room, socketId)
								? "bg-yellow-100"
								: "odd:bg-gray-200"
						} text-sm`}
					>
						<td className="p-2">{room.id.substring(0, 10)}...</td>
						<td className="p-2 text-gray-600 font-medium">
							{room.players[0].username}
						</td>
						<td className="p-2">
							<span className="text-sm">{room.type}</span>
						</td>

						<td className="p-2">
							<span className="text-sm">{room.status}</span>
						</td>

						<td className="p-2 text-sm">
							{room.privateMatch ? (
								<span>Private Match</span>
							) : (
								<span>Free Play</span>
							)}
							{/* <span className="text-xs">{game.status}</span> */}
						</td>
						<td className="p-2 text-base">
							{room.allowSpectators ? (
								<FontAwesomeIcon
									icon={faCheck}
									className="text-green-600"
								/>
							) : (
								<FontAwesomeIcon
									icon={faXmark}
									className="text-red-600"
								/>
							)}
							{/* <span className="text-xs">{game.status}</span> */}
						</td>

						<td className="p-2">
							{renderRoomActionButton(room, socketId)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default RoomsTable;
