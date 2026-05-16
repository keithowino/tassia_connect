/**
|--------------------------------------------------

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, ShoppingCart, MessageCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const { user } = useAuth();
  const { items, total, cartBusinessName, clearCart } = useCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('pickup');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!user) { navigate('/auth'); return null; }
  if (items.length === 0 && !success) { navigate('/discover'); return null; }

  const handleOrder = async () => {
    if (!businessId || !user) return;
    if (orderType === 'delivery' && !address.trim()) {
      alert('Please enter a delivery address');
      return;
    }
    setLoading(true);

    const { data: order, error } = await supabase.from('orders').insert({
      customer_id: user.id,
      business_id: businessId,
      status: 'pending',
      order_type: orderType,
      total_amount: total,
      delivery_fee: 0,
      delivery_address: address,
      notes,
    }).select().single();

    if (error || !order) { setLoading(false); alert('Failed to place order. Please try again.'); return; }

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    }));

    await supabase.from('order_items').insert(orderItems);
    clearCart();
    setOrderId(order.id);
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-6">Your order has been sent to <strong>{cartBusinessName}</strong>. They'll confirm shortly.</p>
        <div className="bg-orange-50 rounded-2xl p-4 mb-6 text-left">
          <p className="text-sm text-orange-700">Order ID: <span className="font-mono font-bold">{orderId.slice(0, 8).toUpperCase()}</span></p>
          <p className="text-sm text-orange-700 mt-1">Status: <span className="font-bold">Pending</span></p>
        </div>
        <div className="space-y-3">
          <Link to="/orders" className="block w-full bg-orange-500 text-white py-3 rounded-2xl font-bold hover:bg-orange-600 transition-colors">
            Track Order
          </Link>
          <Link to="/discover" className="block w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors">
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <ShoppingCart size={18} className="text-orange-500" /> Your Order
          </h2>
          <p className="text-sm text-gray-500 mb-3">{cartBusinessName}</p>
          {items.map(item => (
            <div key={item.product.id} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-gray-700">{item.product.name} × {item.quantity}</span>
              <span className="text-sm font-semibold text-gray-900">KES {(item.product.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-orange-500 text-lg">KES {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-bold text-gray-900 mb-3">Order Type</h2>
          <div className="flex gap-2">
            {(['pickup', 'delivery'] as const).map(type => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold capitalize transition-all ${
                  orderType === type ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {orderType === 'delivery' && (
            <div className="mt-3 relative">
              <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Delivery address or room number..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-bold text-gray-900 mb-3">Special Instructions</h2>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any special requests or notes..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-base hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Placing Order...' : `Place Order · KES ${total.toLocaleString()}`}
        </button>

        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
          <MessageCircle size={12} /> Business will confirm via WhatsApp/Call
        </p>
      </div>
    </div>
  );
}

|--------------------------------------------------
*/

import React from "react";
import MetaDataInsert from "../lib/MetaDataInsert";

const Checkout = () => {
	return (
		<>
			<MetaDataInsert title="Checkout" />
			<section>Checkout</section>
		</>
	);
};

export default Checkout;
