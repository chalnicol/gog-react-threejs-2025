import React, { createContext, useState, useContext } from "react";

// Create Context
const GameContext = createContext();

// Create a custom hook to use the context
export const useGameContext = () => useContext(GameContext);

// Create a provider component
export const GameProvider = ({ children }) => {
	const [players, setPlayers] = useState([]);
	const [maxTime, setMaxTime] = useState(0);
	const [timeRemaining, setTimeRemaining] = useState(0);
	const [turn, setTurn] = useState(0);

	// const increaseScore = () => setScore(score + 1);
	const handleLeaveButtonClick = () => {
		console.log("Leave game");
	};

	return (
		<GameContext.Provider
			value={{ score, maxTime, timeRemaining, turn, handleLeaveButtonClick }}
		>
			{children}
		</GameContext.Provider>
	);
};
