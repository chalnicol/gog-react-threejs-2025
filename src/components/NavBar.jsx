import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const NavBar = ({ onMenuClick }) => {
	return (
		<nav className="h-[3rem] bg-gray-700 text-white relative flex">
			<button
				className="space-y-1 px-3 w-12 h-full lg:hidden hover:bg-gray-600"
				onClick={() => onMenuClick()}
			>
				<FontAwesomeIcon icon={faBars} className="text-white" />
			</button>
			<h1 className="h-full font-semibold bg-green flex items-center ms-1 lg:ms-4">
				Game of the Generals{" "}
				<span className="ms-2 rounded-full flex justify-center text-xs items-center text-gray-800 font-bold bg-white w-[20px] aspect-square leading-none">
					3D
				</span>
			</h1>
		</nav>
	);
};

export default NavBar;
