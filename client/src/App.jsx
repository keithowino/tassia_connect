import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/layout/Layout";
import { useEffect, useState } from "react";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { AuthProvider } from "./lib/context/AuthContext";
import { useAuth } from "./lib/context/AuthContext";
import { DataProvider } from "./lib/context/DataContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { businessAPI } from "./lib/api";
import Discovery from "./pages/Discovery";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessProfile from "./pages/BusinessProfile";
import { CommonProvider } from "./lib/context/CommonContext";
import { CartProvider } from "./lib/context/CartContext";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Overview from "./pages/admin/Overview";
import AdminLayout from "./components/admin/AdminLayout";
import AdminBusinesses from "./pages/admin/AdminBusinesses";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminCommunity from "./pages/admin/AdminCommunity";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";

function DashboardRedirect() {
	const { user, loading } = useAuth();
	const [redirect, setRedirect] = useState(null);

	useEffect(() => {
		if (loading) return;
		if (!user) {
			setRedirect("/auth");
			return;
		}

		const fetchUserBusiness = async () => {
			try {
				const response = await businessAPI.getMyBusinesses();
				const businesses = response.data;

				if (businesses.length > 0) {
					setRedirect(`/dashboard/${businesses[0]._id}`);
				} else {
					setRedirect("/dashboard/new");
				}
			} catch (error) {
				console.error("Error fetching user businesses:", error);
				setRedirect("/dashboard/new");
			}
		};

		fetchUserBusiness();
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
					<Route path="/admin" element={<AdminLayout />}>
						<Route index element={<Overview />} />
						<Route
							path="businesses"
							element={<AdminBusinesses />}
						/>
						<Route path="orders" element={<AdminOrders />} />
						<Route path="products" element={<AdminProducts />} />
						<Route path="reviews" element={<AdminReviews />} />
						<Route path="community" element={<AdminCommunity />} />
						<Route path="users" element={<AdminUsers />} />
						<Route
							path="categories"
							element={<AdminCategories />}
						/>
					</Route>
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
						element={<BusinessDashboard />}
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
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<AuthProvider>
				<DataProvider>
					<CommonProvider>
						<CartProvider>
							<HelmetProvider>
								<Router>
									<AuthenticatedApp />
								</Router>
							</HelmetProvider>
						</CartProvider>
					</CommonProvider>
				</DataProvider>
			</AuthProvider>
		</GoogleOAuthProvider>
	);
};

export default App;
