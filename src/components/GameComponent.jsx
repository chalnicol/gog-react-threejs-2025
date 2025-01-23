import React, { useEffect, useState, useRef } from "react";
import ThreeJSGame from "../game/ThreeJSGame";
import gsap from "gsap";
import GameInterface from "./GameInterface";

const GameComponent = ({ gameUpdates, onGameAction }) => {
	//
	const [players, setPlayers] = useState([]);
	const [clock, setClock] = useState(null);
	const [turn, setTurn] = useState(null);
	const [phase, setPhase] = useState("");
	const [message, setMessage] = useState("");

	const gameRef = useRef(null);
	const containerRef = useRef(null);
	const gameInitedRef = useRef(false);

	const initThreeJSGame = (clr) => {
		if (containerRef.current) {
			const threeJSGame = new ThreeJSGame(
				containerRef.current.id,
				onGameAction
			);
			threeJSGame.init();
			threeJSGame.createPieces(clr);
			gameRef.current = threeJSGame;
		}
	};

	useEffect(() => {
		if (gameUpdates) {
			switch (gameUpdates.event) {
				case "initGame":
					if (!gameInitedRef.current) {
						//animate game container..

						const players = gameUpdates.players;
						setPlayers(players);

						gsap.from(containerRef.current, {
							yPercent: -100,
							duration: 0.5,
							ease: "power4.out",
							onComplete: () => initThreeJSGame(players[0].pieceColor),
						});

						//..
						gameInitedRef.current = true;
						console.log("initializing game", players[0].pieceColor);
					}
					break;
				case "startPrep":
					setTurn(gameUpdates.turn);
					setClock(gameUpdates.clock);
					setPhase("prep");
					setMessage(
						"Prepare your ranks. Click on a piece to move it or swap its position by clicking on another piece. Hit 'Ready' when finished."
					);
					console.log("starting prep..", gameUpdates.clock);
					break;
				case "clockTick":
					setClock(gameUpdates.clock);
					// console.log("clock tick..", gameUpdates.clock);
					break;
				case "switchTurn":
					setTurn(gameUpdates.turn);
					setClock(gameUpdates.clock);
					console.log("switching turn..", gameUpdates.turn);
					break;
				case "playerLeave":
					setMessage(`${gameUpdates.username} has left the game.`);
					console.log("player leave", gameUpdates.username);
					break;
				case "endPrep":
					setMessage("Game commencing.. Ready to play!");
					setPhase("");
					setPlayers(gameUpdates.players);
					gameRef.current.setPiecesEnabled(false);
					break;
				case "playerReady":
					setPlayers(gameUpdates.players);
					break;
				case "startGame":
					setPhase("main");
					setTurn(0);
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

			<GameInterface
				players={players}
				turn={turn}
				clock={clock}
				message={message}
				phase={phase}
				onGameAction={onGameAction}
			/>
		</div>
	);
};

export default GameComponent;
