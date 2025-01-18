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
			<div className="w-11/12 max-w-xl border-2 border-gray-400 text-center py-6 rounded-lg shadow-xl bg-white">
				<div className="w-10/12 mx-auto">
					<h1 className="text-2xl font-bold">
						Game of the Generals (Salpakan)
					</h1>
					<p className="text-sm my-3 text-gray-600 font-medium">
						Built using ReactJS + ThreeJS + NodeJS + Tailwind CSS |
						Version 0.0.1
					</p>
					{/* <p className="text-sm my-3">Version 0.0.1</p> */}

					<form onSubmit={handleFormSubmit} className="mt-6">
						<div className="flex flex-col md:flex-row gap-2 mt-1">
							<input
								type="text"
								className="px-3 py-2 border border-gray-500 rounded flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
								placeholder="enter username here.."
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
