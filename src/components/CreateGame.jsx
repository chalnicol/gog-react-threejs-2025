import React, { useEffect, useState } from "react";

const CreateGame = ({ reset, errors, onCreateGame }) => {
	const [gameType, setGameType] = useState("classic");
	const [allowSpectators, setallowSpectators] = useState(true);
	const [password, setPassword] = useState("");
	const [playerInvited, setPlayerInvited] = useState("");

	const handleCreateGame = () => {
		onCreateGame({
			type: gameType,
			password: password,
			playerInvited: playerInvited,
			allowSpectators: allowSpectators,
		});
	};

	const resetForms = () => {
		setGameType("classic");
		setallowSpectators(true);
		setPassword("");
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
			<h1 className="font-semibold text-lg px-1">Create Room</h1>
			<hr className="border-0 border-b border-gray-400 shadow-lg my-1" />

			<div className="flex flex-col lg:flex-row gap-x-3 gap-y-2 mt-3">
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
						Allow Spectators
					</span>
					<div className="flex text-lg font-medium mt-1 border border-gray-400 rounded">
						<button
							className={`flex-1 p-1 rounded-l ${
								allowSpectators
									? "bg-green-400 shadow-inner-soft-dark text-white"
									: "bg-gray-200 hover:bg-gray-300"
							}`}
							onClick={(e) => setallowSpectators(true)}
							disabled={allowSpectators}
						>
							Yes
						</button>
						<button
							className={`flex-1 p-1 rounded-r ${
								!allowSpectators
									? "bg-green-400 shadow-inner-soft-dark text-white"
									: "bg-gray-200 hover:bg-gray-300"
							}`}
							onClick={(e) => setallowSpectators(false)}
							disabled={!allowSpectators}
						>
							No
						</button>
					</div>
				</div>
			</div>

			<div className="flex flex-col lg:flex-row gap-x-3 gap-y-2 mt-3">
				<div className="flex-1">
					<span className="text-sm text-gray-600 font-medium">
						Set Game Password (Optional)
					</span>
					<input
						className="w-full px-3 mt-1 py-2 border border-gray-400 rounded focus:outline-none"
						type="text"
						placeholder="enter a password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						maxLength={15}
					/>
					{errors?.password && (
						<span className="text-xs text-red-500">
							{errors.password}
						</span>
					)}
				</div>

				<div className="flex-1">
					<span className="text-sm text-gray-600 font-medium">
						Invite A Player (Optional)
					</span>
					<input
						className="w-full px-3 mt-1 py-2 border border-gray-400 rounded focus:outline-none"
						type="text"
						placeholder="enter player id"
						value={playerInvited}
						onChange={(e) => setPlayerInvited(e.target.value)}
						maxLength={10}
					/>
					{errors?.playerInvited && (
						<span className="text-xs text-red-500">
							{errors.playerInvited}
						</span>
					)}
				</div>
			</div>

			<button
				className="w-full text-white md:w-40 rounded hover:bg-blue-500 bg-blue-600 mt-4 py-2 border border"
				onClick={handleCreateGame}
			>
				Create
			</button>
		</div>
	);
};

export default CreateGame;
