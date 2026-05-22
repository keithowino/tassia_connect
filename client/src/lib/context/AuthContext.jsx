import { createContext, useContext, useEffect, useState } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	signOut as firebaseSignOut,
	onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.config";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchProfile = async (userId) => {
		try {
			const userDoc = await getDoc(doc(db, "profiles", userId));
			if (userDoc.exists()) {
				setProfile({ id: userDoc.id, ...userDoc.data() });
			} else {
				// If profile doesn't exist, create one for Google Sign-in users
				setProfile(null);
			}
		} catch (error) {
			console.error("Error fetching profile:", error);
			setProfile(null);
		}
	};

	const refreshProfile = async () => {
		if (user) await fetchProfile(user.uid);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				await fetchProfile(currentUser.uid);
			} else {
				setProfile(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	// Email/Password Sign Up
	const signUp = async (email, password, fullName, role = "user") => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			const user = userCredential.user;

			// Create user profile in Firestore
			await setDoc(doc(db, "profiles", user.uid), {
				full_name: fullName,
				role: role,
				email: email,
				created_at: new Date().toISOString(),
			});

			return { error: null };
		} catch (error) {
			return { error };
		}
	};

	// Email/Password Sign In
	const signIn = async (email, password) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			return { error: null };
		} catch (error) {
			return { error };
		}
	};

	// NEW: Google Sign In
	const signInWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			provider.setCustomParameters({
				prompt: "select_account",
			});

			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			// Check if profile exists, if not create one
			const profileDoc = await getDoc(doc(db, "profiles", user.uid));

			if (!profileDoc.exists()) {
				// Create profile for Google Sign-in user
				await setDoc(doc(db, "profiles", user.uid), {
					full_name: user.displayName || user.email.split("@")[0],
					role: "user", // Default role
					email: user.email,
					created_at: new Date().toISOString(),
					auth_provider: "google",
				});
				await fetchProfile(user.uid);
			}

			return { error: null, user };
		} catch (error) {
			console.error("Google Sign-In Error:", error);
			return { error };
		}
	};

	const signOut = async () => {
		await firebaseSignOut(auth);
	};

	const AuthContextFeatures = {
		user,
		profile,
		loading,
		signUp,
		signIn,
		signInWithGoogle, // Add this to exports
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
