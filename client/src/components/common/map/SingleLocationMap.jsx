import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom large marker for single business
const businessIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

export default function SingleLocationMap({ business, height = "300px" }) {
	const coordinates = business?.location?.coordinates;

	if (!coordinates?.lat || !coordinates?.lng) {
		return (
			<div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center">
				<div className="text-4xl mb-3">📍</div>
				<p className="text-sm text-gray-500">Location not specified</p>
				<p className="text-xs text-gray-400 mt-1">
					{business?.location?.address ||
						"Contact business for directions"}
				</p>
			</div>
		);
	}

	const center = [coordinates.lat, coordinates.lng];

	return (
		<div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
			<MapContainer
				center={center}
				zoom={16}
				style={{ height, width: "100%" }}
				className="z-0"
				zoomControl={true}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<Marker position={center} icon={businessIcon}>
					<Popup>
						<div className="min-w-[180px]">
							<h3 className="font-bold text-gray-900 text-sm">
								{business.businessName}
							</h3>
							<p className="text-xs text-gray-500 mt-1">
								{business.location?.address}
							</p>
							{business.phone && (
								<a
									href={`tel:${business.phone}`}
									className="block mt-2 bg-orange-500 text-white text-center py-1 rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
								>
									📞 Call Now
								</a>
							)}
						</div>
					</Popup>
				</Marker>
			</MapContainer>

			{/* Location details below map */}
			<div className="bg-white p-3 border-t border-gray-100">
				<div className="flex items-start gap-2 text-sm">
					<span className="text-orange-500 mt-0.5">📍</span>
					<div>
						<p className="text-gray-700 font-medium">Address</p>
						<p className="text-gray-500 text-sm">
							{business.location?.address}
							{business.location?.floor_unit &&
								`, ${business.location.floor_unit}`}
						</p>
					</div>
				</div>
				<button
					onClick={() => {
						const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
						window.open(url, "_blank");
					}}
					className="mt-3 w-full bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
				>
					🧭 Get Directions
				</button>
			</div>
		</div>
	);
}
