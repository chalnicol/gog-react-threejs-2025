import React, { useEffect, useState, useRef, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";

const GamePrompt = ({ message, onClose, onConfirm }) => {
	const promptRef = useRef(null);
	const animRef = useRef(null);
	const timerRef = useRef(false);

	const openAnimation = () => {
		// console.log("open animation..");
		animRef.current = gsap.fromTo(
			promptRef.current,
			{ scale: 0 },
			{ scale: 1, ease: "elastic.out(1, 0.6)", duration: 0.8 }
		);
	};

	const closeAnimation = () => {
		animRef.current = gsap.fromTo(
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
		if (message) {
			if (animRef.current) {
				animRef.current.kill();
			}
			clearTimeout(timerRef.current);

			openAnimation();

			if (!message.toConfirm) {
				timerRef.current = setTimeout(() => closeAnimation(), 5000);
			}
		}
		return () => clearTimeout(timerRef.current);
	}, [message]);

	const withButtons = useMemo(() => {
		// return message?.toConfirm;
		return message?.toConfirm;
	}, [message]);

	return (
		<>
			<div
				ref={promptRef}
				className="scale-0 absolute flex w-11/12 max-w-xl left-[50%] translate-x-[-50%] bg-[#ffff0066] border-2 border-yellow-300 text-white top-36 sm:top-16 px-5 py-4 min-h-20 rounded-lg"
			>
				<div className="me-3 leading-snug">
					<span className="font-semibold leading-5">{message?.text}</span>

					{withButtons && (
						<div className="w-full space-x-2 mt-3">
							<button
								className="py-1 w-20 border border-yellow-300 text-yellow-300 rounded font-semibold hover:border-white hover:text-white"
								onClick={() => onConfirm("yes")}
							>
								Yes
							</button>
							<button
								className="py-1 w-20 border border-yellow-300 text-yellow-300 rounded font-semibold hover:border-white hover:text-white"
								onClick={() => onConfirm("no")}
							>
								No
							</button>
						</div>
					)}
				</div>
				<button
					className="absolute top-4 right-3 text-sm hover:text-yellow-600 font-semibold px-1"
					onClick={handleClose}
				>
					<FontAwesomeIcon icon={faXmark} className="text-lg" />
				</button>
			</div>
		</>
	);
};

export default GamePrompt;
