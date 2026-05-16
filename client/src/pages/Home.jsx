/**
|--------------------------------------------------


import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, TrendingUp, Star, MapPin, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Business, Category, CommunityPost } from '../lib/types';
import BusinessCard from '../components/business/BusinessCard';
import CategoryFilter from '../components/business/CategoryFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function HomePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [bizRes, catRes, postRes] = await Promise.all([
        supabase.from('businesses').select('*, categories(*)').eq('status', 'approved').order('featured', { ascending: false }).order('average_rating', { ascending: false }).limit(6),
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('community_posts').select('*, profiles(full_name)').order('pinned', { ascending: false }).order('created_at', { ascending: false }).limit(3),
      ]);
      if (bizRes.data) setBusinesses(bizRes.data as Business[]);
      if (catRes.data) setCategories(catRes.data as Category[]);
      if (postRes.data) setPosts(postRes.data as CommunityPost[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/discover?q=${encodeURIComponent(search.trim())}`);
  };

  const POST_TYPE_COLORS: Record<string, string> = {
    deal: 'bg-green-100 text-green-700',
    announcement: 'bg-blue-100 text-blue-700',
    news: 'bg-orange-100 text-orange-700',
    wanted: 'bg-red-100 text-red-700',
    general: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="max-w-5xl mx-auto">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-4 pt-8 pb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full" />
          <div className="absolute bottom-4 left-8 w-20 h-20 bg-white rounded-full" />
        </div>
        <div className="relative max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-sm px-3 py-1 rounded-full mb-4">
            <MapPin size={13} />
            <span>Tassia Complex, Embakasi East, Nairobi</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
            Your Community,<br />One Tap Away
          </h1>
          <p className="text-white/90 text-base mb-6">
            Discover local businesses, order food, book services, and connect with your neighbors.
          </p>
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search restaurants, salons, hardware..."
              className="w-full bg-white rounded-2xl pl-11 pr-28 py-3.5 text-sm text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-around gap-6">
          {[
            { icon: <TrendingUp size={18} className="text-orange-500" />, label: 'Businesses', value: '50+' },
            { icon: <Star size={18} className="text-amber-500" />, label: 'Reviews', value: '200+' },
            { icon: <Zap size={18} className="text-green-500" />, label: 'Orders Today', value: '30+' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              {stat.icon}
              <div>
                <p className="font-bold text-gray-900 text-sm leading-none">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Browse by Category</h2>
            <Link to="/discover" className="text-orange-500 text-sm font-medium flex items-center gap-0.5 hover:gap-1.5 transition-all">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-4"><LoadingSpinner /></div>
          ) : (
            <CategoryFilter
              categories={categories}
              selected={null}
              onSelect={slug => slug && navigate(`/discover?category=${slug}`)}
            />
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Featured Businesses</h2>
            <Link to="/discover" className="text-orange-500 text-sm font-medium flex items-center gap-0.5 hover:gap-1.5 transition-all">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">No businesses yet. Be the first to register!</p>
              <Link to="/dashboard/new" className="mt-3 inline-block bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors">
                Register Business
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map(biz => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          )}
        </section>

        {posts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">Community Board</h2>
              <Link to="/community" className="text-orange-500 text-sm font-medium flex items-center gap-0.5 hover:gap-1.5 transition-all">
                See all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${POST_TYPE_COLORS[post.type]}`}>
                          {post.type}
                        </span>
                        {post.pinned && <span className="text-xs text-orange-500 font-medium">Pinned</span>}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">{post.title}</h3>
                      <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{post.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        by {post.profiles?.full_name || 'Community Member'} · {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Own a Business in Tassia?</h2>
          <p className="text-gray-300 text-sm mb-4">List your business for free and reach hundreds of residents daily.</p>
          <Link
            to="/dashboard/new"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-400 transition-colors"
          >
            List My Business <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}

|--------------------------------------------------
*/

import { useEffect, useState } from "react";
import MetaDataInsert from "../lib/MetaDataInsert";
import data from "../lib/data";
import {
	ArrowRight,
	MapPin,
	Search,
	Star,
	TrendingUp,
	Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CategoryFilter from "../components/business/CategoryFilter";
import BusinessCard from "../components/business/BusinessCard";
import { useData } from "../lib/context/DataContext";

const Home = () => {
	const { limit, dummyBusinesses } = useData();

	const [loading, setLoading] = useState(true);
	const [businesses, setBusinesses] = useState([]);
	const [posts, setPosts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [search, setSearch] = useState("");

	const navigate = useNavigate();
	const pinned = posts.filter((f) => f.pinned === true);

	const fetchData = async () => {
		// dummy fetch action
		try {
			setLoading(true);

			const pinnedPosts = data.dummyCommunityPosts.filter(
				(f) => f.pinned,
			);

			const randPosts = [...pinnedPosts]
				.sort(() => Math.random() - 0.5)
				.slice(0, limit);

			const featuredBiz = dummyBusinesses.filter((f) => f.featured);

			const randBiz = [...featuredBiz]
				.sort(() => Math.random() - 0.5)
				.slice(0, limit);

			setCategories([...data.dummyCategories]);
			setPosts(randPosts);
			setBusinesses(randBiz);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();

		const searchItem = search.trim();

		if (searchItem)
			navigate(`/discover?q=${encodeURIComponent(searchItem)}`);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<MetaDataInsert title={data.metadata.name} />
			<div className="max-w-5xl mx-auto">
				{/* Hero - covered*/}
				<section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-4 pt-8 pb-16">
					<div className="absolute inset-0 opacity-10">
						<div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full" />
						<div className="absolute bottom-4 left-8 w-20 h-20 bg-white rounded-full" />
					</div>
					<div className="relative max-w-xl mx-auto text-center">
						<div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-sm px-3 py-1 rounded-full mb-4">
							<MapPin size={13} />
							<span>Tassia Complex, Embakasi East, Nairobi</span>
						</div>
						<h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
							Your Community,
							<br />
							One Tap Away
						</h1>
						<p className="text-white/90 text-base mb-6">
							Discover local businesses, order food, book
							services, and connect with your neighbors.
						</p>
						<form
							onSubmit={handleSearch}
							className="relative max-w-md mx-auto"
						>
							<Search
								size={18}
								className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search restaurants, salons, hardware..."
								className="w-full bg-white rounded-2xl pl-11 pr-28 py-3.5 text-sm text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
							/>
							<button
								type="submit"
								className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
							>
								Search
							</button>
						</form>
					</div>
				</section>

				{/* Stats Banner - covered for now */}
				<div className="bg-white border-b border-gray-100 px-4 py-3">
					<div className="max-w-xl mx-auto flex items-center justify-around gap-6">
						{[
							{
								icon: (
									<TrendingUp
										size={18}
										className="text-orange-500"
									/>
								),
								label: "Businesses",
								value: businesses
									? businesses.length + "+"
									: "50+",
							},
							{
								icon: (
									<Star
										size={18}
										className="text-amber-500"
									/>
								),
								label: "Reviews",
								value: posts ? posts.length + "+" : "No posts",
							},
							{
								icon: (
									<Zap size={18} className="text-green-500" />
								),
								label: "Orders Today",
								value: "30+",
							},
						].map((stat) => (
							<div
								key={stat.label}
								className="flex items-center gap-2"
							>
								{stat.icon}
								<div>
									<p className="font-bold text-gray-900 text-sm leading-none">
										{stat.value}
									</p>
									<p className="text-xs text-gray-500">
										{stat.label}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="px-4 py-6 space-y-8">
					{/* browse categories */}
					<section>
						<div className="flex items-center justify-between mb-3">
							<h2 className="text-lg font-bold text-gray-900">
								Browse by Category
							</h2>
							<Link
								to="/discover"
								className="text-orange-500 text-sm font-medium flex items-center gap-0.5 hover:gap-1.5 transition-all"
							>
								See all <ArrowRight size={14} />
							</Link>
						</div>
						{loading ? (
							<div className="flex justify-center py-4">
								<LoadingSpinner />
							</div>
						) : (
							<CategoryFilter
								categories={categories}
								selected={null}
								onSelect={(slug) =>
									slug &&
									navigate(`/discover?category=${slug}`)
								}
							/>
						)}
					</section>

					{/* featured businessess */}
					<section>
						<div className="flex items-center justify-between mb-3">
							<h2 className="text-lg font-bold text-gray-900">
								Featured Businesses
							</h2>
							<Link
								to="/discover"
								className="text-orange-500 text-sm font-medium flex items-center gap-0.5 hover:gap-1.5 transition-all"
							>
								See all <ArrowRight size={14} />
							</Link>
						</div>
						{loading ? (
							<div className="flex justify-center py-8">
								<LoadingSpinner size="lg" />
							</div>
						) : businesses.length === 0 ? (
							<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
								<p className="text-gray-500">
									No businesses yet. Be the first to register!
								</p>
								<Link
									to="/dashboard/new"
									className="mt-3 inline-block bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
								>
									Register Business
								</Link>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{businesses.map((biz) => (
									<BusinessCard key={biz.id} business={biz} />
								))}
							</div>
						)}
					</section>

					{/* posts */}
					{posts.length > 0 && (
						<section>
							<div className="flex items-center justify-between mb-3">
								<h2 className="text-lg font-bold text-gray-900">
									Community Board
								</h2>
								<Link
									to="/community"
									className="text-orange-500 text-sm font-medium flex items-center gap-0.5 hover:gap-1.5 transition-all"
								>
									See all <ArrowRight size={14} />
								</Link>
							</div>

							<div className="space-y-3">
								{posts.map((post) => (
									<div
										key={post.id}
										className="bg-white rounded-2xl border border-gray-100 p-4"
									>
										<div className="flex items-start gap-3">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<span
														className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${data.TYPE_OPTION_COLORS[post.type]}`}
													>
														{post.type}
													</span>
													{post.pinned && (
														<span className="text-xs text-orange-500 font-medium">
															Pinned
														</span>
													)}
												</div>
												<h3 className="font-semibold text-gray-900 text-sm">
													{post.title}
												</h3>
												<p className="text-gray-500 text-sm mt-0.5 line-clamp-2">
													{post.content}
												</p>
												<p className="text-xs text-gray-400 mt-1">
													by{" "}
													{post.profiles?.full_name ||
														"Community Member"}{" "}
													·{" "}
													{new Date(
														post.created_at,
													).toLocaleDateString()}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</section>
					)}

					{/* "CTA" */}
					<section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
						<h2 className="text-xl font-bold mb-2">
							Own a Business in Tassia?
						</h2>
						<p className="text-gray-300 text-sm mb-4">
							List your business for free and reach hundreds of
							residents daily.
						</p>
						<Link
							to="/dashboard/new"
							className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-400 transition-colors"
						>
							List My Business <ArrowRight size={16} />
						</Link>
					</section>
				</div>
			</div>
		</>
	);
};

export default Home;
