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
	faXmark,
	faFlag,
} from "@fortawesome/free-solid-svg-icons";
import {
	faFaceTired,
	faFaceAngry,
	faFaceSmile,
	faFaceGrinTongue,
	faFaceSurprise,
	faFaceLaughBeam,
} from "@fortawesome/free-regular-svg-icons"; // Regular

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
	const [emoteDisabled, setEmoteDisabled] = useState(false);

	const [buttonsState, setButtonState] = useState({
		playerReady: false,
		playerSurrender: false,
		leaveGame: false,
	});

	const buttonEmotes = [
		faFaceTired,
		faFaceAngry,
		faFaceSmile,
		faFaceGrinTongue,
		faFaceSurprise,
		faFaceLaughBeam,
	];

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

	const handleButtonClick = (action) => {
		setButtonState((prev) => ({ ...prev, [action]: !prev[action] }));
		onGameAction({ action: action });
	};

	const handleSendEmote = (emoteIndex) => {
		setEmoteDisabled(true);
		setTimeout(() => setEmoteDisabled(false), 5000); // 2 seconds delay for emote to be disabled again
		onGameAction({ action: "sendEmote", emoteIndex: emoteIndex });
	};

	const handleConfimation = (response) => {
		setShowMessage(false);
		onGameAction({ action: "playAgain", response: response });
	};

	return (
		<>
			{/* player indicator */}
			<div className="absolute bg-gray-600 h-32 sm:h-12 w-full top-0">
				{players && players.length > 0 && (
					<div className="flex flex-col sm:flex-row gap-y-2 justify-center items-center gap-x-2 px-4 absolute h-full w-full  font-semibold">
						<PlayerIndicator
							clock={clock}
							username={players[0].username}
							isTurn={turn == 0}
							phase={phase}
							isReady={players[0].isReady}
							index={0}
						/>
						<div className="absolute sm:relative font-bold text-white h-10 sm:h-2/3 aspect-square border border-red-500 bg-red-600 flex items-center justify-center rounded-full">
							VS
						</div>
						<PlayerIndicator
							clock={clock}
							username={players[1].username}
							isTurn={turn == 1}
							phase={phase}
							isReady={players[1].isReady}
							index={1}
						/>
					</div>
				)}
			</div>
			{/* game controls.. */}

			{gameMenuShown && (
				<div
					ref={controlsRef}
					className="absolute bottom-0 right-0 bg-white rounded-t w-20 h-[340px] lg:h-2/3 overflow-hidden"
				>
					<div className="text-center font-bold bg-amber-500 text-white text-xs py-1 select-none">
						Controls
					</div>
					<div className="w-full">
						{phase == "prep" && (
							<button
								className={`group w-full py-3 border text-lg border-gray-400 leading-5 ${
									buttonsState.playerReady
										? "text-gray-400"
										: "text-green-700 hover:bg-yellow-50"
								}`}
								onClick={() => handleButtonClick("playerReady")}
								disabled={buttonsState.playerReady}
							>
								<FontAwesomeIcon icon={faCircleCheck} />
								<br />
								<span
									className={`text-sm font-semibold ${
										buttonsState.playerReady
											? "text-gray-400"
											: "text-gray-700"
									}`}
								>
									Ready
								</span>
							</button>
						)}

						{phase == "main" && (
							<button
								className={`group w-full py-3 border text-lg border-gray-400 leading-5 text-slate-500 ${
									buttonsState.playerSurrender
										? "text-gray-300"
										: "hover:bg-yellow-50"
								}`}
								onClick={() => handleButtonClick("playerSurrender")}
								disabled={buttonsState.playerSurrender}
							>
								<FontAwesomeIcon icon={faFlag} />
								<br />
								<span
									className={`text-sm font-semibold ${
										buttonsState.playerSurrender
											? "text-gray-400"
											: "text-gray-700"
									}`}
								>
									Surrender
								</span>
							</button>
						)}
						<button
							className="w-full py-3 border text-lg  border-gray-400 leading-5 hover:bg-yellow-50"
							onClick={() => handleButtonClick("leaveGame")}
							disabled={buttonsState.leaveGame}
						>
							<FontAwesomeIcon
								className="text-red-600"
								icon={faCircleXmark}
							/>
							<br />
							<span
								className={`text-sm font-semibold ${
									buttonsState.leaveGame
										? "text-gray-400"
										: "text-gray-700"
								}`}
							>
								Leave
							</span>
						</button>

						<div className="w-full">
							<div className="text-center text-xs border border-b border-gray-500 bg-amber-500 font-bold text-white py-0.5">
								Emotes
							</div>
							<div className="flex flex-wrap">
								{buttonEmotes.map((emote, i) => (
									<button
										key={i}
										className={`group w-1/2 aspect-square text-gray-600 border border-l-0 border-t-0 border-gray-500 ${
											emoteDisabled
												? "text-gray-300"
												: "hover:bg-yellow-50 active:bg-gray-300"
										}`}
										onClick={() => handleSendEmote(i)}
										disabled={emoteDisabled}
									>
										<FontAwesomeIcon
											icon={emote}
											className={`text-xl ${
												!emoteDisabled && "group-active:text-lg"
											}`}
										/>
										{/* {emote} */}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
			<button
				className="text-white bg-amber-500 absolute bottom-0 rounded-t-lg right-0 w-20 py-1 lg:py-3"
				onClick={handleGameMenuClick}
			>
				<FontAwesomeIcon
					icon={gameMenuShown ? faXmark : faGear}
					className="text-base lg:text-2xl"
				/>
			</button>

			{/* prompt */}
			{showMessage && (
				<GamePrompt
					message={message}
					onClose={() => setShowMessage(false)}
					onConfirm={handleConfimation}
				/>
			)}
		</>
	);
};

export default GameInterface;
