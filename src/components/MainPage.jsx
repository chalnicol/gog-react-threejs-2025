import React, { useEffect, useRef, useState } from "react";
import CreateGame from "./CreateGame";
import SelectGame from "./SelectGame";
import About from "./About";
import NavBar from "./NavBar";
import CustomModal from "./CustomModal";

import UserDetails from "./UserDetails";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLock,
	faLockOpen,
	faXmark,
	faCheck,
} from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";

const MainPage = () => {
	const [userData, setUserData] = useState({
		username: "chalnicol_0930",
		id: "1001306",
		pic: null,
	});

	const [username, setUsername] = useState("chalnicol_0930");

	const [panelSelected, setPanelSelected] = useState("main");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const sidebarRef = useRef(null);
	useEffect(() => {
		const handleResize = () => {
			// Hide sidebar if resizing to smaller screens
			if (window.innerWidth >= 1024) {
				setIsSidebarOpen(false);
			}
		};
		window.addEventListener("resize", handleResize);

		// Cleanup event listener
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const menuItems = [
		{ id: 1, name: "main", label: "Welcome Page" },
		{ id: 2, name: "allGames", label: "View All Games" },
		{ id: 3, name: "playersOnline", label: "View Online Players" },
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
			credits: "1200",
			name: "user001",
			status: "idle",
		},
		{
			id: 2,
			credits: "1200",
			name: "user002",
			status: "playing",
		},
		{
			id: 3,
			credits: "1200",
			name: "user003",
			status: "idle",
		},
		{
			id: 4,
			credits: "1200",
			name: "user004",
			status: "playing",
		},
		{
			id: 5,
			credits: "1200",
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

	const burgerClicked = () => {
		console.log("burger clicked");
		setIsSidebarOpen((currValue) => !currValue);
	};

	const handleMenuItemClick = (name) => {
		setPanelSelected(name);
		setIsSidebarOpen(false);
	};

	const handleUserEditClick = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setUserData({ ...userData, username: username });
		setShowModal(false);
	};

	return (
		<>
			<div className="fixed top-0 left-0 h-screen w-screen overflow-hidden relative">
				<NavBar onBurgerClick={burgerClicked} />
				<div className="h-[calc(100vh-3rem)] lg:flex relative">
					{/* sidebar */}
					<div
						ref={sidebarRef}
						// className="absolute -translate-x-full lg:translate-x-0 lg:relative min-w-[13rem] bg-gray-200 border-r border-gray-400 overflow-hidden h-full"
						className={`absolute top-0 left-0 h-full w-52 -translate-x-full bg-gray-200 border-r border-gray-400 overflow-hidden h-full transition-transform duration-300 lg:translate-x-0 lg:relative ${
							isSidebarOpen ? "translate-x-0" : "-translate-x-full"
						}`}
					>
						{/* user details */}
						<UserDetails details={userData} onUserEditClick={handleUserEditClick} />

						{/* menu */}
						<div>
							<h2 className="p-2 font-semibold">Menu</h2>
							<hr className="border-0 border-b border-gray-400" />
							<div className="text-gray-800">
								{menuItems.map((item) => (
									<div
										key={item.id}
										className={`text-sm p-2  ${
											panelSelected == item.name
												? "bg-gray-700 text-white"
												: "cursor-pointer hover:bg-gray-400 hover:text-white"
										} `}
										onClick={() => handleMenuItemClick(item.name)}
									>
										{item.label}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* main */}
					<div className="flex-1 h-full overflow-auto bg-white">
						{panelSelected === "main" && (
							<div className="w-[95%] max-w-4xl  mx-auto">
								<SelectGame onSelectGame={gameSelected} />

								<CreateGame onCreateGame={gameCreated} />
							</div>
						)}
						{panelSelected === "allGames" && (
							<div className="w-11/12 max-w-4xl bg-white shadow-lg p-4 mt-6 rounded mx-auto border border-gray-300">
								<h1 className="font-semibold text-lg">View Games</h1>
								<div className="mt-2 overflow-x-auto">
									<table className="w-full whitespace-nowrap min-w-[620px]">
										<thead className="bg-gray-700 text-white font-semibold text-sm">
											<tr>
												<th className="text-left p-2">Game ID</th>
												<th className="text-left p-2">Created By</th>
												<th className="text-left p-2">Type</th>
												<th className="text-left p-2">Status</th>

												<th className="text-left p-2">With Password</th>

												<th className="text-left p-2">Actions</th>
											</tr>
										</thead>
										<tbody>
											{games.map((game) => (
												<tr key={game.id} className="odd:bg-gray-200 text-sm">
													<td className="p-2">{game.id}</td>
													<td className="p-2 text-gray-600 font-medium">{game.createdBy}</td>
													<td className="p-2">
														<span className="text-sm">{game.type}</span>
													</td>
													<td className="p-2 text-base">
														{game.status === "open" ? (
															<FontAwesomeIcon icon={faLock} className="text-gray-600" />
														) : (
															<FontAwesomeIcon icon={faLockOpen} className="text-green-600" />
														)}
														{/* <span className="text-xs">{game.status}</span> */}
													</td>

													<td className="p-2 text-base">
														{game.withPassword ? (
															<FontAwesomeIcon icon={faCheck} className="text-green-600" />
														) : (
															<FontAwesomeIcon icon={faXmark} className="text-red-600" />
														)}
														{/* <span className="text-xs">{game.withPassword ? "yes" : "no"}</span> */}
													</td>
													<td className="p-2">
														{game.status === "open" ? (
															<button className="text-xs py-0.5 font-medium text-white bg-blue-500 hover:bg-blue-400 w-full rounded">
																Join
															</button>
														) : (
															<button className="text-xs py-0.5 font-medium text-white bg-orange-500 hover:bg-orange-400 w-full rounded">
																Spectate
															</button>
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
							<div className="w-11/12 max-w-4xl bg-white shadow-lg p-4 rounded mt-6 mx-auto border border-gray-300">
								<h1 className="font-semibold text-lg">Online Players</h1>
								<div className="mt-2 overflow-x-auto">
									<table className="w-full whitespace-nowrap min-w-[620px]">
										<thead className="bg-gray-700 text-white font-semibold text-sm">
											<tr>
												<th className="text-left p-2">User ID</th>
												<th className="text-left p-2">Credits</th>
												<th className="text-left p-2">UserName</th>
												<th className="text-left p-2">Status</th>
												<th className="text-left p-2">Actions</th>
											</tr>
										</thead>
										<tbody>
											{onlinePlayers.map((user) => (
												<tr key={user.id} className="odd:bg-gray-200 text-sm">
													<td className="p-2">00000{user.id}</td>
													<td className="p-2">{user.credits}</td>
													<td className="p-2">{user.name}</td>
													<td className="p-2">
														{user.status == "playing" ? (
															<p className="bg-green-600 rounded-full w-20 text-white text-center text-[0.65rem] font-medium">
																PLAYING
															</p>
														) : (
															<p className="bg-gray-400 rounded-full w-20 text-white text-center text-[0.65rem] font-medium">
																IDLE
															</p>
														)}
													</td>
													<td className="p-2">
														<button className="text-xs py-0.5 w-20 text-white font-semibold bg-orange-500 hover:bg-orange-600 w-full rounded">
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

				{showModal && (
					<CustomModal size="xs" onCloseModal={handleCloseModal}>
						<p className="text-xs font-medium text-gray-600">Edit Username</p>
						<form onSubmit={handleFormSubmit}>
							<div className="flex gap-x-2 mt-1">
								<input
									type="text"
									className="px-3 py-2 border border-gray-500 rounded flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
									placeholder="enter username"
									value={username}
									name="username"
									onChange={(e) => setUsername(e.target.value)}
								/>
								<button className="bg-blue-500 py-2 hover:bg-blue-600 text-white w-24 font-semibold rounded">
									Submit
								</button>
							</div>
						</form>
					</CustomModal>
				)}
			</div>
		</>
	);
};

export default MainPage;
