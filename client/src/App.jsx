import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Discovery from "./pages/Discovery";
import Community from "./pages/Community";
import BusinessProfile from "./pages/BusinessProfile";

const App = () => {
	const AuthenticatedApp = () => {
		return (
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="/discover" element={<Discovery />} />
					<Route path="/community" element={<Community />} />
					<Route
						path="/business/:slug"
						element={<BusinessProfile />}
					/>
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
