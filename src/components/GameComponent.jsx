import React, { useEffect, useState, useRef, useMemo } from "react";
// import ThreeJSGame from "../game/ThreeJSGame";
import gsap from "gsap";
import GameInterface from "./GameInterface";
import Game from "./Game";

const GameComponent = ({ gameUpdates, onGameAction }) => {
	//
	const [players, setPlayers] = useState([]);
	const [clock, setClock] = useState(null);
	const [turn, setTurn] = useState(-1);
	const [phase, setPhase] = useState("");
	const [message, setMessage] = useState(null);

	const gameRef = useRef(null);
	const containerRef = useRef(null);
	const gameInitedRef = useRef(false);

	useEffect(() => {
		if (gameUpdates) {
			// console.log(gameUpdates);
			if (gameUpdates.turn >= 0) {
				setTurn(gameUpdates.turn);
			}
			if (gameUpdates.phase) {
				setPhase(gameUpdates.phase);
			}
			if (gameUpdates.message) {
				setMessage(gameUpdates.message);
			}
			if (gameUpdates.players) {
				setPlayers(gameUpdates.players);
			}
			if (gameUpdates.clock >= 0) {
				setClock(gameUpdates.clock);
				console.log("c", gameUpdates.clock);
			}
		}
	}, [gameUpdates]);

	return (
		<div className="fixed top-0 h-screen w-screen overflow-hidden z-10">
			<Game gameUpdates={gameUpdates} onGameAction={onGameAction} />

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
