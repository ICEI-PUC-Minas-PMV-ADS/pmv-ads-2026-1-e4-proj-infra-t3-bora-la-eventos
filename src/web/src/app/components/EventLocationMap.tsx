"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";

interface AddressParts {
	street: string;
	number: string;
	city: string;
	state: string;
	zipCode: string;
}

interface Props {
	onLocationSelect: (lat: number, lng: number, address: AddressParts) => void;
	initialLat?: number;
	initialLng?: number;
}

interface NominatimResult {
	lat: string;
	lon: string;
	display_name: string;
	address: {
		road?: string;
		house_number?: string;
		city?: string;
		town?: string;
		village?: string;
		state?: string;
		postcode?: string;
	};
}

export default function EventLocationMap({ onLocationSelect, initialLat, initialLng }: Props) {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<any>(null);
	const markerRef = useRef<any>(null);

	const [query, setQuery] = useState("");
	const [results, setResults] = useState<NominatimResult[]>([]);
	const [searching, setSearching] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState("");

	useEffect(() => {
		if (typeof window === "undefined" || mapInstanceRef.current) return;

		import("leaflet").then((L) => {
			// Fix default icon paths broken by webpack
			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
				iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
				shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
			});

			const defaultLat = initialLat ?? -15.7801;
			const defaultLng = initialLng ?? -47.9292;

			const map = L.map(mapRef.current!).setView([defaultLat, defaultLng], initialLat ? 15 : 4);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(map);

			if (initialLat && initialLng) {
				markerRef.current = L.marker([initialLat, initialLng]).addTo(map);
			}

			map.on("click", (e: any) => {
				const { lat, lng } = e.latlng;
				placeMarker(L, map, lat, lng);
				reverseGeocode(lat, lng);
			});

			mapInstanceRef.current = map;
		});

		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
			// Leaflet does not always remove _leaflet_id from the DOM element,
			// which causes "Map container is already initialized" on StrictMode re-mount
			if (mapRef.current) {
				delete (mapRef.current as any)._leaflet_id;
			}
		};
	}, []);

	function placeMarker(L: any, map: any, lat: number, lng: number) {
		if (markerRef.current) markerRef.current.remove();
		markerRef.current = L.marker([lat, lng]).addTo(map);
		map.setView([lat, lng], 15);
	}

	async function reverseGeocode(lat: number, lng: number) {
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
				{ headers: { "Accept-Language": "pt-BR" } },
			);
			const data = await res.json();
			const parts = extractAddressParts(data);
			setSelectedAddress(data.display_name ?? "");
			onLocationSelect(lat, lng, parts);
		} catch {
			onLocationSelect(lat, lng, { street: "", number: "", city: "", state: "", zipCode: "" });
		}
	}

	function extractAddressParts(data: NominatimResult): AddressParts {
		const a = data.address ?? {};
		return {
			street: a.road ?? "",
			number: a.house_number ?? "",
			city: a.city ?? a.town ?? a.village ?? "",
			state: a.state ?? "",
			zipCode: a.postcode ?? "",
		};
	}

	async function handleSearch() {
		if (!query.trim()) return;
		setSearching(true);
		setResults([]);
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
				{ headers: { "Accept-Language": "pt-BR" } },
			);
			const data: NominatimResult[] = await res.json();
			setResults(data);
		} catch {
			setResults([]);
		} finally {
			setSearching(false);
		}
	}

	function handleSelectResult(result: NominatimResult) {
		const lat = parseFloat(result.lat);
		const lng = parseFloat(result.lon);
		setResults([]);
		setQuery(result.display_name);
		setSelectedAddress(result.display_name);

		import("leaflet").then((L) => {
			if (mapInstanceRef.current) {
				placeMarker(L, mapInstanceRef.current, lat, lng);
			}
		});

		const parts = extractAddressParts(result);
		onLocationSelect(lat, lng, parts);
	}

	return (
		<div className="flex flex-col gap-2">
			{/* Search bar */}
			<div className="flex gap-2">
				<div className="relative flex-1">
					<MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
						placeholder="Pesquisar endereço ou cidade..."
						className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all placeholder:text-gray-400"
					/>
				</div>
				<button
					type="button"
					onClick={handleSearch}
					disabled={searching}
					className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors disabled:opacity-50"
				>
					{searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
					Buscar
				</button>
			</div>

			{/* Search results dropdown */}
			{results.length > 0 && (
				<ul className="border border-gray-200 rounded-lg bg-white shadow-sm divide-y divide-gray-100 text-sm max-h-48 overflow-auto">
					{results.map((r, i) => (
						<li key={i}>
							<button
								type="button"
								onClick={() => handleSelectResult(r)}
								className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-600 transition-colors"
							>
								{r.display_name}
							</button>
						</li>
					))}
				</ul>
			)}

			{/* Map */}
			<div className="relative isolate h-64 w-full rounded-lg border border-gray-200 overflow-hidden">
				<div ref={mapRef} className="absolute inset-0" />
			</div>

			{selectedAddress && (
				<p className="text-xs text-gray-500 flex items-center gap-1">
					<MapPin size={12} className="text-orange-500 shrink-0" />
					{selectedAddress}
				</p>
			)}
		</div>
	);
}
