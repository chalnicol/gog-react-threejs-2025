import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTriangleExclamation,
	faCircleCheck,
	faXmark,
	faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
const FlashMessage = ({ status, onClose }) => {
	const timerRef = useRef(null);

	useEffect(() => {
		if (status !== null) {
			clearTimeout(timerRef.current);
			// timerRef.current = setTimeout(() => {
			// 	onClose();
			// }, 3000);
		} else {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, [status]);
	return (
		<>
			{status?.success && (
				<div className="px-3 mt-3 py-2 bg-green-300 rounded text-green-800 shadow gap-x-2 font-medium border-2 border-green-400 flex items-center">
					<FontAwesomeIcon icon={faCircleCheck} /> {status.success}
					<button
						className="font-bold ms-auto text-xs hover:bg-green-400 px-1"
						onClick={onClose}
					>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</div>
			)}
			{status?.error && (
				<div className="text-red-800 px-3 mt-3 py-2 bg-red-300 rounded gap-x-2 font-medium border-2 border-red-400 flex items-center">
					<FontAwesomeIcon icon={faTriangleExclamation} /> {status.error}
					<button
						className="font-bold ms-auto text-xs hover:bg-red-400 px-1"
						onClick={onClose}
					>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</div>
			)}
			{status?.info && (
				<div className="text-white px-3 mt-3 py-2 bg-teal-400 rounded gap-x-2 font-medium border-2 border-teal-300 flex items-center">
					<FontAwesomeIcon icon={faCircleInfo} /> {status.info}
					<button
						className="font-bold ms-auto text-xs hover:bg-teal-300 px-1"
						onClick={onClose}
					>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</div>
			)}
		</>
	);
};

export default FlashMessage;
