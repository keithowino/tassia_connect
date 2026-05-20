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

	const { signIn, signUp } = useAuth();
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
