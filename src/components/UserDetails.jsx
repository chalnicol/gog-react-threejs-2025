import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const UserDetails = ({ details, onUserEditClick }) => {
	return (
		<div className="w-full flex items-center gap-x-0.5 p-2 bg-white border-b border-gray-400">
			<img
				src="/images/user_icon.jpg"
				alt=""
				className="aspect-square w-12 h-auto  bg-white"
			/>
			<div className="flex-1">
				<div className="flex items-center">
					<h2 className="text-sm font-medium text-orange-600 flex-1">
						{details?.username}
					</h2>
					<button
						className="text-orange-500 hover:text-orange-400 text-sm"
						onClick={onUserEditClick}
					>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
				</div>
				<p className="text-xs text-gray-500 font-medium">ID : {details?.id}</p>
			</div>
		</div>
	);
};

export default UserDetails;
