import React, { useState } from "react";
import CreateGame from "./CreateGame";
import SelectGame from "./SelectGame";
import About from "./About";

const Menu = () => {
	const [panelSelected, setPanelSelected] = useState("dashboard");

	const menuItems = [
		{ id: 1, name: "dashboard", label: "Dashboard" },
		{ id: 2, name: "allGames", label: "View All Games" },
		{ id: 3, name: "playersOnline", label: "View Online Players" },
		{ id: 4, name: "help", label: "Help" },
		{ id: 5, name: "about", label: "About" },
	];

	const games = [
		{
			id: 1,
			createdBy: "user001",
			type: "classic",
			status: "open",
			withPassword: false,
		},
		{
			id: 2,
			createdBy: "user002",
			type: "blitz",
			status: "closed",
			withPassword: true,
		},
		{
			id: 3,
			createdBy: "user003",
			type: "classic",
			status: "open",
			withPassword: false,
		},
		{
			id: 4,
			createdBy: "user004",
			type: "classic",
			status: "open",
			withPassword: false,
		},
		{
			id: 5,
			createdBy: "user005",
			type: "custom",
			status: "closed",
			withPassword: true,
		},
		{
			id: 6,
			createdBy: "user006",
			type: "blitz",
			status: "closed",
			withPassword: false,
		},
	];

	const onlinePlayers = [
		{
			id: 1,
			pairingID: "001345",
			name: "user001",
			status: "idle",
		},
		{
			id: 2,
			pairingID: "001346",
			name: "user002",
			status: "playing",
		},
		{
			id: 3,
			pairingID: "001347",
			name: "user003",
			status: "playing",
		},
		{
			id: 4,
			pairingID: "001348",
			name: "user004",
			status: "playing",
		},
		{
			id: 5,
			pairingID: "001349",
			name: "user005",
			status: "playing",
		},
	];

	const gameCreated = (data) => {
		console.log(data);
	};
	const gameSelected = (data) => {
		console.log(data);
	};
	return (
		<div className="fixed top-0 left-0 h-screen w-screen overflow-hidden">
			<nav className="h-[3rem] bg-gray-700 text-white relative">
				<h1 className="absolute left-0 top-0 w-full h-full text-xl font-bold bg-green flex justify-center items-center">
					Game of the Generals 3D
				</h1>
				<button className="space-y-1 px-2 w-10 h-full absolute top-0 left-0 lg:hidden">
					<p className="bg-white h-1 w-full"></p>
					<p className="bg-white h-1 w-full"></p>
					<p className="bg-white h-1 w-full"></p>
				</button>
			</nav>

			<div className="h-[calc(100vh-3rem)] lg:flex">
				{/* sidebar */}
				<div className="hidden lg:block min-w-52 bg-gray-200 border-r border-gray-400 overflow-hidden h-full">
					{/* user details */}
					<div className="w-full flex items-center gap-x-2 p-2 bg-white border-b border-gray-400">
						<img
							src="/images/user_icon.jpg"
							alt=""
							className="aspect-square w-10 h-auto bg-white"
						/>
						<div className="flex-1">
							<h2 className="text-sm font-medium">Charlou</h2>
							<p className="text-xs text-blue-900">Pairing ID: 101090</p>
							<button className="text-xs py-0.5 text-white bg-orange-500 hover:bg-orange-600 w-full mt-2 rounded">
								Edit Profile
							</button>
						</div>
					</div>
					{/* menu */}
					<div>
						<h2 className="p-2 font-semibold">Menu</h2>
						<hr className="border-0 border-b border-gray-400" />
						<div className="text-gray-800">
							{menuItems.map((item) => (
								<div
									key={item.id}
									className="text-sm p-2 cursor-pointer hover:bg-gray-500 hover:text-white"
									onClick={() => setPanelSelected(item.name)}
								>
									{item.label}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* main */}
				<div className="flex-1 h-full bg-white">
					{panelSelected === "dashboard" && (
						<div className="w-[95%] max-w-4xl  mx-auto">
							<SelectGame onSelectGame={gameSelected} />

							<CreateGame onCreateGame={gameCreated} />
						</div>
					)}
					{panelSelected === "allGames" && (
						<div className="w-11/12 max-w-4xl bg-white shadow-lg px-3 py-2 mt-6 mx-auto border border-gray-300">
							<h1 className="font-semibold text-lg">View Games</h1>
							<div className="mt-2">
								<table className="w-full">
									<thead className="bg-gray-500 text-white font-semibold text-sm">
										<tr>
											<th className="text-left p-1">Game ID</th>
											<th className="text-left p-1">Created By</th>
											<th className="text-left p-1">Type</th>
											<th className="text-left p-1">Password</th>
											<th className="text-left p-1">Status</th>

											<th className="text-left p-1">Actions</th>
										</tr>
									</thead>
									<tbody>
										{games.map((game) => (
											<tr key={game.id} className="odd:bg-gray-200 text-sm">
												<td className="p-2">{game.id}</td>
												<td className="p-2">{game.createdBy}</td>
												<td className="p-2">{game.type}</td>
												<td className="p-2">{game.withPassword ? "Yes" : "No"}</td>
												<td className="p-2">{game.status}</td>
												<td className="p-2">
													{game.status === "open" ? (
														<button className="text-sm text-white bg-green-500 hover:bg-green-600 w-full rounded">
															Join
														</button>
													) : (
														<p className="text-sm py-0.5 rounded">--</p>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
					{panelSelected === "playersOnline" && (
						<div className="w-11/12 max-w-4xl bg-white shadow-lg px-3 py-2 mt-6 mx-auto border border-gray-300">
							<h1 className="font-semibold text-lg">Online Players</h1>
							<div className="mt-2">
								<table className="w-full">
									<thead className="bg-gray-500 text-white font-semibold text-sm">
										<tr>
											<th className="text-left p-1">ID</th>
											<th className="text-left p-1">Pairing ID</th>
											<th className="text-left p-1">UserName</th>
											<th className="text-left p-1">Status</th>
											<th className="text-left p-1">Actions</th>
										</tr>
									</thead>
									<tbody>
										{onlinePlayers.map((user) => (
											<tr key={user.id} className="odd:bg-gray-200 text-sm">
												<td className="p-2">{user.id}</td>
												<td className="p-2">{user.pairingID}</td>
												<td className="p-2">{user.name}</td>
												<td className="p-2">{user.status}</td>
												<td className="p-2">
													<button className="text-sm text-white bg-green-500 hover:bg-green-600 w-full rounded">
														Chat
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
					{panelSelected === "about" && <About />}
				</div>
			</div>
		</div>
	);
};

export default Menu;
