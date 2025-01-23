import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowLeft,
	faBars,
	faEyeSlash,
	faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import PlayerIndicator from "./PlayerIndicator";

const GameInterface = ({
	players,
	message,
	phase,
	clock,
	turn,
	onGameAction,
}) => {
	const [showGameMenu, setShowGameMenu] = useState(false);
	const [showMessage, setShowMessage] = useState(false);
	const [popupmessage, setPopupMessage] = useState(message || "");

	useEffect(() => {
		if (message !== "") {
			setPopupMessage(message);
			setShowMessage(true);

			setTimeout(() => {
				setShowMessage(false);
				setPopupMessage("");
			}, 5000);
		}
	}, [message]);

	return (
		<>
			<div className="absolute bg-gray-600 h-12 w-full top-0">
				<div className="flex items-center h-full">
					{players && players.length > 0 && (
						<div className="flex justify-center items-center gap-x-2 px-4 absolute h-full w-full  font-semibold">
							<PlayerIndicator
								className={`h-3/4 min-w-44 w-1/4 ${
									turn === 0 ? "bg-green-300" : "bg-white"
								}`}
								clock={clock}
								username={players[0].username}
								turn={turn}
								index={0}
							/>
							<div className="font-bold text-white h-2/3 aspect-square border border-red-500 bg-red-600 flex items-center justify-center rounded-full">
								VS
							</div>
							<PlayerIndicator
								className={`h-3/4 min-w-44 w-1/4 ${
									turn === 1 ? "bg-green-300" : "bg-white"
								}`}
								clock={clock}
								username={players[1].username}
								turn={turn}
								index={1}
							/>
						</div>
					)}

					<div className="absolute top-0 left-0 h-full w-12 bg-red-500">
						<button
							className="text-white w-full h-full text-lg"
							onClick={() => setShowGameMenu((prev) => !prev)}
						>
							<FontAwesomeIcon icon={faBars} />
						</button>
						{showGameMenu && (
							<div className="absolute left-0 bg-white w-36 text-sm">
								{/* <div className="px-3 py-2 space-x-2 hover:bg-red-100 cursor-pointer">
									<FontAwesomeIcon icon={faEyeSlash} />{" "}
									<span>Hide Control</span>
								</div> */}
								<div
									className="px-3 py-2 space-x-2 hover:bg-red-100 cursor-pointer"
									onClick={() => onGameAction({ action: "leaveGame" })}
								>
									<FontAwesomeIcon icon={faArrowLeft} />{" "}
									<span>Leave Game</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			{showMessage && (
				<div className="absolute w-11/12 max-w-[350px] left-[50%] translate-x-[-50%] bg-yellow-200 border border-yellow-300 text-gray-800 top-16 px-4 py-2 font-semibold rounded-full">
					<FontAwesomeIcon icon={faCircleInfo} />
					<span className="ms-2">{popupmessage}</span>
				</div>
			)}
		</>
	);
};

export default GameInterface;
