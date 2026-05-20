import { createContext, useContext, useEffect, useState } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.config";

const AuthContext = createContext(undefined); // explain this

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

	const signIn = async (email, password) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			return { error: null };
		} catch (error) {
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
