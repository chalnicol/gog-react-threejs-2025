import React, { useState, useMemo } from "react";

const PlayerIndicator = ({
	className,
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
				? "bg-green-300 text-green-900"
				: "bg-gray-200 text-gray-600";
		}
		return "bg-white";
	}, [isTurn, phase]);
	const showClock = useMemo(() => {
		//..
		if (phase == "prep" && index == 0 && clock != null && clock > 0) {
			return true;
		}
		if (phase == "main" && isTurn && clock != null && clock > 0) {
			return true;
		}
		return false;
	}, [phase, index, isTurn, clock]);

	return (
		<div
			className={`${bgText} w-full h-12 sm:h-3/4 md:w-1/3 min-w-56 rounded-lg border-2 border-gray-500 flex items-center px-3 shadow-inner flex items-center`}
		>
			<span>{username}</span>
			{showClock && (
				<div className="ms-auto w-5 text-xs aspect-square rounded-full bg-gray-700 text-white flex leading-snug justify-center items-center">
					{clock}
				</div>
			)}
			{phase == "prep" && isReady && (
				<div className="ml-auto text-[0.65rem] font-semibold rounded px-1.5 py-0.5 leading-snug bg-green-500 text-white flex justify-center items-center">
					READY
				</div>
			)}
		</div>
	);
};

export default PlayerIndicator;
