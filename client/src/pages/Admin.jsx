/**
|--------------------------------------------------

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle, XCircle, Eye, Star, Store, Users, MessageSquare, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Business, Review, CommunityPost } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

type Tab = 'businesses' | 'reviews' | 'community';

export default function AdminPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('businesses');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ businesses: 0, users: 0, orders: 0, reviews: 0 });

  useEffect(() => {
    if (profile && profile.role !== 'admin') { navigate('/'); return; }
    if (!profile) return;
    fetchAll();
  }, [profile, navigate]);

  const fetchAll = async () => {
    setLoading(true);
    const [bizRes, revRes, postRes, userCount, bizCount, orderCount, revCount] = await Promise.all([
      supabase.from('businesses').select('*, categories(*), profiles(full_name, phone)').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*, profiles(full_name), businesses(name)').order('created_at', { ascending: false }),
      supabase.from('community_posts').select('*, profiles(full_name)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
    ]);
    if (bizRes.data) setBusinesses(bizRes.data as Business[]);
    if (revRes.data) setReviews(revRes.data as Review[]);
    if (postRes.data) setPosts(postRes.data as CommunityPost[]);
    setStats({
      businesses: bizCount.count || 0,
      users: userCount.count || 0,
      orders: orderCount.count || 0,
      reviews: revCount.count || 0,
    });
    setLoading(false);
  };

  const updateBusinessStatus = async (id: string, status: string) => {
    await supabase.from('businesses').update({ status }).eq('id', id);
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: status as Business['status'] } : b));
  };

  const togglePin = async (postId: string, pinned: boolean) => {
    await supabase.from('community_posts').update({ pinned: !pinned }).eq('id', postId);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, pinned: !pinned } : p));
  };

  const deleteReview = async (reviewId: string) => {
    if (!window.confirm('Delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', reviewId);
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  if (!profile || profile.role !== 'admin') return null;

  const STAT_ITEMS = [
    { icon: <Store size={20} className="text-orange-500" />, label: 'Active Businesses', value: stats.businesses },
    { icon: <Users size={20} className="text-blue-500" />, label: 'Total Users', value: stats.users },
    { icon: <Star size={20} className="text-amber-500" />, label: 'Total Reviews', value: stats.reviews },
    { icon: <MessageSquare size={20} className="text-green-500" />, label: 'Total Orders', value: stats.orders },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck size={22} className="text-orange-500" /> Admin Panel
        </h1>
        <button onClick={fetchAll} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <RefreshCw size={18} className="text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAT_ITEMS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-3 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="font-extrabold text-gray-900 text-xl">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
        {(['businesses', 'reviews', 'community'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : (
        <>
          {tab === 'businesses' && (
            <div className="space-y-3">
              {businesses.map(biz => (
                <div key={biz.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{biz.name}</p>
                      <p className="text-xs text-gray-500">{biz.categories?.name} · {biz.location_label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Owner: {(biz.profiles as { full_name?: string } | undefined)?.full_name || 'Unknown'} · {new Date(biz.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Eye size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{biz.view_count} views</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                        biz.status === 'approved' ? 'bg-green-100 text-green-700' :
                        biz.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-600'
                      }`}>{biz.status}</span>
                      {biz.status !== 'approved' && (
                        <button onClick={() => updateBusinessStatus(biz.id, 'approved')} className="flex items-center gap-0.5 text-xs text-green-600 font-medium hover:text-green-800">
                          <CheckCircle size={13} /> Approve
                        </button>
                      )}
                      {biz.status !== 'rejected' && (
                        <button onClick={() => updateBusinessStatus(biz.id, 'rejected')} className="flex items-center gap-0.5 text-xs text-red-500 font-medium hover:text-red-700">
                          <XCircle size={13} /> Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{review.profiles?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500">on {(review as Review & { businesses?: { name: string } }).businesses?.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      {review.comment && <p className="text-sm text-gray-600 mt-1">{review.comment}</p>}
                      <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteReview(review.id)} className="text-xs text-red-500 hover:text-red-700 font-medium ml-2">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'community' && (
            <div className="space-y-3">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{post.title}</p>
                      <p className="text-xs text-gray-500">{post.profiles?.full_name} · {new Date(post.created_at).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                    </div>
                    <button
                      onClick={() => togglePin(post.id, post.pinned)}
                      className={`ml-2 text-xs font-medium shrink-0 ${post.pinned ? 'text-orange-500 hover:text-orange-700' : 'text-gray-400 hover:text-orange-500'}`}
                    >
                      {post.pinned ? 'Unpin' : 'Pin'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}


|--------------------------------------------------
*/

import MetaDataInsert from "../lib/MetaDataInsert";

const Admin = () => {
	return (
		<>
			<MetaDataInsert title="Admin" />
			<section className="admin">Admin</section>
		</>
	);
};

export default Admin;
