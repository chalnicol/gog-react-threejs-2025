import React, { useEffect, useState } from "react";

const CreateGame = ({ reset, errors, onCreateGame }) => {
	const [gameType, setGameType] = useState("classic");
	const [allowSpectators, setAllowSpectators] = useState(true);
	const [privateGame, setPrivateGame] = useState(false);

	const [password, setPassword] = useState("");
	const [playerInvited, setPlayerInvited] = useState("");

	const handleCreateGame = () => {
		onCreateGame({
			type: gameType,
			isPrivate: privateGame,
			playerInvited: playerInvited,
			allowSpectators: allowSpectators,
		});
	};

	const resetForms = () => {
		setGameType("classic");
		setAllowSpectators(true);
		setPrivateGame(false);
		setPlayerInvited("");
	};

	useEffect(() => {
		if (reset) {
			resetForms();
		}
	}, [reset]);

	useEffect(() => {
		if (errors) {
			console.log(errors);
		}
	}, [errors]);

	return (
		<div className="border border-gray-400 bg-white rounded shadow-lg mt-6 px-3 pt-2 pb-4">
			<h1 className="font-semibold text-lg px-1">Create Game</h1>
			<hr className="border-0 border-b border-gray-400 shadow-lg my-1" />

			<div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 mt-3">
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
						Set Mode
					</span>
					<div className="flex text-lg font-medium mt-1 border border-gray-400 rounded">
						<button
							className={`flex-1 p-1 rounded-l ${
								!privateGame
									? "bg-green-400 shadow-inner-soft-dark text-white"
									: "bg-gray-200 hover:bg-gray-300"
							}`}
							onClick={(e) => setPrivateGame(false)}
							disabled={!privateGame}
						>
							Free Play
						</button>
						<button
							className={`flex-1 py-1 rounded-r ${
								privateGame
									? "bg-green-400 shadow-inner-soft-dark text-white"
									: "bg-gray-200 hover:bg-gray-300"
							}`}
							onClick={(e) => setPrivateGame(true)}
							disabled={privateGame}
						>
							Private Match
						</button>
					</div>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 mt-3">
				<div className="flex-1">
					<span className="text-sm text-gray-600 font-medium">
						Invite Player (Required only for Private Match)
					</span>
					<input
						className={`w-full px-3 mt-1 h-[37.5px] border rounded focus:outline-none shadow-inner ${
							privateGame ? "bg-white" : "bg-gray-100"
						} ${
							errors?.playerInvited
								? "border-red-500"
								: "border-gray-400"
						}`}
						type="text"
						placeholder="enter player id"
						value={playerInvited}
						onChange={(e) => setPlayerInvited(e.target.value)}
						maxLength={10}
						disabled={!privateGame}
					/>
					{errors?.playerInvited && (
						<span className="text-xs text-red-500 font-medium">
							{errors.playerInvited}
						</span>
					)}
				</div>
			</div>

			<button
				className="w-full text-white sm:w-40 rounded hover:bg-blue-500 font-bold bg-blue-600 mt-4 py-2 border border active:scale-95"
				onClick={handleCreateGame}
			>
				CREATE
			</button>
		</div>
	);
};

export default CreateGame;
