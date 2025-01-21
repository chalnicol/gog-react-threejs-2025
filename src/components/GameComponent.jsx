import React, { useEffect, useRef } from "react";
import ThreeJSGame from "../game/ThreeJSGame";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const GameComponent = ({ gameUpdates, onGameAction }) => {
	const gameRef = useRef(null);
	const containerRef = useRef(null);
	const gameInitedRef = useRef(false);

	useEffect(() => {
		console.log(gameUpdates);
	}, [gameUpdates]);

	useEffect(() => {
		let game;

		const initGame = () => {
			if (containerRef.current) {
				//game = new ThreeJSGame(containerRef.current.id, onGameAction);
				//game.init();
				//gameRef.current = game;
			}
		};
		const openAnimation = () => {
			gsap.from(containerRef.current, {
				scale: 0,
				duration: 0.6,
				ease: "power4.out",
				onComplete: () => initGame(),
			});
		};

		if (!gameInitedRef.current) {
			openAnimation();
			gameInitedRef.current = true;
		}

		// Cleanup function to dispose of Three.js objects
		return () => {
			if (game) {
				// game.dispose(); // Call the cleanup method in the ThreeJSGame class
			}
		};
	}, []);

	const handleCloseGame = () => {
		// onGameAction("closeGame");
	};

	return (
		<div className="fixed top-0 h-screen w-screen overflow-hidden z-10">
			<div
				ref={containerRef}
				className="bg-black h-full w-full"
				id="canvas-container"
			></div>
			<div className="absolute bg-gray-600 h-12 w-full top-0">
				<div className="flex items-center h-full">
					<div className="flex justify-center items-center gap-x-2 px-4 absolute h-full w-full  font-semibold">
						<div className="rounded bg-white border border-gray-500 min-w-44 w-1/4 flex items-center px-3 shadow-inner h-2/3">
							Player1
						</div>
						<div className="font-bold text-white h-2/3 aspect-square bg-red-600 border border-gray-500 flex items-center justify-center rounded-full">
							VS
						</div>
						<div className="rounded bg-white border border-gray-500 min-w-44 w-1/4 flex items-center px-3 shadow-inner h-2/3">
							Player2
						</div>
					</div>
					<button
						className="text-white bg-orange-600 hover:bg-orange-500 font-bold w-6 text-xs aspect-square rounded-full absolute left-2"
						onClick={handleCloseGame}
					>
						<FontAwesomeIcon icon={faArrowLeft} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default GameComponent;
