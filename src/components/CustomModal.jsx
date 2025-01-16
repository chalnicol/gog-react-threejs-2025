import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

const CustomModal = ({ size = "md", children, onCloseModal }) => {
	const modalWindowRef = useRef(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const modalSizeClass = useMemo(() => {
		switch (size) {
			case "xs":
				return "max-w-xl";
			case "sm":
				return "max-w-2xl";
			case "md":
				return "max-w-3xl";
			case "lg":
				return "max-w-4xl";
			case "xl":
				return "max-w-5xl";
			case "2xl":
				return "max-w-6xl";
			case "3xl":
				return "max-w-7xl";
			default:
				return "max-w-3xl";
		}
	}, [size]);

	useEffect(() => {
		openModal();
	}, []);

	const openModal = () => {
		setIsModalOpen(true);
		gsap.fromTo(
			modalWindowRef.current,
			{ scale: 0 },
			{ scale: 1, duration: 0.6, ease: "elastic.out(1, 0.6)" }
		);
	};
	const closeModal = () => {
		gsap.fromTo(
			modalWindowRef.current,
			{ scale: 1 },
			{
				scale: 0,
				duration: 0.6,
				ease: "elastic.in(1, 0.6)",
				onComplete: () => {
					setIsModalOpen(false);
					onCloseModal();
				},
			}
		);
	};
	return (
		<div className="absolute top-0 left-0 h-full w-full">
			<div className="absolute h-full w-full bg-gray-600 opacity-80"></div>
			<div className="absolute h-full w-full flex items-center justify-center">
				<div
					ref={modalWindowRef}
					className={`bg-white p-3 w-[90%] rounded shadow-lg relative ${modalSizeClass}`}
				>
					{children}
					<button
						className="absolute -top-3 -right-3 bg-white hover:bg-gray-200 text-black border border-gray-600 font-bold text-xl rounded-full h-6 w-6 leading-[1rem]"
						onClick={closeModal}
					>
						&times;
					</button>
				</div>
			</div>
		</div>
	);
};

export default CustomModal;
