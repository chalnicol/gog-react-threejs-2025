import React, { useState } from "react";
import CustomModal from "./CustomModal";

const InviteModal = ({ inviteData, onSubmit, onClose }) => {
	return (
		<CustomModal size="xs" onCloseModal={() => onClose()}>
			<div className="text-xs font-semibold text-gray-600">Game Invite</div>
			<div className="border border-gray-500 p-3 mt-1 bg-gray-200 rounded shadow-inner">
				<p className="font-semibold text-gray-600">
					<span className="font-bold border border-gray-400 rounded px-1 bg-gray-100 text-xs shadow text-sky-900 me-0.5">
						{inviteData?.user}
					</span>{" "}
					has challenged you to a{" "}
					<span className="font-bold border border-gray-400 rounded px-1 bg-gray-100 text-xs shadow text-sky-900 mx-0.5">
						{inviteData?.gameType}
					</span>{" "}
					game! Accept the challenge?
				</p>

				<div className="flex gap-x-2 mt-3">
					<button
						className="bg-blue-500 py-1 hover:bg-blue-600 text-white w-24 font-semibold rounded active:scale-95"
						onClick={() => onSubmit("accept")}
					>
						Accept
					</button>
					<button
						className="bg-red-500 py-1 hover:bg-red-600 text-white w-24 font-semibold rounded active:scale-95"
						onClick={() => onSubmit("decline")}
					>
						Decline
					</button>
				</div>
			</div>
		</CustomModal>
	);
};

export default InviteModal;
