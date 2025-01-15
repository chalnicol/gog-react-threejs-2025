import React from "react";

const SplashScreen = () => {
	return (
		<div className="h-full w-full bg-gray-300 flex items-center justify-center">
			<div className="w-11/12 max-w-xl border border-gray-500 text-center py-6 rounded shadow-xl bg-white">
				<h1 className="text-2xl font-bold">Game of the Generals (Salpakan)</h1>
				<p className="text-sm my-2">
					Built using ReactJS + ThreeJS + NodeJS + Tailwind CSS
				</p>
				<p className="text-sm my-2">Version 0.0.1</p>
			</div>
		</div>
	);
};

export default SplashScreen;
