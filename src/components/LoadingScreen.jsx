import React, { useState } from "react";
import CustomModal from "./CustomModal";

const LoadingScreen = ({ caption }) => {
	return (
		<CustomModal size="xs" closeButton={false}>
			<div className="flex justify-center items-center gap-x-3 p-3">
				<div className="w-6 h-6 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
				<p className="text-gray-500 font-semibold">{caption}...</p>
			</div>
		</CustomModal>
	);
};

export default LoadingScreen;
