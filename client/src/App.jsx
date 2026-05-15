/**
|--------------------------------------------------

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import DiscoveryPage from './pages/DiscoveryPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import AuthPage from './pages/AuthPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import LoadingSpinner from './components/common/LoadingSpinner';

function DashboardRedirect() {
  const { user, loading } = useAuth();
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { setRedirect('/auth'); return; }
    supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setRedirect(data ? `/dashboard/${data.id}` : '/dashboard/new');
      });
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/discover" element={<Layout><DiscoveryPage /></Layout>} />
            <Route path="/business/:slug" element={<Layout><BusinessProfilePage /></Layout>} />
            <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
            <Route path="/checkout/:businessId" element={<Layout><CheckoutPage /></Layout>} />
            <Route path="/community" element={<Layout><CommunityPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/dashboard/:businessId" element={<Layout><BusinessDashboardPage /></Layout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


|--------------------------------------------------
*/

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
import { DataProvider } from "./lib/context/DataContext";

function DashboardRedirect() {
	// const { user, loading } = useAuth();
	const [redirect, setRedirect] = useState(null); // (useState < string) | (null > null)

	const user = data.dummyUserProfile; // dummy variable
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
		setRedirect(
			data.dummyUserProfile
				? `/dashboard/${data.dummyUserProfile.id}`
				: "/dashboard/new",
		); // dummy set action
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
					<Route path="/admin" element={<Admin />} />
					<Route path="/auth" element={<Auth />} />
				</Route>
			</Routes>
		);
	};

	return (
		<DataProvider>
			<HelmetProvider>
				<Router>
					<AuthenticatedApp />
				</Router>
			</HelmetProvider>
		</DataProvider>
	);
};

export default App;
