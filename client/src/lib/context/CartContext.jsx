import { createContext, useContext, useState } from "react";

// const CartContext = createContext(undefined);
const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [items, setItems] = useState([]);
	const [cartBusinessId, setCartBusinessId] = useState(null);
	const [cartBusinessName, setCartBusinessName] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const addItem = (product, businessId, businessName) => {
		if (cartBusinessId && cartBusinessId !== businessId) {
			if (
				!window.confirm(
					"Your cart has items from another business. Clear cart and add new item?",
				)
			)
				return;
			setItems([]);
			setCartBusinessId(null);
		}

		setCartBusinessId(businessId);
		setCartBusinessName(businessName);
		setItems((prev) => {
			const existing = prev.find((i) => i.product.id === product.id);
			if (existing) {
				return prev.map((i) =>
					i.product.id === product.id
						? { ...i, quantity: i.quantity + 1 }
						: i,
				);
			}
			return [
				...prev,
				{ product, quantity: 1, businessId, businessName },
			];
		});
		setIsOpen(true);
	};

	const removeItem = (productId) => {
		setItems((prev) => {
			const updated = prev.filter((i) => i.product.id !== productId);
			if (updated.length === 0) {
				setCartBusinessId(null);
				setCartBusinessName("");
			}
			return updated;
		});
	};

	const updateQuantity = (productId, quantity) => {
		if (quantity <= 0) {
			removeItem(productId);
			return;
		}
		setItems((prev) =>
			prev.map((i) =>
				i.product.id === productId ? { ...i, quantity } : i,
			),
		);
	};

	const clearCart = () => {
		setItems([]);
		setCartBusinessId(null);
		setCartBusinessName("");
	};

	const total = items.reduce(
		(sum, i) => sum + i.product.price * i.quantity,
		0,
	);
	const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

	const CartContextFeatures = {
		items,
		cartBusinessId,
		cartBusinessName,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		total,
		itemCount,
		isOpen,
		setIsOpen,
	};

	return (
		<CartContext.Provider value={CartContextFeatures}>
			{children}
		</CartContext.Provider>
	);
};

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used within CartProvider");
	return ctx;
}
