import React, { useEffect, useState, useRef } from "react";
import ThreeJSGame from "../game/ThreeJSGame";
import gsap from "gsap";
import GameHeader from "./GameHeader";

const GameComponent = ({ gameUpdates, onGameAction }) => {
	//
	const [players, setPlayers] = useState([]);
	const [clock, setClock] = useState(null);
	const [turn, setTurn] = useState(0);

	const gameRef = useRef(null);
	const containerRef = useRef(null);
	const gameInitedRef = useRef(false);

	const initThreeJSGame = () => {
		if (containerRef.current) {
			const threeJSGame = new ThreeJSGame(
				containerRef.current.id,
				onGameAction
			);
			threeJSGame.init();
			threeJSGame.createPieces(1);
			gameRef.current = threeJSGame;
		}
	};

	useEffect(() => {
		if (gameUpdates) {
			switch (gameUpdates.event) {
				case "initGame":
					if (!gameInitedRef.current) {
						//animate game container..
						gsap.from(containerRef.current, {
							scale: 0,
							duration: 0.5,
							ease: "power4.out",
							// onComplete: () => initThreeJSGame(),
						});
						setPlayers(gameUpdates.players);

						//..
						gameInitedRef.current = true;
						console.log("initializing game");
					}
					break;
				case "startPrep":
					setTurn(gameUpdates.turn);
					setClock(gameUpdates.clock);
					console.log("starting prep..", gameUpdates.clock);
					break;
				case "clockTick":
					setClock(gameUpdates.clock);
					console.log("clock tick..", gameUpdates.clock);
					break;
				case "switchTurn":
					setTurn(gameUpdates.turn);
					setClock(gameUpdates.clock);
					console.log("switching turn..", gameUpdates.turn);
					break;
				default:
				//..
			}
		}

		// Cleanup function to dispose of Three.js objects
		return () => {
			if (gameRef.current) {
				// Call the cleanup method in the ThreeJSGame class
			}
		};
	}, [gameUpdates]);

	const handleLeaveGame = () => {
		// onGameAction("closeGame");
	};

	return (
		<div className="fixed top-0 h-screen w-screen overflow-hidden z-10">
			<div
				ref={containerRef}
				className="bg-black h-full w-full"
				id="canvas-container"
			></div>

			<GameHeader
				players={players}
				turn={turn}
				clock={clock}
				onLeave={handleLeaveGame}
			/>
		</div>
	);
};

export default GameComponent;
