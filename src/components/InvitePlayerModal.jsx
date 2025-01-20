import React, { useState } from "react";
import CustomModal from "./CustomModal";

const InvitePlayerModal = ({ onSubmit, onClose }) => {
	const [playerId, setPlayerId] = useState("");

	const handleFormSubmit = (e) => {
		e.preventDefault();
		onSubmit(playerId);
	};
	const handleCloseModal = () => {
		onClose();
	};

	return (
		<CustomModal size="xs" onCloseModal={handleCloseModal}>
			<p className="text-xs font-semibold text-gray-600 ">Invite Player</p>
			<form onSubmit={handleFormSubmit}>
				<div className="flex gap-x-2 mt-1">
					<input
						type="text"
						className="px-3 py-2 border border-gray-500 rounded flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="enter player id here"
						value={playerId}
						name="playerId"
						onChange={(e) => setPlayerId(e.target.value)}
					/>
					<button className="bg-blue-500 py-2 hover:bg-blue-600 text-white w-24 font-semibold rounded">
						Submit
					</button>
				</div>
			</form>
		</CustomModal>
	);
};

export default InvitePlayerModal;
