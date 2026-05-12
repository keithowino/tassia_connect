/**
|--------------------------------------------------

import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, clearCart, cartBusinessName, cartBusinessId } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      setIsOpen(false);
      navigate('/auth');
      return;
    }
    setIsOpen(false);
    navigate(`/checkout/${cartBusinessId}`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-orange-500" />
            <div>
              <h2 className="font-bold text-gray-900">Your Cart</h2>
              {cartBusinessName && <p className="text-xs text-gray-500">{cartBusinessName}</p>}
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
            <ShoppingCart size={48} className="text-gray-300" />
            <p className="text-gray-500 font-medium">Your cart is empty</p>
            <p className="text-gray-400 text-sm">Browse businesses and add items to your cart</p>
            <button onClick={() => setIsOpen(false)} className="mt-2 bg-orange-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors">
              Browse
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  {item.product.image_url && (
                    <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.product.name}</p>
                    <p className="text-orange-500 font-bold text-sm">KES {item.product.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-orange-400 transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Subtotal</span>
                <span className="font-bold text-lg text-gray-900">KES {total.toLocaleString()}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold text-base hover:bg-orange-600 transition-colors"
              >
                Place Order
              </button>
              <button onClick={clearCart} className="w-full flex items-center justify-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
                <Trash2 size={14} />
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}


|--------------------------------------------------
*/

import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";

const CartDrawer = () => {
	const [isOpen, setIsOpen] = useState(false); // dummy variable

	return (
		<>
			<div
				className="fixed inset-0 bg-black/50 z-50"
				onClick={() => setIsOpen(false)}
			/>
			<div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">
				<div className="flex items-center justify-between p-4 border-b border-gray-100">
					<div className="flex items-center gap-2">
						<ShoppingCart size={20} className="text-orange-500" />
						<div>
							<h2 className="font-bold text-gray-900">
								Your Cart
							</h2>
							{/* {cartBusinessName && (
								<p className="text-xs text-gray-500">
									{cartBusinessName}
								</p>
							)} */}
						</div>
					</div>
					<button
						onClick={() => setIsOpen(false)}
						className="p-2 rounded-full hover:bg-gray-100"
					>
						<X size={20} />
					</button>
				</div>

				{/* {items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
						<ShoppingCart size={48} className="text-gray-300" />
						<p className="text-gray-500 font-medium">
							Your cart is empty
						</p>
						<p className="text-gray-400 text-sm">
							Browse businesses and add items to your cart
						</p>
						<button
							onClick={() => setIsOpen(false)}
							className="mt-2 bg-orange-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors"
						>
							Browse
						</button>
					</div>
				) : (
					<>
						<div className="flex-1 overflow-y-auto p-4 space-y-3">
							{items.map((item) => (
								<div
									key={item.product.id}
									className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
								>
									{item.product.image_url && (
										<img
											src={item.product.image_url}
											alt={item.product.name}
											className="w-12 h-12 rounded-lg object-cover shrink-0"
										/>
									)}
									<div className="flex-1 min-w-0">
										<p className="font-medium text-gray-900 text-sm truncate">
											{item.product.name}
										</p>
										<p className="text-orange-500 font-bold text-sm">
											KES{" "}
											{item.product.price.toLocaleString()}
										</p>
									</div>
									<div className="flex items-center gap-1">
										<button
											onClick={() =>
												updateQuantity(
													item.product.id,
													item.quantity - 1,
												)
											}
											className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-orange-400 transition-colors"
										>
											<Minus size={13} />
										</button>
										<span className="w-6 text-center font-bold text-sm">
											{item.quantity}
										</span>
										<button
											onClick={() =>
												updateQuantity(
													item.product.id,
													item.quantity + 1,
												)
											}
											className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
										>
											<Plus size={13} />
										</button>
									</div>
								</div>
							))}
						</div>

						<div className="p-4 border-t border-gray-100 space-y-3">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-gray-700">
									Subtotal
								</span>
								<span className="font-bold text-lg text-gray-900">
									KES {total.toLocaleString()}
								</span>
							</div>
							<button
								onClick={handleCheckout}
								className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold text-base hover:bg-orange-600 transition-colors"
							>
								Place Order
							</button>
							<button
								onClick={clearCart}
								className="w-full flex items-center justify-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
							>
								<Trash2 size={14} />
								Clear Cart
							</button>
						</div>
					</>
				)} */}
			</div>
		</>
	);
};

export default CartDrawer;
