import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import { HelmetProvider } from "react-helmet-async";
import Discovery from "./pages/Discovery";
import Community from "./pages/Community";
import BusinessProfile from "./pages/BusinessProfile";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Layout from "./components/layout/Layout";
import { useEffect, useState } from "react";
import data from "./lib/data";
import LoadingSpinner from "./components/common/LoadingSpinner";
import BusinessDashboardPage from "./pages/BusinessDashboardPage";
import { DataProvider, useData } from "./lib/context/DataContext";
import { CartProvider } from "./lib/context/CartContext";
import Checkout from "./pages/Checkout";

function DashboardRedirect() {
	// const { user, loading } = useAuth();
	const { user } = useData();

	const [redirect, setRedirect] = useState(null); // (useState < string) | (null > null)

	const loading = false; // dummy variable

	useEffect(() => {
		if (loading) return;
		if (!user) {
			setRedirect("/auth");
			return;
		}
		// 	supabase
		// 		.from("businesses")
		// 		.select("id")
		// 		.eq("owner_id", user.id)
		// 		.order("created_at", { ascending: true })
		// 		.limit(1)
		// 		.maybeSingle()
		// 		.then(({ data }) => {
		// 			setRedirect(data ? `/dashboard/${data.id}` : "/dashboard/new");
		// 		});
		setRedirect(user ? `/dashboard/${user.id}` : "/dashboard/new"); // dummy set action
	}, [user, loading]);

	if (!redirect) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return <Navigate to={redirect} replace />;
}

const App = () => {
	const AuthenticatedApp = () => {
		return (
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/admin" element={<Admin />} />
					<Route path="/auth" element={<Auth />} />
					<Route index element={<Home />} />
					<Route path="/discover" element={<Discovery />} />
					<Route path="/community" element={<Community />} />
					<Route
						path="/business/:slug"
						element={<BusinessProfile />}
					/>
					<Route path="/profile" element={<Profile />} />
					<Route path="/orders" element={<Orders />} />
					<Route path="/dashboard" element={<DashboardRedirect />} />
					<Route
						path="/dashboard/:businessId"
						element={<BusinessDashboardPage />}
					/>
					<Route
						path="/checkout/:businessId"
						element={<Checkout />}
					/>
				</Route>
			</Routes>
		);
	};

	return (
		<DataProvider>
			<CartProvider>
				<HelmetProvider>
					<Router>
						<AuthenticatedApp />
					</Router>
				</HelmetProvider>
			</CartProvider>
		</DataProvider>
	);
};

export default App;
