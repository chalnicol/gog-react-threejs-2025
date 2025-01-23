import React, { useState } from "react";

const PlayerIndicator = ({ className, index, turn, username, clock }) => {
	return (
		<div
			className={`${className} rounded-lg border-2 border-gray-500 flex items-center px-3 shadow-inner flex items-center`}
		>
			<span>{username}</span>
			{clock !== null && clock > 0 && turn === index && (
				<div className="ms-auto w-5 text-xs aspect-square rounded-full bg-gray-700 text-white flex leading-snug justify-center items-center">
					{clock}
				</div>
			)}
		</div>
	);
};

export default PlayerIndicator;
