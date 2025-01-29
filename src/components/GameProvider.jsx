const GameContext = createContext();

export function GameProvider({ children, gameUpdates }) {
	const [gameState, setGameState] = useState({
		players: [],
		clock: 0,
		isPlayerTurn: false,
		phase: "",
		message: "",
	});

	const contextValue = useMemo(
		() => ({
			game,
			gameState,
			containerRef,
		}),
		[game, gameState]
	);

	return (
		<GameContext.Provider value={contextValue}>
			{children}
		</GameContext.Provider>
	);
}

export const useGameContext = () => useContext(GameContext);
