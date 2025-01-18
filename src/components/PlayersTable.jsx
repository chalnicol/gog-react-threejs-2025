import React from "react";

const PlayersTable = ({ players, userId, onAddChatClick }) => {
	return (
		<div className="w-11/12 max-w-4xl bg-white shadow-lg p-4 rounded mt-6 mx-auto border border-gray-300">
			<h1 className="font-semibold text-lg">Online Players</h1>
			<div className="mt-2 overflow-x-auto">
				<table className="w-full whitespace-nowrap min-w-[620px]">
					<thead className="bg-gray-700 text-white font-semibold text-sm">
						<tr>
							<th className="text-left p-2">User ID</th>
							<th className="text-left p-2">Username</th>
							<th className="text-left p-2">Credits</th>
							<th className="text-left p-2">Status</th>
							<th className="text-left p-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{players.map((player) => (
							<tr
								key={player.id}
								className={` text-sm ${
									player.id === userId
										? "bg-amber-100"
										: "odd:bg-gray-200"
								}`}
							>
								<td className="p-2">{player.id}</td>

								<td className="p-2 font-medium text-gray-600">
									{player.username}
								</td>
								{/* <td className="p-2">{player.credits}</td> */}
								<td className="p-2">--</td>

								<td className="p-2">
									{player.status == "playing" ? (
										<p className="bg-green-600 rounded-full w-20 text-white text-center text-[0.65rem] font-medium">
											PLAYING
										</p>
									) : (
										<p className="bg-gray-400 rounded-full w-20 text-white text-center text-[0.65rem] font-medium">
											IDLE
										</p>
									)}
								</td>
								<td className="p-2">
									{player.id !== userId ? (
										<button
											className="text-xs py-0.5 w-20 text-white font-semibold bg-orange-500 hover:bg-orange-600 w-full rounded"
											onClick={() =>
												onAddChatClick({
													socketId: player.socketId,
													username: player.username,
												})
											}
										>
											Chat
										</button>
									) : (
										<span>--</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PlayersTable;
