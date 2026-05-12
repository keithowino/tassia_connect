/**
|--------------------------------------------------


import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Business, Category } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/business/SearchBar';
import CategoryFilter from '../components/business/CategoryFilter';
import BusinessCard from '../components/business/BusinessCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DiscoveryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'name'>('rating');
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useAuth();
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || null;

  useEffect(() => {
    const fetchAll = async () => {
      const [bizRes, catRes] = await Promise.all([
        supabase.from('businesses').select('*, categories(*)').eq('status', 'approved'),
        supabase.from('categories').select('*').order('sort_order'),
      ]);
      if (bizRes.data) setBusinesses(bizRes.data as Business[]);
      if (catRes.data) setCategories(catRes.data as Category[]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from('favorites').select('business_id').eq('user_id', user.id).then(({ data }) => {
      if (data) setFavorites(new Set(data.map(f => f.business_id as string)));
    });
  }, [user]);

  const handleToggleFavorite = async (businessId: string) => {
    if (!user) return;
    if (favorites.has(businessId)) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('business_id', businessId);
      setFavorites(prev => { const s = new Set(prev); s.delete(businessId); return s; });
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, business_id: businessId });
      setFavorites(prev => new Set([...prev, businessId]));
    }
  };

  const filtered = useMemo(() => {
    let result = [...businesses];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.categories?.name.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter(b => b.categories?.slug === selectedCategory);
    }
    if (deliveryOnly) {
      result = result.filter(b => b.delivery_available);
    }
    switch (sortBy) {
      case 'rating': result.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0)); break;
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [businesses, searchQuery, selectedCategory, sortBy, deliveryOnly]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={q => setSearchParams(prev => { if (q) prev.set('q', q); else prev.delete('q'); return prev; })}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-2xl border transition-all ${showFilters ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-200 text-gray-600'}`}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800 text-sm">Filters & Sort</p>
            <button onClick={() => setShowFilters(false)}><X size={16} className="text-gray-400" /></button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <p className="text-xs text-gray-500 w-full">Sort by:</p>
            {(['rating', 'newest', 'name'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                  sortBy === s ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'rating' ? 'Top Rated' : s === 'newest' ? 'Newest' : 'A-Z'}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setDeliveryOnly(!deliveryOnly)}
              className={`w-10 h-6 rounded-full transition-colors relative ${deliveryOnly ? 'bg-orange-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${deliveryOnly ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm text-gray-700">Delivery available only</span>
          </label>
        </div>
      )}

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={slug => setSearchParams(prev => {
          if (slug) prev.set('category', slug);
          else prev.delete('category');
          return prev;
        })}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? 'Loading...' : `${filtered.length} business${filtered.length !== 1 ? 'es' : ''} found`}
        </p>
        {(searchQuery || selectedCategory) && (
          <button
            onClick={() => setSearchParams({})}
            className="text-sm text-orange-500 flex items-center gap-1 hover:text-orange-600"
          >
            <X size={13} /> Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-semibold text-gray-800">No businesses found</p>
          <p className="text-gray-500 text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(biz => (
            <BusinessCard
              key={biz.id}
              business={biz}
              isFavorited={favorites.has(biz.id)}
              onToggleFavorite={user ? handleToggleFavorite : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}



|--------------------------------------------------
*/

import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/business/SearchBar";
import { SlidersHorizontal, X } from "lucide-react";
import MetaDataInsert from "../lib/MetaDataInsert";
import { useEffect, useMemo, useState } from "react";
import data from "../lib/data";
import CategoryFilter from "../components/business/CategoryFilter";
import LoadingSpinner from "../components/common/LoadingSpinner";
import BusinessCard from "../components/business/BusinessCard";

const Discovery = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [showFilters, setShowFilters] = useState(false);
	const [sortBy, setSortBy] = useState("rating"); // (useState < "rating") | "newest" | ("name" > "rating")
	const [businesses, setBusinesses] = useState([]);
	const [categories, setCategories] = useState([]);
	const [deliveryOnly, setDeliveryOnly] = useState(false);
	const [loading, setLoading] = useState(true);
	const [favorites, setFavorites] = useState(); // < Set < string >> new Set();

	const user = true; // dummy user
	const searchQuery = searchParams.get("q") || "";
	const selectedCategory = searchParams.get("category") || null;

	const fetchAll = async () => {
		// dummy fetch action
		try {
			setLoading(true);
			setBusinesses([...data.dummyBusinesses]);
			setCategories([...data.dummyCategories]);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAll();
	}, []);

	useEffect(() => {
		if (!user) return;
		// supabase.from('favorites').select('business_id').eq('user_id', user.id).then(({ data }) => {
		//   if (data) setFavorites(new Set(data.map(f => f.business_id as string)));
		// });

		// dummy set action
		setFavorites(data.dummyFavorites.map((f) => f.business_id));
	}, [user]);

	const handleToggleFavorite = async (businessId) => {
		if (!user) return;
		// if (favorites.has(businessId)) {
		// 	await supabase
		// 		.from("favorites")
		// 		.delete()
		// 		.eq("user_id", user.id)
		// 		.eq("business_id", businessId);
		// 	setFavorites((prev) => {
		// 		const s = new Set(prev);
		// 		s.delete(businessId);
		// 		return s;
		// 	});
		// } else {
		// 	await supabase
		// 		.from("favorites")
		// 		.insert({ user_id: user.id, business_id: businessId });
		// 	setFavorites((prev) => new Set([...prev, businessId]));
		// }
	};

	const filtered = useMemo(() => {
		let result = [...businesses];
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(b) =>
					b.name.toLowerCase().includes(q) ||
					b.description.toLowerCase().includes(q) ||
					b.tagline.toLowerCase().includes(q) ||
					b.categories?.name.toLowerCase().includes(q),
			);
		}
		if (selectedCategory) {
			result = result.filter(
				(b) => b.categories?.slug === selectedCategory,
			);
		}
		if (deliveryOnly) {
			result = result.filter((b) => b.delivery_available);
		}
		switch (sortBy) {
			case "rating":
				result.sort(
					(a, b) => (b.average_rating || 0) - (a.average_rating || 0),
				);
				break;
			case "newest":
				result.sort(
					(a, b) =>
						new Date(b.created_at).getTime() -
						new Date(a.created_at).getTime(),
				);
				break;
			case "name":
				result.sort((a, b) => a.name.localeCompare(b.name));
				break;
		}
		result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
		return result;
	}, [businesses, searchQuery, selectedCategory, sortBy, deliveryOnly]);

	return (
		<>
			<MetaDataInsert title={"Discover"} />
			<div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
				<div className="flex gap-2">
					<div className="flex-1">
						<SearchBar
							value={searchQuery}
							onChange={(q) =>
								setSearchParams((prev) => {
									if (q) prev.set("q", q);
									else prev.delete("q");
									return prev;
								})
							}
						/>
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`p-3 rounded-2xl border transition-all ${showFilters ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-gray-200 text-gray-600"}`}
					>
						<SlidersHorizontal size={18} />
					</button>
				</div>

				{showFilters && (
					<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
						<div className="flex items-center justify-between">
							<p className="font-semibold text-gray-800 text-sm">
								Filters & Sort
							</p>
							<button onClick={() => setShowFilters(false)}>
								<X size={16} className="text-gray-400" />
							</button>
						</div>
						<div className="flex gap-2 flex-wrap">
							<p className="text-xs text-gray-500 w-full">
								Sort by:
							</p>
							{["rating", "newest", "name"].map((s) => (
								<button
									key={s}
									onClick={() => setSortBy(s)}
									className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
										sortBy === s
											? "bg-orange-500 text-white"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
								>
									{s === "rating"
										? "Top Rated"
										: s === "newest"
											? "Newest"
											: "A-Z"}
								</button>
							))}
						</div>
						<label className="flex items-center gap-2 cursor-pointer">
							<div
								onClick={() => setDeliveryOnly(!deliveryOnly)}
								className={`w-10 h-6 rounded-full transition-colors relative ${deliveryOnly ? "bg-orange-500" : "bg-gray-300"}`}
							>
								<div
									className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${deliveryOnly ? "translate-x-5" : "translate-x-1"}`}
								/>
							</div>
							<span className="text-sm text-gray-700">
								Delivery available only
							</span>
						</label>
					</div>
				)}

				<CategoryFilter
					categories={categories}
					selected={selectedCategory}
					onSelect={(slug) =>
						setSearchParams((prev) => {
							if (slug) prev.set("category", slug);
							else prev.delete("category");
							return prev;
						})
					}
				/>

				<div className="flex items-center justify-between">
					<p className="text-sm text-gray-500">
						{loading
							? "Loading..."
							: `${filtered.length} business${filtered.length !== 1 ? "es" : ""} found`}
					</p>
					{(searchQuery || selectedCategory) && (
						<button
							onClick={() => setSearchParams({})}
							className="text-sm text-orange-500 flex items-center gap-1 hover:text-orange-600"
						>
							<X size={13} /> Clear filters
						</button>
					)}
				</div>

				{loading ? (
					<div className="flex justify-center py-16">
						<LoadingSpinner size="lg" />
					</div>
				) : filtered.length === 0 ? (
					<div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
						<p className="text-2xl mb-2">🔍</p>
						<p className="font-semibold text-gray-800">
							No businesses found
						</p>
						<p className="text-gray-500 text-sm mt-1">
							Try a different search or category
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{filtered.map((biz) => (
							<BusinessCard
								key={biz.id}
								business={biz}
								// isFavorited={favorites.has(biz.id)}
								isFavorited={true}
								onToggleFavorite={
									user ? handleToggleFavorite : undefined
								}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default Discovery;
