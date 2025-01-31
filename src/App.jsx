import { lazy, Suspense, useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
// import MainPage from "./components/MainPage";

const MainPage = lazy(() => import("./components/MainPage"));
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
				<Suspense fallback={<div>Loading Main Page...</div>}>
					<MainPage playerName={username} />
				</Suspense>
			) : (
				<SplashScreen onSubmit={handleSplashScreenSubmit} />
			)}
		</div>
	);
}
