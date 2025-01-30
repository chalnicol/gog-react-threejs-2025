import React, { memo, useEffect, useRef, useState } from "react";
import ThreeJSGame from "../game/ThreeJSGame";

const Game = React.memo(({ gameUpdates, onGameAction }) => {
	const containerRef = useRef(null);
	const gameRef = useRef(null);
	const gameInitedRef = useRef(false);

	useEffect(() => {
		if (!gameInitedRef.current) {
			gameInitedRef.current = true;

			// Create a new game instance.
			const threeJSGame = new ThreeJSGame(containerRef.current.id);
			threeJSGame.init(gameUpdates.fieldColor, gameUpdates.playerPieces);
			threeJSGame.on("sendAction", (data) => {
				onGameAction(data);
			});
			gameRef.current = threeJSGame;
		}
		return () => {
			if (gameRef.current) {
				gameRef.current.cleanup();
				gameRef.current = null;
			}
			console.log("unmounted..");
		};
	}, []);
	useEffect(() => {
		if (gameUpdates) {
			// console.log("this is good..", gameUpdates.event);
			if (gameUpdates.event === "startPrep") {
				gameRef.current.setPlayerPiecesEnabled();
			}
			if (gameUpdates.event === "endPrep") {
				gameRef.current.endPrep(gameUpdates.oppoPieces);
			}
			if (gameUpdates.event === "startGame") {
				gameRef.current.setPhase("main");
				gameRef.current.setPlayerPiecesEnabled(gameUpdates.isTurn);
			}
			if (gameUpdates.event === "sendPlayerMove") {
				//
				gameRef.current.movePieceUpdate(gameUpdates.move);
			}
			if (gameUpdates.event === "switchTurn") {
				//
				gameRef.current.setPlayerPiecesEnabled(gameUpdates.isTurn);
			}
			if (gameUpdates.event === "endGame") {
				//
				gameRef.current.showOpponentRanks(gameUpdates.oppoPiecesRanks);
				gameRef.current.setPlayerPiecesEnabled(false);
			}
		}
	}, [gameUpdates]);

	return (
		<div
			ref={containerRef}
			className="bg-black h-full w-full"
			id="canvas-container"
		></div>
	);
});

export default Game;
