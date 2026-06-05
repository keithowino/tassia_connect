import {
	LayoutDashboard,
	MessageSquare,
	Package,
	ShoppingCart,
	Star,
	Store,
	Tags,
	Users,
} from "lucide-react";
import { createContext, useContext, useState } from "react";

const CommonContext = createContext(undefined);

export const CommonProvider = ({ children }) => {
	const [typeOptions, setOptions] = useState([
		"general",
		"deal",
		"announcement",
		"news",
		"wanted",
	]);

	const [typeColors, setTypeColors] = useState({
		deal: "bg-green-100 text-green-700",
		announcement: "bg-blue-100 text-blue-700",
		news: "bg-orange-100 text-orange-700",
		wanted: "bg-red-100 text-red-700",
		general: "bg-gray-100 text-gray-600",
	});

	const [iconMap, setIconMap] = useState({
		restaurant: "UtensilsCrossed",
		food: "UtensilsCrossed",
		cafe: "Coffee",
		salon: "Scissors",
		barber: "Scissors",
		spa: "Wind",
		hardware: "Wrench",
		pharmacy: "Pill",
		clinic: "Stethoscope",
		electronics: "Smartphone",
		clothing: "Shirt",
		grocery: "ShoppingBasket",
		education: "BookOpen",
		automotive: "Car",
	});

	const [colorMap, setColorMap] = useState({
		restaurant: "#f97316",
		food: "#f97316",
		cafe: "#d97706",
		salon: "#ec4899",
		barber: "#ec4899",
		pharmacy: "#10b981",
		clinic: "#10b981",
		electronics: "#6366f1",
		clothing: "#f43f5e",
		grocery: "#22c55e",
		hardware: "#3b82f6",
		education: "#8b5cf6",
		automotive: "#ef4444",
	});

	const [adminNavItems, setAdminNavItems] = useState([
		{
			path: "/admin",
			label: "Overview",
			icon: LayoutDashboard,
			exact: true,
		},
		{ path: "/admin/businesses", label: "Businesses", icon: Store },
		{ path: "/admin/orders", label: "Orders", icon: ShoppingCart },
		{ path: "/admin/products", label: "Products", icon: Package },
		{ path: "/admin/reviews", label: "Reviews", icon: Star },
		{ path: "/admin/community", label: "Community", icon: MessageSquare },
		{ path: "/admin/users", label: "Users", icon: Users },
		{ path: "/admin/categories", label: "Categories", icon: Tags },
	]);

	const getDefaultIconForCategory = (category) => {
		const lowerCategory = category.toLowerCase();
		for (const [key, icon] of Object.entries(iconMap)) {
			if (lowerCategory.includes(key)) {
				return icon;
			}
		}
		return "Store";
	};

	const getDefaultColorForCategory = (category) => {
		const lowerCategory = category.toLowerCase();
		for (const [key, color] of Object.entries(colorMap)) {
			if (lowerCategory.includes(key)) {
				return color;
			}
		}
		return "#6b7280";
	};

	const CommonContextFeatures = {
		typeOptions,
		typeColors,
		getDefaultIconForCategory,
		getDefaultColorForCategory,
		adminNavItems,
	};

	return (
		<CommonContext.Provider value={CommonContextFeatures}>
			{children}
		</CommonContext.Provider>
	);
};

export function useCommon() {
	const ctx = useContext(CommonContext);
	if (!ctx) throw new Error("useCommon must be used within CommonProvider");
	return ctx;
}
