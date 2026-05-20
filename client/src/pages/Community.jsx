import { useEffect, useState } from "react";
import { MessageSquare, Plus, X, Pin, Tag } from "lucide-react";
import { db } from "../lib/firebase.config";
import {
	collection,
	query,
	where,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	orderBy,
	getDoc,
} from "firebase/firestore";
import { useAuth } from "../lib/context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

const TYPE_OPTIONS = ["general", "deal", "announcement", "news", "wanted"];
const TYPE_COLORS = {
	deal: "bg-green-100 text-green-700",
	announcement: "bg-blue-100 text-blue-700",
	news: "bg-orange-100 text-orange-700",
	wanted: "bg-red-100 text-red-700",
	general: "bg-gray-100 text-gray-600",
};

export default function Community() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [selectedType, setSelectedType] = useState(null);
	const [form, setForm] = useState({
		title: "",
		content: "",
		type: "general",
	});
	const [submitting, setSubmitting] = useState(false);
	const { user, profile } = useAuth();

	const fetchPosts = async () => {
		setLoading(true);
		try {
			// Build query based on selected type
			let postsQuery;
			if (selectedType) {
				postsQuery = query(
					collection(db, "community_posts"),
					where("type", "==", selectedType),
					orderBy("pinned", "desc"),
					orderBy("created_at", "desc"),
				);
			} else {
				postsQuery = query(
					collection(db, "community_posts"),
					orderBy("pinned", "desc"),
					orderBy("created_at", "desc"),
				);
			}

			const postsSnapshot = await getDocs(postsQuery);
			const postsData = [];

			for (const postDoc of postsSnapshot.docs) {
				const postData = { id: postDoc.id, ...postDoc.data() };

				// Fetch author profile if author_id exists
				if (postData.author_id) {
					const authorDoc = await getDoc(
						doc(db, "profiles", postData.author_id),
					);
					if (authorDoc.exists()) {
						postData.profiles = authorDoc.data();
					}
				}

				postsData.push(postData);
			}

			setPosts(postsData);
		} catch (error) {
			console.error("Error fetching posts:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, [selectedType]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!user || !form.title.trim() || !form.content.trim()) return;

		setSubmitting(true);
		try {
			const newPost = {
				author_id: user.uid,
				title: form.title.trim(),
				content: form.content.trim(),
				type: form.type,
				pinned: false,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			const docRef = await addDoc(
				collection(db, "community_posts"),
				newPost,
			);

			// Fetch the user profile for the new post
			const authorDoc = await getDoc(doc(db, "profiles", user.uid));
			const postWithProfile = {
				id: docRef.id,
				...newPost,
				profiles: authorDoc.exists() ? authorDoc.data() : null,
			};

			setPosts((prev) => [postWithProfile, ...prev]);
			setForm({ title: "", content: "", type: "general" });
			setShowForm(false);
		} catch (error) {
			console.error("Error creating post:", error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (postId) => {
		if (!user) return;
		if (!window.confirm("Delete this post?")) return;

		try {
			// Verify the user owns the post before deleting
			const postRef = doc(db, "community_posts", postId);
			await deleteDoc(postRef);
			setPosts((prev) => prev.filter((p) => p.id !== postId));
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	return (
		<div className="max-w-xl mx-auto px-4 py-4 space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
					<MessageSquare size={22} className="text-orange-500" />{" "}
					Community Board
				</h1>
				{user && (
					<button
						onClick={() => setShowForm(!showForm)}
						className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
					>
						<Plus size={16} /> Post
					</button>
				)}
			</div>

			{showForm && user && (
				<div className="bg-white rounded-2xl border border-gray-100 p-4">
					<div className="flex items-center justify-between mb-3">
						<h2 className="font-bold text-gray-900">New Post</h2>
						<button
							onClick={() => setShowForm(false)}
							aria-label="Close form"
						>
							<X size={18} className="text-gray-400" />
						</button>
					</div>
					<form onSubmit={handleSubmit} className="space-y-3">
						<div className="flex gap-1.5 flex-wrap">
							{TYPE_OPTIONS.map((type) => (
								<button
									key={type}
									type="button"
									onClick={() =>
										setForm((prev) => ({ ...prev, type }))
									}
									className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all ${
										form.type === type
											? TYPE_COLORS[type] +
												" ring-1 ring-offset-1 ring-current"
											: "bg-gray-100 text-gray-500"
									}`}
								>
									{type}
								</button>
							))}
						</div>
						<input
							type="text"
							placeholder="Post title..."
							value={form.title}
							onChange={(e) =>
								setForm((prev) => ({
									...prev,
									title: e.target.value,
								}))
							}
							required
							maxLength={100}
							className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
						/>
						<textarea
							placeholder="Share with the community..."
							value={form.content}
							onChange={(e) =>
								setForm((prev) => ({
									...prev,
									content: e.target.value,
								}))
							}
							required
							rows={4}
							className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
						/>
						<button
							type="submit"
							disabled={submitting}
							className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
						>
							{submitting ? "Posting..." : "Share Post"}
						</button>
					</form>
				</div>
			)}

			<div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
				<button
					onClick={() => setSelectedType(null)}
					className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
						!selectedType
							? "bg-gray-900 text-white"
							: "bg-white border border-gray-200 text-gray-600"
					}`}
				>
					All Posts
				</button>
				{TYPE_OPTIONS.map((type) => (
					<button
						key={type}
						onClick={() =>
							setSelectedType(type === selectedType ? null : type)
						}
						className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
							selectedType === type
								? TYPE_COLORS[type]
								: "bg-white border border-gray-200 text-gray-600"
						}`}
					>
						{type}
					</button>
				))}
			</div>

			{loading ? (
				<div className="flex justify-center py-16">
					<LoadingSpinner size="lg" />
				</div>
			) : posts.length === 0 ? (
				<div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
					<MessageSquare
						size={48}
						className="text-gray-300 mx-auto mb-3"
					/>
					<p className="font-semibold text-gray-700">No posts yet</p>
					<p className="text-gray-400 text-sm mt-1">
						Be the first to share with the community
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{posts.map((post) => (
						<div
							key={post.id}
							className={`bg-white rounded-2xl border p-4 ${
								post.pinned
									? "border-orange-200 bg-orange-50/30"
									: "border-gray-100"
							}`}
						>
							<div className="flex items-start gap-3">
								<div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
									<span className="text-orange-600 font-bold text-sm">
										{post.profiles?.full_name?.[0]?.toUpperCase() ||
											"C"}
									</span>
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 flex-wrap">
										<span
											className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize flex items-center gap-0.5 ${
												TYPE_COLORS[post.type] ||
												TYPE_COLORS.general
											}`}
										>
											<Tag size={10} />{" "}
											{post.type || "general"}
										</span>
										{post.pinned && (
											<span className="text-xs text-orange-500 font-medium flex items-center gap-0.5">
												<Pin size={10} /> Pinned
											</span>
										)}
									</div>
									<h3 className="font-bold text-gray-900 mt-1 text-sm">
										{post.title}
									</h3>
									<p className="text-gray-600 text-sm mt-1 leading-relaxed">
										{post.content}
									</p>
									<div className="flex items-center justify-between mt-2">
										<p className="text-xs text-gray-400">
											{post.profiles?.full_name ||
												"Community Member"}{" "}
											·{" "}
											{post.created_at
												? new Date(
														post.created_at,
													).toLocaleDateString(
														"en-KE",
														{
															day: "numeric",
															month: "short",
														},
													)
												: "Recently"}
										</p>
										{user?.uid === post.author_id && (
											<button
												onClick={() =>
													handleDelete(post.id)
												}
												className="text-xs text-red-400 hover:text-red-600 transition-colors"
											>
												Delete
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
