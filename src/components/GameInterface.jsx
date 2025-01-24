import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowLeft,
	faBars,
	faEyeSlash,
	faCircleInfo,
	faArrowRight,
	faGear,
	faCircleXmark,
	faCircleCheck,
	faFlag,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import PlayerIndicator from "./PlayerIndicator";
import GamePrompt from "./GamePrompt";
import gsap from "gsap";
const GameInterface = ({
	players,
	phase,
	message,
	clock,
	turn,
	onGameAction,
}) => {
	const [gameMenuShown, setGameMenuShown] = useState(false);
	const [showMessage, setShowMessage] = useState(false);

	useEffect(() => {
		setTimeout(() => setGameMenuShown(true), 1000);
	}, []);
	useEffect(() => {
		if (message !== "") {
			setShowMessage(true);
		}
	}, [message]);

	useEffect(() => {
		if (gameMenuShown) {
			openAnim();
		}
	}, [gameMenuShown]);

	const controlsRef = useRef(null);

	const closeAnim = () => {
		gsap.to(controlsRef.current, {
			yPercent: 100,
			duration: 0.4,
			ease: "power4.out",
			onComplete: () => {
				setGameMenuShown(false);
			},
		});
	};

	const openAnim = () => {
		gsap.fromTo(
			controlsRef.current,
			{ yPercent: 100 },
			{
				yPercent: 0,
				ease: "power4.out",
				duration: 0.4,
			}
		);
	};

	const handleGameMenuClick = () => {
		// setGameMenuShown(!gameMenuShown);
		if (!gameMenuShown) {
			setGameMenuShown(true);
		} else {
			closeAnim();
		}
	};

	const isReadyButtonDisabled = useMemo(() => {
		return phase !== "prep" || players[0].isReady;
	}, [players, phase]);

	// console.log("p", players);
	const handleControlsClick = (action) => {
		// if (action !== "leaveGame") {
		// 	closeAnim();
		// }
		onGameAction({ action: action });
	};

	return (
		<>
			{/* player indicator */}
			<div className="absolute bg-gray-600 h-32 md:h-12 w-full rounded top-0">
				{players && players.length > 0 && (
					<div className="flex flex-col md:flex-row gap-y-2 justify-center items-center gap-x-2 px-4 absolute h-full w-full  font-semibold">
						<PlayerIndicator
							className={`${turn === 0 ? "bg-green-200" : "bg-white"}`}
							clock={clock}
							username={players[0].username}
							turn={turn}
							index={0}
							phase={phase}
							isReady={players[0].isReady}
						/>
						<div className="absolute md:relative font-bold text-white h-10 md:h-2/3 aspect-square border border-red-500 bg-red-600 flex items-center justify-center rounded-full">
							VS
						</div>
						<PlayerIndicator
							className={`${turn === 1 ? "bg-green-200" : "bg-white"}`}
							clock={clock}
							username={players[1].username}
							turn={turn}
							index={1}
							phase={phase}
							isReady={players[1].isReady}
						/>
					</div>
				)}
			</div>
			{/* game controls.. */}

			{gameMenuShown && (
				<div
					ref={controlsRef}
					className="absolute bottom-14 right-0 bg-gray-200 rounded-t w-16 h-3/5 md:h-[calc(100vh-7rem)] max-h-[400px] overflow-hidden flex flex-col"
				>
					<button
						className={`w-full aspect-square border text-lg border-gray-400 leading-5  ${
							isReadyButtonDisabled ? "" : "hover:bg-teal-100"
						}`}
						onClick={() => handleControlsClick("playerReady")}
						disabled={isReadyButtonDisabled}
					>
						<FontAwesomeIcon
							icon={faCircleCheck}
							className={`${
								isReadyButtonDisabled
									? "text-gray-500"
									: "text-green-500"
							}`}
						/>
						<br />
						<span className="text-sm font-semibold">Ready</span>
					</button>

					{phase == "main" && (
						<button
							className="w-full aspect-square border text-lg border-gray-400 leading-5 hover:bg-teal-100 "
							onClick={() => handleControlsClick("playerSurrender")}
						>
							<FontAwesomeIcon
								icon={faFlag}
								className="text-green-600"
							/>
							<br />
							<span className="text-sm font-semibold">Surrender</span>
						</button>
					)}

					<button
						className="w-full aspect-square border text-lg  border-gray-400 leading-5 hover:bg-teal-100"
						onClick={() => handleControlsClick("leaveGame")}
					>
						<FontAwesomeIcon
							className="text-red-600"
							icon={faCircleXmark}
						/>
						<br />
						<span className="text-sm font-semibold">Leave</span>
					</button>
				</div>
			)}
			<button
				className="text-white text-2xl rounded-tl-lg bg-amber-500 absolute bottom-0 right-0 w-16 aspect-square"
				onClick={handleGameMenuClick}
			>
				<FontAwesomeIcon icon={gameMenuShown ? faXmark : faGear} />
			</button>

			{/* prompt */}
			{showMessage && (
				<GamePrompt
					message={message}
					onClose={() => setShowMessage(false)}
				/>
			)}
		</>
	);
};

export default GameInterface;
