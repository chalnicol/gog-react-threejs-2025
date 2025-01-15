import { useRef, useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Menu from "./components/Menu";

export default function App() {
	const [showSplashScreen, setShowSplashScreen] = useState(true);
	const [showMenu, setShowMenu] = useState(false);

	const splashTimerRef = useRef(null);

	useEffect(() => {
		splashTimerRef.current = setTimeout(() => {
			setShowSplashScreen(false);
			setShowMenu(true);
		}, 3000);
		return () => clearTimeout(splashTimerRef.current);
	}, []);

	return (
		<div className="h-screen w-screen bg-gray-50">
			{showSplashScreen && <SplashScreen />}
			{showMenu && <Menu />}
		</div>
	);
}
