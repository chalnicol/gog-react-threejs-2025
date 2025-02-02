import React, { useState, useMemo, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
	faFaceTired,
	faFaceAngry,
	faFaceSmile,
	faFaceGrinTongue,
	faFaceSurprise,
	faFaceLaughBeam,
} from "@fortawesome/free-regular-svg-icons"; // Regular
import gsap from "gsap";

const PlayerIndicator = ({
	isReady,
	index,
	isTurn,
	phase,
	username,
	clock,
	emote,
	playAgain,
}) => {
	const [emoteIndex, setEmoteIndex] = useState(0);
	const [showEmote, setShowEmote] = useState(false);

	const timerRef = useRef(null);
	const emoteRef = useRef(null);

	const showClock = useMemo(() => {
		//..
		// console.log(clock, phase, isReady, index, "asdf");

		if (phase == "prep" && !isReady && index == 0 && clock > 0) {
			return true;
		}
		if (phase == "main" && isTurn && clock != null && clock > 0) {
			return true;
		}
		return false;
	}, [phase, index, isReady, isTurn, clock]);

	const openAnimation = () => {
		gsap.fromTo(
			emoteRef.current,
			{ scale: 0 },
			{
				scale: 1,
				ease: "elastic.out(1, 0.6)",
				transformOrigin: "50% 0%",
				duration: 0.7,
			}
		);
	};
	const closeAnimation = () => {
		gsap.to(emoteRef.current, {
			scale: 0,
			ease: "elastic.in(1, 0.6)",
			duration: 0.6,
			onComplete: () => {
				setShowEmote(false);
			},
		});
	};
	useEffect(() => {
		if (emote != null) {
			setEmoteIndex(emote.index);
			if (emote.playerIndex == index) {
				setShowEmote(true);
			}
			// console.log(emote);
		}
	}, [emote]);

	useEffect(() => {
		if (showEmote) {
			openAnimation();
			clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => closeAnimation(), 3000);
		}
		return () => {
			// clearTimeout(timerRef.current);
		};
	}, [showEmote]);

	const emotes = [
		faFaceTired,
		faFaceAngry,
		faFaceSmile,
		faFaceGrinTongue,
		faFaceSurprise,
		faFaceLaughBeam,
	];

	return (
		<div
			className={`w-full relative h-12 sm:h-3/4 md:w-1/3 bg-white min-w-56 rounded-lg border-2 border-gray-500 flex items-center px-3 shadow-inner flex items-center`}
		>
			<span>{username}</span>

			<div className="flex ms-auto gap-x-1">
				{showClock && (
					<div
						className={`text-[0.7rem] font-bold rounded px-1.5 py-0.5 leading-snug  text-white flex justify-center items-center ${
							clock < 5 ? "bg-red-500" : "bg-gray-500"
						}`}
					>
						{clock}s
					</div>
				)}
				{phase == "prep" && isReady && (
					<div className="text-[0.65rem] font-semibold rounded px-1.5 py-0.5 leading-snug bg-amber-500 text-white flex justify-center items-center">
						READY
					</div>
				)}
				{phase == "main" && isTurn && (
					<div className="text-[0.65rem] font-semibold rounded px-1.5 py-0.5 leading-snug bg-green-500 text-white flex justify-center items-center">
						TURN
					</div>
				)}
				{phase == "end" && playAgain && (
					<div className="text-[0.65rem] font-semibold rounded px-1.5 py-0.5 leading-snug bg-sky-700 text-white flex justify-center items-center">
						PLAY AGAIN
					</div>
				)}
			</div>

			{showEmote && (
				<div
					ref={emoteRef}
					className={`absolute w-14 rounded aspect-square z-50 top-full flex flex-col ${
						index == 0 ? "left-0" : "right-0"
					}`}
				>
					<div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[10px] ms-2 border-transparent border-b-gray-300"></div>
					<div className="flex items-center justify-center bg-gray-200 flex-1 rounded  border-2 border-gray-300 shadow">
						<FontAwesomeIcon icon={emotes[emoteIndex]} size="2xl" />
					</div>
				</div>
			)}
		</div>
	);
};

export default PlayerIndicator;
