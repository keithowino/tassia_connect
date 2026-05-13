/**
|--------------------------------------------------

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Phone, Clock, Star, Heart, ShoppingCart, MessageCircle,
  ChevronLeft, Globe, Mail, Package, Wrench, Plus, Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Business, ProductService, Review } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function BusinessProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<ProductService[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info'>('menu');
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const { user } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    const fetchBusiness = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('*, categories(*), profiles(*)')
        .eq('slug', slug)
        .maybeSingle();
      if (data) {
        setBusiness(data as Business);
        await supabase.from('businesses').update({ view_count: (data.view_count || 0) + 1 }).eq('id', data.id);
        const [prodRes, revRes] = await Promise.all([
          supabase.from('products_services').select('*').eq('business_id', data.id).eq('available', true).order('sort_order'),
          supabase.from('reviews').select('*, profiles(full_name, avatar_url)').eq('business_id', data.id).order('created_at', { ascending: false }),
        ]);
        if (prodRes.data) setProducts(prodRes.data as ProductService[]);
        if (revRes.data) setReviews(revRes.data as Review[]);
        if (user) {
          const { data: fav } = await supabase.from('favorites').select('id').eq('user_id', user.id).eq('business_id', data.id).maybeSingle();
          setIsFavorited(!!fav);
        }
      }
      setLoading(false);
    };
    fetchBusiness();
  }, [slug, user]);

  const toggleFavorite = async () => {
    if (!user || !business) return;
    if (isFavorited) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('business_id', business.id);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, business_id: business.id });
    }
    setIsFavorited(!isFavorited);
  };

  const handleAddToCart = (product: ProductService) => {
    if (!business) return;
    addItem(product, business.id, business.name);
    setAddedItems(prev => new Set([...prev, product.id]));
    setTimeout(() => setAddedItems(prev => { const s = new Set(prev); s.delete(product.id); return s; }), 2000);
  };

  const handleSubmitReview = async () => {
    if (!user || !business || reviewForm.rating === 0) return;
    setSubmittingReview(true);
    const { data, error } = await supabase.from('reviews').upsert({
      business_id: business.id,
      user_id: user.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    }, { onConflict: 'business_id,user_id' }).select('*, profiles(full_name, avatar_url)').single();
    if (!error && data) {
      setReviews(prev => [data as Review, ...prev.filter(r => r.user_id !== user.id)]);
      setReviewForm({ rating: 0, comment: '' });
    }
    setSubmittingReview(false);
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  }
  if (!business) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Business not found</p>
        <Link to="/discover" className="mt-4 inline-block text-orange-500 font-medium">Browse businesses</Link>
      </div>
    );
  }

  const coverImage = business.cover_image || `https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative h-52 md:h-72">
        <img src={coverImage} alt={business.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Link to="/discover" className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
          <ChevronLeft size={20} className="text-gray-700" />
        </Link>
        {user && (
          <button onClick={toggleFavorite} className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Heart size={20} className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'} />
          </button>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-extrabold text-white">{business.name}</h1>
          {business.tagline && <p className="text-white/80 text-sm">{business.tagline}</p>}
        </div>
      </div>

      <div className="px-4 pb-8">
        <div className="bg-white rounded-2xl -mt-6 relative shadow-md p-4 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              {business.categories && (
                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: business.categories.color }}>
                  {business.categories.name}
                </span>
              )}
              <div className="flex items-center gap-2">
                <StarRating rating={business.average_rating} size={16} />
                <span className="font-bold text-gray-800">{business.average_rating > 0 ? business.average_rating.toFixed(1) : 'No ratings'}</span>
                <span className="text-gray-400 text-sm">({business.review_count} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin size={14} className="text-orange-500" />
                <span>{business.location_label}{business.floor_unit ? `, ${business.floor_unit}` : ''}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock size={14} className="text-green-500" />
                <span>{business.opening_time} – {business.closing_time}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {business.phone && (
                <a href={`tel:${business.phone}`} className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors">
                  <Phone size={14} /> Call
                </a>
              )}
              {business.whatsapp && (
                <a href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors">
                  <MessageCircle size={14} /> WhatsApp
                </a>
              )}
            </div>
          </div>
          {business.delivery_available && (
            <div className="mt-3 flex items-center gap-2 bg-blue-50 rounded-xl p-2.5">
              <ShoppingCart size={16} className="text-blue-500" />
              <span className="text-sm text-blue-700 font-medium">Delivery available · KES {business.delivery_fee} fee</span>
              {business.min_order > 0 && <span className="text-xs text-blue-500">Min order: KES {business.min_order}</span>}
            </div>
          )}
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-4">
          {(['menu', 'reviews', 'info'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'menu' ? 'Menu & Services' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'menu' && (
          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500">No products or services listed yet.</p>
              </div>
            ) : (
              <>
                {['product', 'service'].map(type => {
                  const items = products.filter(p => p.type === type);
                  if (items.length === 0) return null;
                  return (
                    <div key={type}>
                      <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2 mb-2">
                        {type === 'product' ? <Package size={14} /> : <Wrench size={14} />}
                        {type === 'product' ? 'Products' : 'Services'}
                      </h3>
                      <div className="space-y-2">
                        {items.map(item => (
                          <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                            {item.image_url && (
                              <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                              {item.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>}
                              <p className="font-bold text-orange-500 text-base mt-1">KES {item.price.toLocaleString()}</p>
                            </div>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className={`shrink-0 p-2 rounded-xl transition-all ${
                                addedItems.has(item.id)
                                  ? 'bg-green-500 text-white'
                                  : 'bg-orange-500 text-white hover:bg-orange-600'
                              }`}
                            >
                              {addedItems.has(item.id) ? <Check size={18} /> : <Plus size={18} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {user && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900 mb-3">Leave a Review</h3>
                <StarRating rating={reviewForm.rating} size={28} interactive onChange={r => setReviewForm(prev => ({ ...prev, rating: r }))} />
                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full mt-3 border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewForm.rating === 0 || submittingReview}
                  className="mt-2 bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}
            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <Star size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-sm">{review.profiles?.full_name?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.profiles?.full_name || 'User'}</p>
                      <StarRating rating={review.rating} size={12} />
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  {review.comment && <p className="text-gray-700 text-sm">{review.comment}</p>}
                  {review.owner_reply && (
                    <div className="mt-2 bg-orange-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-orange-700 mb-1">Owner replied:</p>
                      <p className="text-sm text-gray-700">{review.owner_reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
              <h3 className="font-bold text-gray-900">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{business.description || 'No description available.'}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
              <h3 className="font-bold text-gray-900">Contact & Location</h3>
              {[
                { icon: MapPin, label: business.address, show: !!business.address },
                { icon: Phone, label: business.phone, show: !!business.phone },
                { icon: Mail, label: business.email, show: !!business.email },
                { icon: Globe, label: business.website, show: !!business.website },
              ].filter(i => i.show).map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon size={15} className="text-orange-500 shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="font-bold text-gray-900 mb-3">Opening Hours</h3>
              <div className="grid grid-cols-2 gap-y-1.5">
                {days.map(day => {
                  const isToday = day === today;
                  const isOpen = business.open_days.includes(day);
                  return (
                    <div key={day} className={`flex items-center justify-between col-span-2 py-1 px-2 rounded-lg text-sm ${isToday ? 'bg-orange-50' : ''}`}>
                      <span className={`font-medium ${isToday ? 'text-orange-600' : 'text-gray-700'}`}>{day}{isToday ? ' (Today)' : ''}</span>
                      <span className={isOpen ? 'text-gray-600' : 'text-gray-400'}>
                        {isOpen ? `${business.opening_time} – ${business.closing_time}` : 'Closed'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

|--------------------------------------------------
*/

import {
	Check,
	ChevronLeft,
	Clock,
	Globe,
	Heart,
	Mail,
	MapPin,
	MessageCircle,
	Package,
	Phone,
	Plus,
	ShoppingCart,
	Star,
	Wrench,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import MetaDataInsert from "../lib/MetaDataInsert";
import { useEffect, useState } from "react";
import data from "../lib/data";
import StarRating from "../components/common/StarRating";
import LoadingSpinner from "../components/common/LoadingSpinner";

const BusinessProfile = () => {
	const { slug } = useParams();

	const [business, setBusiness] = useState(null); // (useState < Business) | (null > null)
	const [isFavorited, setIsFavorited] = useState(false);
	const [activeTab, setActiveTab] = useState(); // (useState < "menu") | "reviews" | ("info" > "menu")
	const [products, setProducts] = useState([]);
	const [addedItems, setAddedItems] = useState(new Set()); // useState < Set < string >> new Set()
	const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
	const [reviews, setReviews] = useState([]);
	const [submittingReview, setSubmittingReview] = useState(false);

	const user = data.dummyUserProfile; // dummy variable

	const coverImage =
		business?.cover_image ||
		`https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800`;

	useEffect(() => {
		if (!slug) return;

		const fetchBusiness = async () => {
			// const { data } = await supabase
			//   .from('businesses')
			//   .select('*, categories(*), profiles(*)')
			//   .eq('slug', slug)
			//   .maybeSingle();
			// if (data) {
			//   setBusiness(data as Business);
			//   await supabase.from('businesses').update({ view_count: (data.view_count || 0) + 1 }).eq('id', data.id);
			//   const [prodRes, revRes] = await Promise.all([
			//     supabase.from('products_services').select('*').eq('business_id', data.id).eq('available', true).order('sort_order'),
			//     supabase.from('reviews').select('*, profiles(full_name, avatar_url)').eq('business_id', data.id).order('created_at', { ascending: false }),
			//   ]);
			//   if (prodRes.data) setProducts(prodRes.data as ProductService[]);
			//   if (revRes.data) setReviews(revRes.data as Review[]);
			//   if (user) {
			//     const { data: fav } = await supabase.from('favorites').select('id').eq('user_id', user.id).eq('business_id', data.id).maybeSingle();
			//     setIsFavorited(!!fav);
			//   }
			// }
			// setLoading(false);

			try {
				// const filterBySlug = data.dummyBusinesses.filter(
				// 	(f) => f.slug === slug,
				// );
				const filterBySlug = data.dummyBusinesses.find(
					(f) => f.slug === slug,
				);
				setBusiness(filterBySlug);
				setProducts(data.dummyProductsServices);
				setReviews(data.dummyReviews);
			} catch (error) {
				console.error(error);
			} finally {
			}
		};

		fetchBusiness();
	}, [slug, user]);

	const toggleFavorite = async () => {
		if (!user || !business) return;
		// if (isFavorited) {
		//   await supabase.from('favorites').delete().eq('user_id', user.id).eq('business_id', business.id);
		// } else {
		//   await supabase.from('favorites').insert({ user_id: user.id, business_id: business.id });
		// }
		// setIsFavorited(!isFavorited);
	};

	const handleAddToCart = (product) => {
		if (!business) return;
		// addItem(product, business.id, business.name);
		// setAddedItems(prev => new Set([...prev, product.id]));
		// setTimeout(() => setAddedItems(prev => { const s = new Set(prev); s.delete(product.id); return s; }), 2000);
	};

	const handleSubmitReview = async () => {
		if (!user || !business || reviewForm.rating === 0) return;
		// setSubmittingReview(true);
		// const { data, error } = await supabase.from('reviews').upsert({
		//   business_id: business.id,
		//   user_id: user.id,
		//   rating: reviewForm.rating,
		//   comment: reviewForm.comment,
		// }, { onConflict: 'business_id,user_id' }).select('*, profiles(full_name, avatar_url)').single();
		// if (!error && data) {
		//   setReviews(prev => [data as Review, ...prev.filter(r => r.user_id !== user.id)]);
		//   setReviewForm({ rating: 0, comment: '' });
		// }
		// setSubmittingReview(false);
	};

	if (!business) {
		return (
			<div className="text-center py-20">
				<p className="text-gray-500 text-lg">Business not found</p>
				<Link
					to="/discover"
					className="mt-4 inline-block text-orange-500 font-medium"
				>
					Browse businesses
				</Link>
			</div>
		);
	}

	return (
		<>
			<MetaDataInsert title={"Business Profile"} />
			<section className="max-w-3xl mx-auto">
				{/* hero */}
				<div className="relative h-52 md:h-72">
					<img
						src={coverImage}
						alt={business.name || "Business"}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
					<Link
						to="/discover"
						className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
					>
						<ChevronLeft size={20} className="text-gray-700" />
					</Link>
					{user && (
						<button
							onClick={toggleFavorite}
							className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
						>
							<Heart
								size={20}
								className={
									isFavorited
										? "fill-red-500 text-red-500"
										: "text-gray-700"
								}
							/>
						</button>
					)}
					<div className="absolute bottom-8 left-4 right-4">
						<h1 className="text-2xl font-extrabold text-white">
							{business.name}
						</h1>
						{business.tagline && (
							<p className="text-white/80 text-sm">
								{business.tagline}
							</p>
						)}
					</div>
				</div>

				{/* business details and 'commentary' */}
				<div className="px-4 pb-8">
					<div className="bg-white rounded-2xl -mt-6 relative shadow-md p-4 mb-4">
						<div className="flex items-start justify-between gap-4">
							<div className="space-y-1.5">
								{business.categories && (
									<span
										className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white"
										style={{
											backgroundColor:
												business.categories.color,
										}}
									>
										{business.categories.name}
									</span>
								)}
								<div className="flex items-center gap-2">
									<StarRating
										rating={business.average_rating}
										size={16}
									/>
									<span className="font-bold text-gray-800">
										{business.average_rating > 0
											? business.average_rating.toFixed(1)
											: "No ratings"}
									</span>
									<span className="text-gray-400 text-sm">
										({business.review_count} reviews)
									</span>
								</div>
								<div className="flex items-center gap-1.5 text-sm text-gray-500">
									<MapPin
										size={14}
										className="text-orange-500"
									/>
									<span>
										{business.location_label}
										{business.floor_unit
											? `, ${business.floor_unit}`
											: ""}
									</span>
								</div>
								<div className="flex items-center gap-1.5 text-sm text-gray-500">
									<Clock
										size={14}
										className="text-green-500"
									/>
									<span>
										{business.opening_time} –{" "}
										{business.closing_time}
									</span>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								{business.phone && (
									<a
										href={`tel:${business.phone}`}
										className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
									>
										<Phone size={14} /> Call
									</a>
								)}
								{business.whatsapp && (
									<a
										href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
									>
										<MessageCircle size={14} /> WhatsApp
									</a>
								)}
							</div>
						</div>
						{business.delivery_available && (
							<div className="mt-3 flex items-center gap-2 bg-blue-50 rounded-xl p-2.5">
								<ShoppingCart
									size={16}
									className="text-blue-500"
								/>
								<span className="text-sm text-blue-700 font-medium">
									Delivery available · KES{" "}
									{business.delivery_fee} fee
								</span>
								{business.min_order > 0 && (
									<span className="text-xs text-blue-500">
										Min order: KES {business.min_order}
									</span>
								)}
							</div>
						)}
					</div>

					<div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-4">
						{["menu", "reviews", "info"].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
									activeTab === tab
										? "bg-white text-gray-900 shadow-sm"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								{tab === "menu" ? "Menu & Services" : tab}
							</button>
						))}
					</div>

					{activeTab === "menu" && (
						<div className="space-y-3">
							{products.length === 0 ? (
								<div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
									<p className="text-gray-500">
										No products or services listed yet.
									</p>
								</div>
							) : (
								<>
									{["product", "service"].map((type) => {
										const items = products.filter(
											(p) => p.type === type,
										);
										if (items.length === 0) return null;
										return (
											<div key={type}>
												<h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2 mb-2">
													{type === "product" ? (
														<Package size={14} />
													) : (
														<Wrench size={14} />
													)}
													{type === "product"
														? "Products"
														: "Services"}
												</h3>
												<div className="space-y-2">
													{items.map((item) => (
														<div
															key={item.id}
															className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3"
														>
															{item.image_url && (
																<img
																	src={
																		item.image_url
																	}
																	alt={
																		item.name
																	}
																	className="w-14 h-14 rounded-lg object-cover shrink-0"
																/>
															)}
															<div className="flex-1 min-w-0">
																<p className="font-semibold text-gray-900 text-sm">
																	{item.name}
																</p>
																{item.description && (
																	<p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
																		{
																			item.description
																		}
																	</p>
																)}
																<p className="font-bold text-orange-500 text-base mt-1">
																	KES{" "}
																	{item.price.toLocaleString()}
																</p>
															</div>
															<button
																onClick={() =>
																	handleAddToCart(
																		item,
																	)
																}
																className={`shrink-0 p-2 rounded-xl transition-all ${
																	addedItems.has(
																		item.id,
																	)
																		? "bg-green-500 text-white"
																		: "bg-orange-500 text-white hover:bg-orange-600"
																}`}
															>
																{addedItems.has(
																	item.id,
																) ? (
																	<Check
																		size={
																			18
																		}
																	/>
																) : (
																	<Plus
																		size={
																			18
																		}
																	/>
																)}
															</button>
														</div>
													))}
												</div>
											</div>
										);
									})}
								</>
							)}
						</div>
					)}

					{activeTab === "reviews" && (
						<div className="space-y-4">
							{user && (
								<div className="bg-white rounded-2xl border border-gray-100 p-4">
									<h3 className="font-bold text-gray-900 mb-3">
										Leave a Review
									</h3>
									<StarRating
										rating={reviewForm.rating}
										size={28}
										interactive
										onChange={(r) =>
											setReviewForm((prev) => ({
												...prev,
												rating: r,
											}))
										}
									/>
									<textarea
										value={reviewForm.comment}
										onChange={(e) =>
											setReviewForm((prev) => ({
												...prev,
												comment: e.target.value,
											}))
										}
										placeholder="Share your experience..."
										rows={3}
										className="w-full mt-3 border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
									/>
									<button
										onClick={handleSubmitReview}
										disabled={
											reviewForm.rating === 0 ||
											submittingReview
										}
										className="mt-2 bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										{submittingReview
											? "Submitting..."
											: "Submit Review"}
									</button>
								</div>
							)}
							{reviews.length === 0 ? (
								<div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
									<Star
										size={32}
										className="text-gray-300 mx-auto mb-2"
									/>
									<p className="text-gray-500">
										No reviews yet. Be the first!
									</p>
								</div>
							) : (
								reviews.map((review) => (
									<div
										key={review.id}
										className="bg-white rounded-2xl border border-gray-100 p-4"
									>
										<div className="flex items-center gap-2 mb-2">
											<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
												<span className="text-orange-600 font-bold text-sm">
													{review.profiles?.full_name?.[0]?.toUpperCase() ||
														"U"}
												</span>
											</div>
											<div>
												<p className="font-semibold text-gray-900 text-sm">
													{review.profiles
														?.full_name || "User"}
												</p>
												<StarRating
													rating={review.rating}
													size={12}
												/>
											</div>
											<span className="ml-auto text-xs text-gray-400">
												{new Date(
													review.created_at,
												).toLocaleDateString()}
											</span>
										</div>
										{review.comment && (
											<p className="text-gray-700 text-sm">
												{review.comment}
											</p>
										)}
										{review.owner_reply && (
											<div className="mt-2 bg-orange-50 rounded-xl p-3">
												<p className="text-xs font-semibold text-orange-700 mb-1">
													Owner replied:
												</p>
												<p className="text-sm text-gray-700">
													{review.owner_reply}
												</p>
											</div>
										)}
									</div>
								))
							)}
						</div>
					)}

					{activeTab === "info" && (
						<div className="space-y-3">
							<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
								<h3 className="font-bold text-gray-900">
									About
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									{business.description ||
										"No description available."}
								</p>
							</div>
							<div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
								<h3 className="font-bold text-gray-900">
									Contact & Location
								</h3>
								{[
									{
										icon: MapPin,
										label: business.address,
										show: !!business.address,
									},
									{
										icon: Phone,
										label: business.phone,
										show: !!business.phone,
									},
									{
										icon: Mail,
										label: business.email,
										show: !!business.email,
									},
									{
										icon: Globe,
										label: business.website,
										show: !!business.website,
									},
								]
									.filter((i) => i.show)
									.map(({ icon: Icon, label }) => (
										<div
											key={label}
											className="flex items-center gap-2 text-sm text-gray-600"
										>
											<Icon
												size={15}
												className="text-orange-500 shrink-0"
											/>
											<span>{label}</span>
										</div>
									))}
							</div>
							<div className="bg-white rounded-2xl border border-gray-100 p-4">
								<h3 className="font-bold text-gray-900 mb-3">
									Opening Hours
								</h3>
								<div className="grid grid-cols-2 gap-y-1.5">
									{data.days.map((day) => {
										const isToday = day === data.today;
										const isOpen =
											business.open_days.includes(day);
										return (
											<div
												key={day}
												className={`flex items-center justify-between col-span-2 py-1 px-2 rounded-lg text-sm ${isToday ? "bg-orange-50" : ""}`}
											>
												<span
													className={`font-medium ${isToday ? "text-orange-600" : "text-gray-700"}`}
												>
													{day}
													{isToday ? " (Today)" : ""}
												</span>
												<span
													className={
														isOpen
															? "text-gray-600"
															: "text-gray-400"
													}
												>
													{isOpen
														? `${business.opening_time} – ${business.closing_time}`
														: "Closed"}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default BusinessProfile;
