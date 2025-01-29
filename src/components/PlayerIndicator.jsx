import React, { useState, useMemo } from "react";

const PlayerIndicator = ({
	isReady,
	index,
	isTurn,
	phase,
	username,
	clock,
}) => {
	const bgText = useMemo(() => {
		if (phase === "main") {
			return isTurn
				? "bg-green-300 text-black"
				: "bg-gray-200 text-gray-600";
		}
		return "bg-white";
	}, [isTurn, phase]);
	const showClock = useMemo(() => {
		//..
		if (
			phase == "prep" &&
			!isReady &&
			index == 0 &&
			clock != null &&
			clock > 0
		) {
			return true;
		}
		if (phase == "main" && isTurn && clock != null && clock > 0) {
			return true;
		}
		return false;
	}, [phase, index, isReady, isTurn, clock]);

	return (
		<div
			className={`w-full h-12 sm:h-3/4 md:w-1/3 bg-white min-w-56 rounded-lg border-2 border-gray-500 flex items-center px-3 shadow-inner flex items-center`}
		>
			<span>{username}</span>

			<div className="flex ms-auto gap-x-1">
				{showClock && (
					<div className="text-[0.7rem] font-bold rounded px-1.5 py-0.5 leading-snug bg-gray-700 text-white flex justify-center items-center">
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
			</div>
		</div>
	);
};

export default PlayerIndicator;
