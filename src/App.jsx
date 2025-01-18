import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import MainPage from "./components/MainPage";

export default function App() {
	const [username, setUsername] = useState("");
	const [isMenuPageVisible, setIsMenuPageVisible] = useState(false);

	const handleSplashScreenSubmit = (name) => {
		//..
		setUsername(name);
		setIsMenuPageVisible(true);
	};
	return (
		<div className="h-screen w-screen bg-gray-50">
			{isMenuPageVisible ? (
				<MainPage playerName={username} />
			) : (
				<SplashScreen onSubmit={handleSplashScreenSubmit} />
			)}
		</div>
	);
}
