import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTriangleExclamation,
	faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
const FlashMessage = ({ status }) => {
	return (
		<>
			{status?.success && (
				<div className="text-white px-3 mt-3 py-2 bg-green-500 rounded space-x-2 font-medium border-2 border-green-400">
					<FontAwesomeIcon icon={faCircleCheck} /> {status.success}
				</div>
			)}
			{status?.error && (
				<div className="text-white px-3 mt-3 py-2 bg-red-500 rounded font-medium space-x-2 border-2 border-red-400">
					<FontAwesomeIcon icon={faTriangleExclamation} /> {status.error}
				</div>
			)}
		</>
	);
};

export default FlashMessage;
