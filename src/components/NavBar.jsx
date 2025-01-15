import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const NavBar = ({ onBurgerClick }) => {
	return (
		<nav className="h-[3rem] bg-gray-700 text-white relative">
			<h1 className="absolute left-0 top-0 w-full h-full text-xl font-bold bg-green flex justify-center items-center">
				Game of the Generals 3D
			</h1>
			<button
				className="space-y-1 px-3 w-12 h-full absolute top-0 left-0 lg:hidden hover:bg-gray-600"
				onClick={() => onBurgerClick()}
			>
				<FontAwesomeIcon icon={faBars} className="text-white" />
			</button>
		</nav>
	);
};

export default NavBar;
