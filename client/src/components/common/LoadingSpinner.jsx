import React from "react";

const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass =
		size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-6 h-6";

	return (
		<div
			className={`${sizeClass} border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin`}
		/>
	);
};

export default LoadingSpinner;
