import React from "react";
import { Outlet } from "react-router-dom";
import data from "../lib/data";

const Layout = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* header */}
			<main className="pb-20 md:pb-8">
				<Outlet />
			</main>
			{/* bottomnav */}
			{/* cartdrawer */}
		</div>
	);
};

export default Layout;
