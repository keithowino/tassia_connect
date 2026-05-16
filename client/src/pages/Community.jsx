/**
|--------------------------------------------------

import { useEffect, useState } from 'react';
import { MessageSquare, Plus, X, Pin, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CommunityPost } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TYPE_OPTIONS = ['general', 'deal', 'announcement', 'news', 'wanted'] as const;
const TYPE_COLORS: Record<string, string> = {
  deal: 'bg-green-100 text-green-700',
  announcement: 'bg-blue-100 text-blue-700',
  news: 'bg-orange-100 text-orange-700',
  wanted: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-600',
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', type: 'general' as typeof TYPE_OPTIONS[number] });
  const [submitting, setSubmitting] = useState(false);
  const { user, profile } = useAuth();

  const fetchPosts = async () => {
    const query = supabase
      .from('community_posts')
      .select('*, profiles(full_name, avatar_url)')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });
    if (selectedType) query.eq('type', selectedType);
    const { data } = await query;
    if (data) setPosts(data as CommunityPost[]);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [selectedType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    const { data } = await supabase.from('community_posts').insert({
      author_id: user.id,
      title: form.title.trim(),
      content: form.content.trim(),
      type: form.type,
    }).select('*, profiles(full_name, avatar_url)').single();
    if (data) setPosts(prev => [data as CommunityPost, ...prev]);
    setForm({ title: '', content: '', type: 'general' });
    setShowForm(false);
    setSubmitting(false);
  };

  const handleDelete = async (postId: string) => {
    if (!user) return;
    if (!window.confirm('Delete this post?')) return;
    await supabase.from('community_posts').delete().eq('id', postId).eq('author_id', user.id);
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare size={22} className="text-orange-500" /> Community Board
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
            <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-1.5 flex-wrap">
              {TYPE_OPTIONS.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, type }))}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                    form.type === type ? TYPE_COLORS[type] + ' ring-1 ring-offset-1 ring-current' : 'bg-gray-100 text-gray-500'
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
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              required
              maxLength={100}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
            <textarea
              placeholder="Share with the community..."
              value={form.content}
              onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              required
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Posting...' : 'Share Post'}
            </button>
          </form>
        </div>
      )}

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setSelectedType(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!selectedType ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          All Posts
        </button>
        {TYPE_OPTIONS.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type === selectedType ? null : type)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              selectedType === type ? TYPE_COLORS[type] : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-700">No posts yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to share with the community</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className={`bg-white rounded-2xl border p-4 ${post.pinned ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-orange-600 font-bold text-sm">{post.profiles?.full_name?.[0]?.toUpperCase() || 'C'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize flex items-center gap-0.5 ${TYPE_COLORS[post.type]}`}>
                      <Tag size={10} /> {post.type}
                    </span>
                    {post.pinned && (
                      <span className="text-xs text-orange-500 font-medium flex items-center gap-0.5">
                        <Pin size={10} /> Pinned
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mt-1 text-sm">{post.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      {post.profiles?.full_name || 'Community Member'} · {new Date(post.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                    </p>
                    {user?.id === post.author_id && (
                      <button
                        onClick={() => handleDelete(post.id)}
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


|--------------------------------------------------
*/

import { MessageSquare, Pin, Plus, Tag, X } from "lucide-react";
import MetaDataInsert from "../lib/MetaDataInsert";
import { useEffect, useState } from "react";
import data from "../lib/data";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useData } from "../lib/context/DataContext";

const Community = () => {
	const { user, dummyCommunityPosts } = useData();

	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState({
		title: "",
		content: "",
		type: "general",
	});
	const [submitting, setSubmitting] = useState(false);
	const [posts, setPosts] = useState([]);
	const [selectedType, setSelectedType] = useState(null); // (useState < string) | (null > null)
	const [loading, setLoading] = useState(true);

	let count = 11; // dummy variable

	const fetchPosts = async () => {
		try {
			// // 		const query = supabase
			// //   .from('community_posts')
			// //   .select('*, profiles(full_name, avatar_url)')
			// //   .order('pinned', { ascending: false })
			// //   .order('created_at', { ascending: false });
			// // if (selectedType) query.eq('type', selectedType);
			// // const { data } = await query;
			// // if (data) setPosts(data as CommunityPost[]);
			if (selectedType) {
				const filteredPosts = dummyCommunityPosts.filter(
					(f) => f.type === selectedType,
				);
				setPosts(filteredPosts);
			} else {
				setPosts(dummyCommunityPosts);
			}
		} catch (error) {
			console.error(error);
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

		try {
			setSubmitting(true);

			// 	const { data } = await supabase.from('community_posts').insert({
			//   author_id: user.id,
			//   title: form.title.trim(),
			//   content: form.content.trim(),
			//   type: form.type,
			// }).select('*, profiles(full_name, avatar_url)').single();
			// if (data) setPosts(prev => [data as CommunityPost, ...prev]);
			setPosts((prev) => [
				{
					id: count++,
					author_id: 3,
					title: form.title.trim(),
					content: form.content.trim(),
					type: form.type,
				},
				...prev,
			]);
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
			setForm({ title: "", content: "", type: "general" });
			setShowForm(false);
		}
	};

	const handleDelete = async (postId) => {
		if (!user) return;
		if (!window.confirm("Delete this post?")) return;
		// await supabase.from('community_posts').delete().eq('id', postId).eq('author_id', user.id);
		setPosts((prev) => prev.filter((p) => p.id !== postId));
	};

	return (
		<>
			<MetaDataInsert title={"Community"} />
			<section className="max-w-xl mx-auto px-4 py-4 space-y-4">
				{/* component header */}
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

				{/* Post form */}
				{showForm && user && (
					<div className="bg-white rounded-2xl border border-gray-100 p-4">
						<div className="flex items-center justify-between mb-3">
							<h2 className="font-bold text-gray-900">
								New Post
							</h2>
							<button onClick={() => setShowForm(false)}>
								<X size={18} className="text-gray-400" />
							</button>
						</div>
						<form onSubmit={handleSubmit} className="space-y-3">
							<div className="flex gap-1.5 flex-wrap">
								{data.TYPE_OPTIONS.map((type) => (
									<button
										key={type}
										type="button"
										onClick={() =>
											setForm((prev) => ({
												...prev,
												type,
											}))
										}
										className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all ${
											form.type === type
												? data.TYPE_OPTION_COLORS[
														type
													] +
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

				{/* choose post messages */}
				<div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
					<button
						onClick={() => setSelectedType(null)}
						className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!selectedType ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
					>
						All Posts
					</button>
					{data.TYPE_OPTIONS.map((type) => (
						<button
							key={type}
							onClick={() =>
								setSelectedType(
									type === selectedType ? null : type,
								)
							}
							className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
								selectedType === type
									? data.TYPE_OPTION_COLORS[type]
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
						<p className="font-semibold text-gray-700">
							No posts yet
						</p>
						<p className="text-gray-400 text-sm mt-1">
							Be the first to share with the community
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{posts.map((post) => (
							<div
								key={post.id}
								className={`bg-white rounded-2xl border p-4 ${post.pinned ? "border-orange-200 bg-orange-50/30" : "border-gray-100"}`}
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
												className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize flex items-center gap-0.5 ${data.TYPE_OPTION_COLORS[post.type]}`}
											>
												<Tag size={10} /> {post.type}
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
												{new Date(
													post.created_at,
												).toLocaleDateString("en-KE", {
													day: "numeric",
													month: "short",
												})}
											</p>
											{user?.id === post.author_id && (
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
			</section>
		</>
	);
};

export default Community;
