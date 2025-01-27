import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";

const GamePrompt = ({ message, isAutoClose = true, onClose }) => {
	const promptRef = useRef(null);
	const animRef = useRef(false);
	const timerRef = useRef(false);

	const openAnimation = () => {
		// console.log("open animation..");
		gsap.fromTo(
			promptRef.current,
			{ scale: 0 },
			{ scale: 1, ease: "elastic.out(1, 0.6)", duration: 0.8 }
		);
	};

	const closeAnimation = () => {
		gsap.fromTo(
			promptRef.current,
			{ scale: 1 },
			{
				scale: 0,
				ease: "elastic.in(1, 0.6)",
				duration: 0.8,
				onComplete: () => {
					onClose();
				},
			}
		);
	};

	const handleClose = () => {
		clearTimeout(timerRef.current);
		closeAnimation();
	};

	useEffect(() => {
		if (message != "") {
			openAnimation();
			clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => closeAnimation(), 5000);
		}
	}, [message]);

	return (
		<>
			<div
				ref={promptRef}
				className="scale-0 absolute flex items-center w-11/12 max-w-xl left-[50%] translate-x-[-50%] bg-yellow-100 border-2 border-yellow-300 text-green-900 top-36 sm:top-16 px-4 py-2 rounded-lg"
			>
				<FontAwesomeIcon icon={faCircleInfo} />

				<span className="ms-3 font-semibold leading-5 me-5">{message}</span>
				<button
					className="ms-auto text-sm hover:text-yellow-800 hover:bg-yellow-200 font-semibold px-1"
					onClick={handleClose}
				>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</div>
		</>
	);
};

export default GamePrompt;
