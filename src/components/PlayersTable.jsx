import React from "react";

const PlayersTable = ({ players, userId, onAddChatClick }) => {
	return (
		<div className="w-11/12 max-w-5xl bg-white shadow-lg p-4 rounded mt-6 mb-10 mx-auto border border-gray-300">
			<div className="flex items-center">
				<h1 className="font-semibold text-lg ">Online Players</h1>
				{/* <button className="ms-auto text-xs px-3 py-0.5 bg-sky-700 hover:bg-sky-600 rounded font-semibold text-white">
					Refresh
				</button> */}
			</div>
			<div className="mt-2 overflow-x-auto">
				<table className="w-full whitespace-nowrap min-w-[620px]">
					<thead className="bg-gray-700 text-white font-semibold text-sm">
						<tr>
							<th className="text-left p-2">User ID</th>
							<th className="text-left p-2">Username</th>
							{/* <th className="text-left p-2">Credits</th> */}
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

								<td className="p-2 font-semibold text-gray-600">
									<div className="flex items-center">
										{player.username}

										{player.id === userId && (
											<div className="inline-block w-2 h-2 rounded-full bg-red-400 ms-2"></div>
										)}
									</div>
								</td>
								{/* <td className="p-2">{player.credits}</td> */}
								{/* <td className="p-2">TBD</td> */}

								<td className="p-2">
									{player.status == "playing" && (
										<p className="bg-green-600 rounded-full w-20 text-white text-center text-[0.65rem] font-bold">
											PLAYING
										</p>
									)}
									{player.status == "idle" && (
										<p className="bg-gray-400 rounded-full w-20 text-white text-center text-[0.65rem] font-bold">
											IDLE
										</p>
									)}
									{player.status == "waiting" && (
										<p className="bg-orange-400 font-bold rounded-full w-20 text-white text-center text-[0.65rem]">
											WAITING
										</p>
									)}
								</td>
								<td className="p-2">
									{player.id !== userId ? (
										<button
											className="text-xs py-0.5 w-24 text-white font-semibold bg-orange-500 hover:bg-orange-600 rounded"
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
