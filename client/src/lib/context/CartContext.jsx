import { createContext, useContext, useState, useEffect } from "react";
import { orderAPI } from "../api";

const CartContext = createContext(undefined);

// Load cart from localStorage
const loadCartFromStorage = () => {
	try {
		const savedCart = localStorage.getItem("tassia_cart");
		if (savedCart) {
			return JSON.parse(savedCart);
		}
	} catch (error) {
		console.error("Error loading cart from storage:", error);
	}
	return { items: [], cartBusinessId: null, cartBusinessName: "" };
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
	try {
		localStorage.setItem("tassia_cart", JSON.stringify(cart));
	} catch (error) {
		console.error("Error saving cart to storage:", error);
	}
};

export function CartProvider({ children }) {
	const [items, setItems] = useState([]);
	const [cartBusinessId, setCartBusinessId] = useState(null);
	const [cartBusinessName, setCartBusinessName] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Load cart from localStorage on mount
	useEffect(() => {
		const savedCart = loadCartFromStorage();
		setItems(savedCart.items || []);
		setCartBusinessId(savedCart.cartBusinessId || null);
		setCartBusinessName(savedCart.cartBusinessName || "");
	}, []);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		saveCartToStorage({ items, cartBusinessId, cartBusinessName });
	}, [items, cartBusinessId, cartBusinessName]);

	const addItem = (product, businessId, businessName) => {
		// Use MongoDB _id
		const productId = product._id || product.id;

		if (cartBusinessId && cartBusinessId !== businessId) {
			if (
				!window.confirm(
					"Your cart has items from another business. Clear cart and add new item?",
				)
			)
				return;
			setItems([]);
			setCartBusinessId(null);
			setCartBusinessName("");
		}

		setCartBusinessId(businessId);
		setCartBusinessName(businessName);
		setItems((prev) => {
			const existing = prev.find(
				(i) => (i.product._id || i.product.id) === productId,
			);
			if (existing) {
				return prev.map((i) =>
					(i.product._id || i.product.id) === productId
						? { ...i, quantity: i.quantity + 1 }
						: i,
				);
			}
			return [
				...prev,
				{
					product: { ...product, _id: productId },
					quantity: 1,
					businessId,
					businessName,
				},
			];
		});
		// setIsOpen(true);
	};

	const removeItem = (productId) => {
		setItems((prev) => {
			const updated = prev.filter(
				(i) => (i.product._id || i.product.id) !== productId,
			);
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
				(i.product._id || i.product.id) === productId
					? { ...i, quantity }
					: i,
			),
		);
	};

	const clearCart = () => {
		if (window.confirm("Clear all items from your cart?")) {
			setItems([]);
			setCartBusinessId(null);
			setCartBusinessName("");
		}
	};

	const createOrder = async (deliveryDetails, paymentMethod) => {
		if (!cartBusinessId || items.length === 0) {
			setError("Cart is empty");
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const orderData = {
				businessId: cartBusinessId,
				items: items.map((item) => ({
					productId: item.product._id || item.product.id,
					name: item.product.name,
					price: item.product.price,
					quantity: item.quantity,
				})),
				subtotal: total,
				tax: total * 0.16,
				deliveryFee: deliveryDetails.type === "delivery" ? 50 : 0,
				total:
					total +
					total * 0.16 +
					(deliveryDetails.type === "delivery" ? 50 : 0),
				deliveryAddress: {
					type: deliveryDetails.type,
					address: deliveryDetails.address,
					floorUnit: deliveryDetails.floor_unit,
					instructions: deliveryDetails.instructions,
					notes: deliveryDetails.notes,
				},
				paymentMethod: paymentMethod,
				specialInstructions: deliveryDetails.notes,
			};

			const response = await orderAPI.create(orderData);
			clearCart();
			setIsOpen(false);
			return response.data;
		} catch (error) {
			console.error("Error creating order:", error);
			setError(error.response?.data?.message || "Failed to create order");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const total = items.reduce(
		(sum, i) => sum + (i.product.price || 0) * i.quantity,
		0,
	);
	const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

	return (
		<CartContext.Provider
			value={{
				items,
				cartBusinessId,
				cartBusinessName,
				addItem,
				removeItem,
				updateQuantity,
				clearCart,
				createOrder,
				total,
				itemCount,
				isOpen,
				setIsOpen,
				loading,
				error,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used within CartProvider");
	return ctx;
}
