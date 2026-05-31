// import {
// 	Navigate,
// 	Route,
// 	BrowserRouter as Router,
// 	Routes,
// } from "react-router-dom";
// import Home from "./pages/Home";
// import { HelmetProvider } from "react-helmet-async";
// import Discovery from "./pages/Discovery";
// import Community from "./pages/Community";
// import BusinessProfile from "./pages/BusinessProfile";
// import Profile from "./pages/Profile";
// import Orders from "./pages/Orders";
// import Admin from "./pages/Admin";
// import Auth from "./pages/Auth";
// import Layout from "./components/layout/Layout";
// import { useEffect, useState } from "react";
// import LoadingSpinner from "./components/common/LoadingSpinner";
// import { CartProvider } from "./lib/context/CartContext";
// import Checkout from "./pages/Checkout";
// import BusinessDashboard from "./pages/BusinessDashboard";
// import { AuthProvider } from "./lib/context/AuthContext";
// import { db } from "./lib/firebase.config";
// import {
// 	collection,
// 	query,
// 	where,
// 	getDocs,
// 	orderBy,
// 	limit,
// } from "firebase/firestore";
// import { useAuth } from "./lib/context/AuthContext";
// import { DataProvider } from "./lib/context/DataContext";

// function DashboardRedirect() {
// 	const { user, loading } = useAuth();
// 	const [redirect, setRedirect] = useState(null);

// 	useEffect(() => {
// 		if (loading) return;
// 		if (!user) {
// 			setRedirect("/auth");
// 			return;
// 		}

// 		const fetchUserBusiness = async () => {
// 			try {
// 				const businessesQuery = query(
// 					collection(db, "businesses"),
// 					where("owner_id", "==", user.uid),
// 					orderBy("created_at", "asc"),
// 					limit(1),
// 				);
// 				const businessesSnapshot = await getDocs(businessesQuery);

// 				if (!businessesSnapshot.empty) {
// 					const firstBusiness = businessesSnapshot.docs[0];
// 					setRedirect(`/dashboard/${firstBusiness.id}`);
// 				} else {
// 					setRedirect("/dashboard/new");
// 				}
// 			} catch (error) {
// 				console.error("Error fetching user businesses:", error);
// 				setRedirect("/dashboard/new");
// 			}
// 		};

// 		fetchUserBusiness();
// 	}, [user, loading]);

// 	if (!redirect) {
// 		return (
// 			<div className="flex justify-center items-center min-h-screen">
// 				<LoadingSpinner size="lg" />
// 			</div>
// 		);
// 	}
// 	return <Navigate to={redirect} replace />;
// }

// const App = () => {
// 	const AuthenticatedApp = () => {
// 		return (
// 			<Routes>
// 				<Route path="/" element={<Layout />}>
// 					<Route path="/admin" element={<Admin />} />
// 					<Route path="/auth" element={<Auth />} />
// 					<Route index element={<Home />} />
// 					<Route path="/discover" element={<Discovery />} />
// 					<Route path="/community" element={<Community />} />
// 					<Route
// 						path="/business/:slug"
// 						element={<BusinessProfile />}
// 					/>
// 					<Route path="/profile" element={<Profile />} />
// 					<Route path="/orders" element={<Orders />} />
// 					<Route path="/dashboard" element={<DashboardRedirect />} />
// 					<Route
// 						path="/dashboard/:businessId"
// 						element={<BusinessDashboard />}
// 					/>
// 					<Route
// 						path="/checkout/:businessId"
// 						element={<Checkout />}
// 					/>
// 				</Route>
// 			</Routes>
// 		);
// 	};

// 	return (
// 		<DataProvider>
// 			<AuthProvider>
// 				<CartProvider>
// 					<HelmetProvider>
// 						<Router>
// 							<AuthenticatedApp />
// 						</Router>
// 					</HelmetProvider>
// 				</CartProvider>
// 			</AuthProvider>
// 		</DataProvider>
// 	);
// };

// export default App;

import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import { HelmetProvider } from "react-helmet-async";
// import Orders from "./pages/Orders";
import Layout from "./components/layout/Layout";
import { useEffect, useState } from "react";
import LoadingSpinner from "./components/common/LoadingSpinner";
// import { CartProvider } from "./lib/context/CartContext";
// import Checkout from "./pages/Checkout";
import { AuthProvider } from "./lib/context/AuthContext";
import { useAuth } from "./lib/context/AuthContext";
import { DataProvider } from "./lib/context/DataContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { businessAPI } from "./lib/api";
import Discovery from "./pages/Discovery";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessProfile from "./pages/BusinessProfile";
import { CommonProvider } from "./lib/context/CommonContext";

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
					{/* <Route path="/orders" element={<Orders />} /> */}
					<Route path="/dashboard" element={<DashboardRedirect />} />
					<Route
						path="/dashboard/:businessId"
						element={<BusinessDashboard />}
					/>
					{/* <Route
						path="/checkout/:businessId"
						element={<Checkout />}
					/> */}
				</Route>
			</Routes>
		);
	};

	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<AuthProvider>
				<DataProvider>
					<CommonProvider>
						{/* <CartProvider> */}
						<HelmetProvider>
							<Router>
								<AuthenticatedApp />
							</Router>
						</HelmetProvider>
					</CommonProvider>
				</DataProvider>
			</AuthProvider>
		</GoogleOAuthProvider>
	);
};

export default App;
