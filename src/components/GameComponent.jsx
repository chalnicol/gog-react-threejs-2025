import React, { useEffect, useState, useRef } from "react";
import ThreeJSGame from "../game/ThreeJSGame";
import gsap from "gsap";
import GameInterface from "./GameInterface";

const GameComponent = ({ gameUpdates, onGameAction }) => {
	//
	const [players, setPlayers] = useState([]);
	const [clock, setClock] = useState(null);
	const [isPlayerTurn, setIsPlayerTurn] = useState(false);
	const [phase, setPhase] = useState("");
	const [message, setMessage] = useState("");

	const gameRef = useRef(null);
	const containerRef = useRef(null);
	const gameInitedRef = useRef(false);

	useEffect(() => {
		if (gameUpdates) {
			switch (gameUpdates.event) {
				case "initGame":
					if (!gameInitedRef.current) {
						gameInitedRef.current = true;

						//animate game container..
						setPlayers(gameUpdates.players);

						//initialize three js..

						const threeJSGame = new ThreeJSGame(containerRef.current.id);
						threeJSGame.init(
							gameUpdates.fieldColor,
							gameUpdates.playerPieces
						);
						threeJSGame.on("sendAction", (data) => {
							onGameAction(data);
						});
						gameRef.current = threeJSGame;

						//..
						console.log("initializing game");
					}
					break;
				case "startPrep":
					setClock(gameUpdates.clock);
					setPhase("prep");
					setMessage(
						"Prepare your ranks. Click on a piece to move it or swap its position by clicking on another piece or tile. Hit 'Ready' when finished."
					);

					gameRef.current.setPlayerPiecesEnabled();
					// console.log("starting prep..", gameUpdates.clock);

					break;
				case "clockTick":
					setClock(gameUpdates.clock);
					// console.log("clock tick..", gameUpdates.clock);
					break;
				case "playerLeave":
					setMessage(`${gameUpdates.username} has left the game.`);
					console.log("player leave", gameUpdates.username);
					break;
				case "endPrep":
					const { players, oppoPieces } = gameUpdates;

					setMessage("Game commencing.. Ready to play!");
					setPlayers(players);
					gameRef.current.endPrep(oppoPieces);
					// console.log(oppoPieces);
					break;
				case "playerReady":
					setPlayers(gameUpdates.players);
					break;
				case "startGame":
					setPhase("main");
					setClock(gameUpdates.clock);
					setIsPlayerTurn(gameUpdates.isTurn);
					setMessage("Let's go!");
					//set enabled if player's turn
					gameRef.current.setPhase("main");
					gameRef.current.setPlayerPiecesEnabled(gameUpdates.isTurn);
					break;
					break;
				case "switchTurn":
					setIsPlayerTurn(gameUpdates.isTurn);
					setClock(clock);
					gameRef.current.movePieceUpdate(gameUpdates.move);
					gameRef.current.setPlayerPiecesEnabled(gameUpdates.isTurn);
					// console.log("move", gameUpdates.move);
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
				isPlayerTurn={isPlayerTurn}
				clock={clock}
				message={message}
				phase={phase}
				onGameAction={onGameAction}
			/>
		</div>
	);
};

export default GameComponent;
