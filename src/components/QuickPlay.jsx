import React, { useState } from "react";

const QuickPlay = ({ onQuickPlay }) => {
	const [gameOpponent, setGameOpponent] = useState("online");
	const [gameType, setGameType] = useState("classic");

	const handleSelectGame = () => {
		onQuickPlay({
			opponent: gameOpponent,
			type: gameType,
		});
	};
	return (
		<div className="border border-gray-400 bg-white rounded shadow-lg mt-6 px-3 pt-2 pb-4">
			<h1 className="font-semibold text-lg px-1">Quick Play</h1>
			<hr className="border-0 border-b border-gray-400 shadow-lg my-1" />

			<div className="flex flex-col lg:flex-row gap-x-5 gap-y-2 mt-3">
				<div className="flex-1">
					<span className="text-sm text-gray-600 font-medium">
						Select Type
					</span>
					<div className="flex text-lg font-medium mt-1 border border-gray-400 rounded">
						<button
							className={`flex-1 p-1 rounded-l ${
								gameType == "classic"
									? "bg-green-400 shadow-inner-soft-dark text-white"
									: "bg-gray-200 hover:bg-gray-300"
							}`}
							onClick={(e) => setGameType("classic")}
							disabled={gameType == "classic"}
						>
							Classic
						</button>
						<button
							className={`flex-1 p-1 rounded-r ${
								gameType == "blitz"
									? "bg-green-400 shadow-inner-soft-dark text-white"
									: "bg-gray-200 hover:bg-gray-300"
							}`}
							onClick={(e) => setGameType("blitz")}
							disabled={gameType == "blitz"}
						>
							Blitz
						</button>
					</div>
				</div>
				<div className="flex-1">
					<span className="text-sm text-gray-600 font-medium">
						Select Opponent
					</span>
					<div className="flex text-lg font-medium mt-1 border border-gray-400 rounded">
						<button
							className={`flex-1 p-1 rounded-l ${
								gameOpponent == "online"
									? "bg-green-400 shadow-inner-soft-dark text-white"
									: "bg-gray-200 hover:bg-gray-300"
							}`}
							onClick={(e) => setGameOpponent("online")}
							disabled={gameOpponent == "online"}
						>
							Online Player
						</button>
						<button
							className={`flex-1 p-1 rounded-r ${
								gameOpponent == "ai"
									? "bg-green-400 shadow-inner-soft-dark text-white"
									: "bg-gray-200 hover:bg-gray-300"
							}`}
							onClick={(e) => setGameOpponent("ai")}
							disabled={gameOpponent == "ai"}
						>
							AI
						</button>
					</div>
				</div>
			</div>

			<button
				className="w-full text-white md:w-40 rounded hover:bg-blue-500 bg-blue-600 mt-4 font-bold active:scale-95 py-2 border border"
				onClick={handleSelectGame}
			>
				PLAY
			</button>
		</div>
	);
};

export default QuickPlay;
