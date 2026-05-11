import React from "react";
import { Outlet } from "react-router-dom";
import data from "../lib/data";

const Layout = () => {
	return (
		<div className="flex flex-col items-center h-screen">
			<div />
			<Outlet />
			<footer className="">
				<p className="text-sm">
					&copy; {new Date().getFullYear()}
					{""} Powered by{""}{" "}
					<a
						href={`${data.metadata.parentCompany.link}`}
						target="_blank"
						rel="noopener noreferrer"
						className="cursor-pointer hover:text-blue-600"
					>
						{data.metadata.parentCompany.name}
					</a>
				</p>
			</footer>
		</div>
	);
};

export default Layout;
