import { createContext, useContext, useState } from "react";
import { CheckCircle, Clock, Package, XCircle } from "lucide-react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const [limit, setLimit] = useState(3);

	const STATUS_CONFIG = {
		pending: {
			label: "Pending",
			color: "bg-yellow-100 text-yellow-700",
			icon: <Clock size={14} />,
		},
		accepted: {
			label: "Accepted",
			color: "bg-blue-100 text-blue-700",
			icon: <CheckCircle size={14} />,
		},
		preparing: {
			label: "Preparing",
			color: "bg-orange-100 text-orange-700",
			icon: <Package size={14} />,
		},
		ready: {
			label: "Ready",
			color: "bg-green-100 text-green-700",
			icon: <CheckCircle size={14} />,
		},
		completed: {
			label: "Completed",
			color: "bg-gray-100 text-gray-600",
			icon: <CheckCircle size={14} />,
		},
		cancelled: {
			label: "Cancelled",
			color: "bg-red-100 text-red-600",
			icon: <XCircle size={14} />,
		},
	};

	const dummyOrders = [
		{
			id: 1,
			status: "pending",
			businesses: {
				logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop",
				name: "Pickaxe & Shovel",
			},
			order_items: [
				{ name: "Phone Charger", quantity: 1 },
				{ name: "USB Cable", quantity: 2 },
				{ name: "Screen Protector", quantity: 1 },
			],
			order_type: "delivery",
			notes: "Call on arrival",
			total_amount: 1000,
			created_at: "2026-05-15T09:30:00",
		},

		{
			id: 2,
			status: "accepted",
			businesses: {
				logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop",
				name: "Savannah Bites",
			},
			order_items: [
				{ name: "Chicken Burger", quantity: 2 },
				{ name: "French Fries", quantity: 1 },
				{ name: "Mango Juice", quantity: 2 },
			],
			order_type: "pickup",
			notes: "Extra ketchup please",
			total_amount: 1650,
			created_at: "2026-05-15T11:45:00",
		},

		{
			id: 3,
			status: "preparing",
			businesses: {
				logo: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400&auto=format&fit=crop",
				name: "Mama Fry Corner",
			},
			order_items: [
				{ name: "Large Chips", quantity: 1 },
				{ name: "Smokie", quantity: 2 },
				{ name: "Sausage", quantity: 2 },
			],
			order_type: "delivery",
			notes: "Less chili",
			total_amount: 550,
			created_at: "2026-05-15T13:15:00",
		},

		{
			id: 4,
			status: "completed",
			businesses: {
				logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400&auto=format&fit=crop",
				name: "Urban Cup Cafe",
			},
			order_items: [
				{ name: "Latte", quantity: 2 },
				{ name: "Chocolate Muffin", quantity: 2 },
				{ name: "Club Sandwich", quantity: 1 },
			],
			order_type: "pickup",
			notes: "",
			total_amount: 1250,
			created_at: "2026-05-14T16:40:00",
		},

		{
			id: 5,
			status: "cancelled",
			businesses: {
				logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop",
				name: "Green Basket Market",
			},
			order_items: [
				{ name: "Milk", quantity: 2 },
				{ name: "Bread", quantity: 1 },
				{ name: "Cooking Oil", quantity: 1 },
			],
			order_type: "delivery",
			notes: "Customer unavailable",
			total_amount: 840,
			created_at: "2026-05-13T18:20:00",
		},
	];

	const dataContextFeatures = {
		limit,
		dummyOrders,
		STATUS_CONFIG,
		setLimit,
	};

	return (
		<DataContext.Provider value={dataContextFeatures}>
			{children}
		</DataContext.Provider>
	);
};

export const useData = () => {
	const context = useContext(DataContext);
	if (!context) {
		throw new Error("useData must be used within a DataProvider");
	}
	return context;
};
