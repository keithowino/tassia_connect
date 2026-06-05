import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker for verified businesses (gold)
const verifiedIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

// Regular marker (orange)
const defaultIcon = new L.Icon({
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

// Component to auto-fit map bounds to show all markers
const FitBounds = ({ businesses }) => {
	const map = useMap();

	useEffect(() => {
		const validBusinesses = businesses.filter(
			(b) => b.location?.coordinates?.lat && b.location?.coordinates?.lng,
		);
		if (validBusinesses.length > 0) {
			const bounds = L.latLngBounds(
				validBusinesses.map((b) => [
					b.location.coordinates.lat,
					b.location.coordinates.lng,
				]),
			);
			map.fitBounds(bounds, { padding: [50, 50] });
		} else {
			// Default to Tassia area
			map.setView([-1.2921, 36.8219], 14);
		}
	}, [businesses, map]);

	return null;
};

export default function MapView({
	businesses,
	onSelectBusiness,
	height = "500px",
}) {
	const [hoveredBusiness, setHoveredBusiness] = useState(null);

	// Filter businesses that have coordinates
	const businessesWithLocation = businesses.filter(
		(b) => b.location?.coordinates?.lat && b.location?.coordinates?.lng,
	);

	if (businessesWithLocation.length === 0) {
		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
				<div className="text-6xl mb-4">🗺️</div>
				<h3 className="text-lg font-semibold text-yellow-800 mb-2">
					No locations on map yet
				</h3>
				<p className="text-yellow-700 mb-4">
					Businesses haven't added their map locations yet.
				</p>
			</div>
		);
	}

	// Tassia Complex center coordinates
	const center = [-1.2921, 36.8219];

	return (
		<div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
			<div className="bg-white p-3 border-b border-gray-100 flex justify-between items-center">
				<div className="flex items-center gap-4 text-sm">
					<div className="flex items-center gap-1.5">
						<div className="w-3 h-3 bg-orange-500 rounded-full"></div>
						<span className="text-gray-600">Regular Business</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="w-3 h-3 bg-amber-500 rounded-full"></div>
						<span className="text-gray-600">Verified Business</span>
					</div>
				</div>
				<p className="text-xs text-gray-400">
					{businessesWithLocation.length} businesses on map
				</p>
			</div>

			<MapContainer
				center={center}
				zoom={13}
				style={{ height, width: "100%" }}
				className="z-0"
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{businessesWithLocation.map((business) => (
					<Marker
						key={business._id}
						position={[
							business.location.coordinates.lat,
							business.location.coordinates.lng,
						]}
						icon={business.isVerified ? verifiedIcon : defaultIcon}
						// eventHandlers={{
						// 	click: () => {
						// 		if (onSelectBusiness)
						// 			onSelectBusiness(business);
						// 	},
						// 	mouseover: () => setHoveredBusiness(business),
						// 	mouseout: () => setHoveredBusiness(null),
						// }}
					>
						<Popup>
							<div className="min-w-[220px] max-w-xs">
								<div className="flex items-start justify-between gap-2">
									<h3 className="font-bold text-gray-900 text-sm">
										{business.businessName}
									</h3>
									{business.isVerified && (
										<span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
											✓ Verified
										</span>
									)}
								</div>
								<p className="text-xs text-gray-500 mt-1">
									{business.category}
								</p>
								<p className="text-xs text-gray-400 mt-1">
									{business.location?.location_label ||
										business.location?.address}
								</p>
								{business.tagline && (
									<p className="text-xs text-gray-600 mt-2 italic">
										"{business.tagline}"
									</p>
								)}
								<div className="mt-3 space-y-2">
									{business.phone && (
										<a
											href={`tel:${business.phone}`}
											className="block bg-orange-500 text-white text-center py-1.5 rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
										>
											📞 Call {business.phone}
										</a>
									)}
									<button
										onClick={() => {
											if (onSelectBusiness) {
												onSelectBusiness(business);
											}
											// Close popup
											const closeButton =
												document.querySelector(
													".leaflet-popup-close-button",
												);
											if (closeButton)
												closeButton.click();
										}}
										className="w-full bg-gray-800 text-white py-1.5 rounded-lg text-xs font-medium hover:bg-gray-900 transition-colors"
									>
										View Business Details
									</button>
								</div>
							</div>
						</Popup>
					</Marker>
				))}

				<FitBounds businesses={businesses} />
			</MapContainer>
		</div>
	);
}
