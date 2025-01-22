import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { div } from "three/tsl";

const GameHeader = ({ players, clock, turn, onLeave }) => {
	return (
		<div className="absolute bg-gray-600 h-14 w-full top-0">
			<div className="flex items-center h-full">
				{players && players.length > 0 && (
					<div className="flex justify-center items-center gap-x-2 px-4 absolute h-full w-full  font-semibold">
						<div
							className={`rounded border-2 border-gray-500 min-w-44 w-1/4 flex items-center px-3 shadow-inner h-2/3 flex items-center ${
								turn === 0 ? "bg-green-300" : "bg-white"
							}`}
						>
							<span> {players[0].username}</span>
							{clock !== null && turn === 0 && (
								<div className="ms-auto w-6 text-sm aspect-square rounded-full bg-amber-500 flex items-center justify-center">
									{clock}
								</div>
							)}
						</div>
						<div className="font-bold text-white h-2/3 aspect-square border border-red-500 bg-red-600 flex items-center justify-center rounded-full">
							VS
						</div>
						<div
							className={`rounded border-2 border-gray-500 min-w-44 w-1/4 flex items-center px-3 shadow-inner h-2/3 flex items-center ${
								turn === 1 ? "bg-green-300" : "bg-white"
							}`}
						>
							<span> {players[1].username}</span>
							{clock !== null && turn === 1 && (
								<div className="ms-auto w-6 text-sm aspect-square rounded-full bg-amber-500 flex items-center justify-center">
									{clock}
								</div>
							)}
						</div>
					</div>
				)}

				<button
					className="text-white bg-orange-600 hover:bg-orange-500 font-bold w-6 text-xs aspect-square rounded-full absolute left-2"
					onClick={onLeave}
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</button>
			</div>
		</div>
	);
};

export default GameHeader;
