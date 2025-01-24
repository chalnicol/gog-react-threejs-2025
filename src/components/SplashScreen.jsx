import React, { useState } from "react";

const SplashScreen = ({ onSubmit }) => {
	const [username, setUsername] = useState(
		"Player" + Math.floor(Math.random() * 999999)
	);

	const [error, setError] = useState(null);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		if (username.length < 6) {
			setError("Username must be at least 6 characters long.");
			return;
		}
		onSubmit(username);
	};

	return (
		<div className="h-full w-full bg-gray-300 flex items-center justify-center">
			<div className="w-11/12 max-w-xl border-2 border-gray-400 rounded-lg shadow-xl bg-gray-100 overflow-hidden">
				<div className="w-10/12 mx-auto pt-6 pb-8">
					<h1 className="text-2xl font-bold text-center">
						Game of the Generals (Salpakan)
					</h1>

					{/* <p className="text-sm my-1 font-semibold  text-center">
						Version 0.0.1
					</p> */}
					<p className="text-xs text-center text-gray-700 py-1 mt-1 font-semibold">
						Powered by ReactJS, ThreeJS, NodeJS, Tailwind CSS and SocketIO
					</p>
					<hr className="my-3 border-gray-400 shadow" />
					<form onSubmit={handleFormSubmit} className="mt-1 px-1">
						<span className="text-sm font-semibold">Enter Username</span>
						<div className="flex flex-col md:flex-row gap-2 mt-1">
							<input
								type="text"
								className="px-3 py-2 border border-gray-500 text-black rounded flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
								// placeholder="enter username here.."
								value={username}
								name="username"
								onChange={(e) => setUsername(e.target.value)}
								maxLength={15}
								autoComplete="off"
							/>
							<button className="w-full md:w-36 bg-blue-500 py-2 hover:bg-blue-600 text-white w-24 font-semibold rounded">
								Enter
							</button>
						</div>
						{error && (
							<p className="text-left text-xs text-red-500 mt-2 ps-1">
								{error}
							</p>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default SplashScreen;
