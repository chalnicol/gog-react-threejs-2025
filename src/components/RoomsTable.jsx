import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLock,
	faLockOpen,
	faXmark,
	faCheck,
} from "@fortawesome/free-solid-svg-icons";

const RoomsTable = ({ rooms, userId, onActionClick }) => {
	const renderRoomActionButton = (room, userId) => {
		if (
			room.status === "open" &&
			room.players.some((player) => player.id === userId)
		) {
			return (
				<button
					className="text-xs py-0.5 font-medium text-white bg-red-500 hover:bg-red-400 w-full rounded"
					onClick={() =>
						onActionClick({ action: "deleteRoom", id: room.id })
					}
				>
					Delete
				</button>
			);
		} else if (
			room.status === "open" &&
			room.players.some((player) => player.id !== userId)
		) {
			return (
				<button
					className="text-xs py-0.5 font-medium text-white bg-blue-500 hover:bg-blue-400 w-full rounded"
					onClick={() =>
						onActionClick({
							action: "joinRoom",
							id: room.id,
							withPassword: room.withPassword,
						})
					}
				>
					Join
				</button>
			);
		} else if (room.status === "closed") {
			return (
				<button
					className="text-xs py-0.5 font-medium text-white bg-orange-500 hover:bg-orange-400 w-full rounded"
					onClick={() =>
						onActionClick({ action: "spectateRoom", id: room.id })
					}
				>
					Spectate
				</button>
			);
		}
		return <span>--</span>;
	};

	return (
		<table className="w-full whitespace-nowrap min-w-[620px]">
			<thead className="bg-gray-700 text-white font-semibold text-sm">
				<tr>
					<th className="text-left p-2">Game ID</th>
					<th className="text-left p-2">Created By</th>
					<th className="text-left p-2">Type</th>
					<th className="text-left p-2">Status</th>
					<th className="text-left p-2">Spectators?</th>
					<th className="text-left p-2">Password?</th>
					<th className="text-left p-2">Actions</th>
				</tr>
			</thead>
			<tbody>
				{rooms.map((room) => (
					<tr key={room.id} className="odd:bg-gray-200 text-sm">
						<td className="p-2">{room.id.substring(0, 15)}...</td>
						<td className="p-2 text-gray-600 font-medium">
							{room.players[0].username}
						</td>
						<td className="p-2">
							<span className="text-sm">{room.type}</span>
						</td>
						<td className="p-2">
							<span className="text-sm">{room.status}</span>
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

						<td className="p-2 text-base">
							{room.withPassword ? (
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
						</td>

						<td className="p-2">
							{renderRoomActionButton(room, userId)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default RoomsTable;
