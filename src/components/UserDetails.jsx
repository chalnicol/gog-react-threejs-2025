import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const UserDetails = ({ details }) => {
	return (
		<div className="w-full flex items-center gap-x-0.5 p-2 bg-white border-b border-gray-400">
			<img
				src="/images/user_icon.jpg"
				alt=""
				className="aspect-square w-12 h-auto  bg-white"
			/>
			<div className="flex-1">
				<h2 className="text-sm font-semibold text-orange-600">
					{details?.username}
				</h2>
				<p className="text-xs mt-0.5 text-gray-500 font-medium">
					ID : {details?.id}
				</p>
			</div>
		</div>
	);
};

export default UserDetails;
