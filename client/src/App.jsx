import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";

const App = () => {
	const AuthenticatedApp = () => {
		return (
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
				</Route>
			</Routes>
		);
	};

	return (
		<HelmetProvider>
			<Router>
				<AuthenticatedApp />
			</Router>
		</HelmetProvider>
	);
};

export default App;
