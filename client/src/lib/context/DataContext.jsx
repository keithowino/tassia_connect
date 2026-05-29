// import { createContext, useContext, useState } from "react";

// const DataContext = createContext();

// export const DataProvider = ({ children }) => {
// 	const FALLBACK_IMAGES = {
// 		"food-drinks":
// 			"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
// 		"salon-beauty":
// 			"https://images.pexels.com/photos/3992876/pexels-photo-3992876.jpeg?auto=compress&cs=tinysrgb&w=400",
// 		"hardware-building":
// 			"https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400",
// 		"pharmacy-health":
// 			"https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=400",
// 		"electronics-repair":
// 			"https://images.pexels.com/photos/1482061/pexels-photo-1482061.jpeg?auto=compress&cs=tinysrgb&w=400",
// 		grocery:
// 			"https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=400",
// 		laundry:
// 			"https://images.pexels.com/photos/2254065/pexels-photo-2254065.jpeg?auto=compress&cs=tinysrgb&w=400",
// 		"medical-clinic":
// 			"https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=400",
// 		"street-food":
// 			"https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400",
// 		financial:
// 			"https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400",
// 	};

// 	const dataContextFeatures = {
// 		FALLBACK_IMAGES,
// 	};

// 	return (
// 		<DataContext.Provider value={dataContextFeatures}>
// 			{children}
// 		</DataContext.Provider>
// 	);
// };

// export const useData = () => {
// 	const context = useContext(DataContext);
// 	if (!context) {
// 		throw new Error("useData must be used within a DataProvider");
// 	}
// 	return context;
// };

import { createContext, useContext, useState, useEffect } from "react";
import { businessAPI, productAPI } from "../api";
import { useAuth } from "./AuthContext";

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
	const [businesses, setBusinesses] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();

	const fetchBusinesses = async () => {
		try {
			const response = await businessAPI.getAll();
			setBusinesses(response.data);
		} catch (error) {
			console.error("Error fetching businesses:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBusinesses();
	}, []);

	const getBusinessBySlug = async (slug) => {
		try {
			const response = await businessAPI.getBySlug(slug);
			return response.data;
		} catch (error) {
			console.error("Error fetching business:", error);
			return null;
		}
	};

	const getProductsByBusiness = async (businessId) => {
		try {
			const response = await productAPI.getByBusiness(businessId);
			return response.data;
		} catch (error) {
			console.error("Error fetching products:", error);
			return [];
		}
	};

	return (
		<DataContext.Provider
			value={{
				businesses,
				loading,
				fetchBusinesses,
				getBusinessBySlug,
				getProductsByBusiness,
			}}
		>
			{children}
		</DataContext.Provider>
	);
}

export function useData() {
	const ctx = useContext(DataContext);
	if (!ctx) throw new Error("useData must be used within DataProvider");
	return ctx;
}
