import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchUserData = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				setUser(null);
				setProfile(null);
				return;
			}

			const response = await authAPI.getMe();
			setUser(response.data);
			setProfile(response.data);
		} catch (error) {
			console.error("Error fetching user:", error);
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			setUser(null);
			setProfile(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserData();
	}, []);

	// Email/Password Sign Up
	const signUp = async (email, password, fullName, role = "user") => {
		try {
			const response = await authAPI.register({
				email,
				password,
				fullName,
				role,
			});

			const { token, ...userData } = response.data;
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(userData));

			setUser(userData);
			setProfile(userData);
			return { error: null };
		} catch (error) {
			console.error("Sign up error:", error);
			return { error: error.response?.data || error };
		}
	};

	// Email/Password Sign In
	const signIn = async (email, password) => {
		try {
			const response = await authAPI.login({ email, password });
			const { token, ...userData } = response.data;
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(userData));

			setUser(userData);
			setProfile(userData);
			return { error: null };
		} catch (error) {
			console.error("Sign in error:", error);
			return { error: error.response?.data || error };
		}
	};

	// Google Sign In
	const signInWithGoogle = async (googleUserData) => {
		try {
			const response = await authAPI.googleSignIn(googleUserData);
			const { token, ...userData } = response.data;
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(userData));

			setUser(userData);
			setProfile(userData);
			return { error: null };
		} catch (error) {
			console.error("Google Sign-In Error:", error);
			return { error: error.response?.data || error };
		}
	};

	const signOut = async () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		setProfile(null);
	};

	const refreshProfile = async () => {
		await fetchUserData();
	};

	const AuthContextFeatures = {
		user,
		profile,
		loading,
		signUp,
		signIn,
		signInWithGoogle,
		signOut,
		refreshProfile,
	};

	return (
		<AuthContext.Provider value={AuthContextFeatures}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
