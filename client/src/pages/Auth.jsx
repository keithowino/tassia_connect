import { Link, useNavigate } from "react-router-dom";
import MetaDataInsert from "../lib/MetaDataInsert";
import {
	Eye,
	EyeOff,
	Lock,
	Mail,
	MapPin,
	Phone,
	Store,
	User,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../lib/context/AuthContext";

const Auth = () => {
	const [tab, setTab] = useState("signin");
	const [error, setError] = useState("");
	const [role, setRole] = useState("user");
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [phone, setPhone] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { signIn, signUp, signInWithGoogle } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		if (tab === "signin") {
			const { error } = await signIn(email, password);
			if (error) {
				setError(error.message);
				setLoading(false);
				return;
			}
		} else {
			if (!fullName.trim()) {
				setError("Please enter your name");
				setLoading(false);
				return;
			}
			const { error } = await signUp(
				email,
				password,
				fullName.trim(),
				role,
			);
			if (error) {
				setError(error.message);
				setLoading(false);
				return;
			}
		}

		setLoading(false);
		navigate(
			tab === "signup" && role === "business_owner"
				? "/dashboard/new"
				: "/",
		);
	};

	const handleGoogleSignIn = async () => {
		setError("");
		setLoading(true);

		const { error } = await signInWithGoogle();

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		setLoading(false);
		navigate("/");
	};

	return (
		<>
			<MetaDataInsert title="Auth" />
			<section className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4 py-8">
				<div className="w-full max-w-md">
					<div className="text-center mb-8">
						<Link
							to="/"
							className="inline-flex items-center gap-2 mb-4"
						>
							<div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
								<MapPin
									size={20}
									className="text-white"
									strokeWidth={2.5}
								/>
							</div>
							<span className="font-bold text-gray-900 text-xl">
								Tassia
								<span className="text-orange-500">Connect</span>
							</span>
						</Link>
						<p className="text-gray-500 text-sm">
							{tab === "signin"
								? "Welcome back to your community"
								: "Join the Tassia community"}
						</p>
					</div>

					<div className="bg-white rounded-3xl shadow-lg p-6">
						<div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
							{["signin", "signup"].map((t) => (
								<button
									key={t}
									onClick={() => {
										setTab(t);
										setError("");
									}}
									className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${t === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
								>
									{t === "signin"
										? "Sign In"
										: "Create Account"}
								</button>
							))}
						</div>

						{tab === "signup" && (
							<div className="flex gap-2 mb-4">
								{["user", "business_owner"].map((r) => (
									<button
										key={r}
										onClick={() => setRole(r)}
										className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
											role === r
												? "border-orange-400 bg-orange-50 text-orange-700"
												: "border-gray-200 text-gray-600 hover:border-gray-300"
										}`}
									>
										{r === "user" ? (
											<>
												<User size={15} /> Resident
											</>
										) : (
											<>
												<Store size={15} /> Business
												Owner
											</>
										)}
									</button>
								))}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							{tab === "signup" && (
								<>
									<div className="relative">
										<User
											size={17}
											className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
										/>
										<input
											type="text"
											placeholder="Full Name"
											value={fullName}
											onChange={(e) =>
												setFullName(e.target.value)
											}
											required
											className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
										/>
									</div>
									<div className="relative">
										<Phone
											size={17}
											className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
										/>
										<input
											type="tel"
											placeholder="Phone (optional)"
											value={phone}
											onChange={(e) =>
												setPhone(e.target.value)
											}
											className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
										/>
									</div>
								</>
							)}
							<div className="relative">
								<Mail
									size={17}
									className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									type="email"
									placeholder="Email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								/>
							</div>
							<div className="relative">
								<Lock
									size={17}
									className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
									minLength={6}
									className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
								>
									{showPassword ? (
										<EyeOff size={17} />
									) : (
										<Eye size={17} />
									)}
								</button>
							</div>

							{error && (
								<div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
									{error}
								</div>
							)}

							<button
								type="submit"
								disabled={loading}
								className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-base hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{loading
									? "Please wait..."
									: tab === "signin"
										? "Sign In"
										: "Create Account"}
							</button>
						</form>

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-200"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Or continue with
								</span>
							</div>
						</div>

						{/* Google Sign-In Button */}
						<button
							onClick={handleGoogleSignIn}
							disabled={loading}
							className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
						>
							<svg className="w-5 h-5" viewBox="0 0 24 24">
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Sign in with Google
						</button>

						{tab === "signin" && (
							<p className="text-center text-sm text-gray-500 mt-4">
								Don't have an account?{" "}
								<button
									onClick={() => setTab("signup")}
									className="text-orange-500 font-semibold hover:text-orange-600"
								>
									Sign up free
								</button>
							</p>
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default Auth;
