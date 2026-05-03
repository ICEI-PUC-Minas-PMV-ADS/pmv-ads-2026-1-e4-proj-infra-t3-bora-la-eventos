"use client";

import { useEffect, useRef, useState } from "react";
import type {
	Map as LeafletMap,
	Marker as LeafletMarker,
	Icon as LeafletIcon,
	LeafletMouseEvent,
} from "leaflet";
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

type LeafletContainer = HTMLDivElement & { _leaflet_id?: number };

const BRAZIL_CENTER_LAT = -15.7801;
const BRAZIL_CENTER_LNG = -47.9292;
const DEFAULT_MAP_ZOOM = 4;
const SELECTED_LOCATION_ZOOM = 15;
const NOMINATIM_MAX_RESULTS = 5;

const MARKER_ICON_SIZE: [number, number] = [25, 41];
const MARKER_ICON_ANCHOR: [number, number] = [12, 41];
const MARKER_POPUP_ANCHOR: [number, number] = [1, -34];
const MARKER_SHADOW_SIZE: [number, number] = [41, 41];

export default function EventLocationMap({ onLocationSelect, initialLat, initialLng }: Props) {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<LeafletMap | null>(null);
	const markerRef = useRef<LeafletMarker | null>(null);
	const leafletRef = useRef<typeof import("leaflet") | null>(null);
	const defaultIconRef = useRef<LeafletIcon | null>(null);

	const [query, setQuery] = useState("");
	const [results, setResults] = useState<NominatimResult[]>([]);
	const [searching, setSearching] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState("");

	useEffect(() => {
		if (typeof window === "undefined" || mapInstanceRef.current) return;

		import("leaflet").then((leaflet) => {
			leafletRef.current = leaflet;

			const defaultIcon = leaflet.icon({
				iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
				iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
				shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
				iconSize: MARKER_ICON_SIZE,
				iconAnchor: MARKER_ICON_ANCHOR,
				popupAnchor: MARKER_POPUP_ANCHOR,
				shadowSize: MARKER_SHADOW_SIZE,
			});
			defaultIconRef.current = defaultIcon;

			const defaultLat = initialLat ?? BRAZIL_CENTER_LAT;
			const defaultLng = initialLng ?? BRAZIL_CENTER_LNG;

			const map = leaflet
				.map(mapContainerRef.current!)
				.setView([defaultLat, defaultLng], initialLat ? SELECTED_LOCATION_ZOOM : DEFAULT_MAP_ZOOM);

			leaflet
				.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
					attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				})
				.addTo(map);

			if (initialLat && initialLng) {
				markerRef.current = leaflet
					.marker([initialLat, initialLng], { icon: defaultIcon })
					.addTo(map);
			}

			map.on("click", (event: LeafletMouseEvent) => {
				placeMarker(event.latlng.lat, event.latlng.lng);
				reverseGeocode(event.latlng.lat, event.latlng.lng);
			});

			mapInstanceRef.current = map;
		});

		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
			if (mapContainerRef.current) {
				delete (mapContainerRef.current as LeafletContainer)._leaflet_id;
			}
		};
	}, []);

	function placeMarker(lat: number, lng: number) {
		if (!leafletRef.current || !mapInstanceRef.current) return;
		if (markerRef.current) markerRef.current.remove();
		const icon = defaultIconRef.current ?? undefined;
		markerRef.current = leafletRef.current
			.marker([lat, lng], icon ? { icon } : {})
			.addTo(mapInstanceRef.current);
		mapInstanceRef.current.setView([lat, lng], SELECTED_LOCATION_ZOOM);
	}

	async function reverseGeocode(lat: number, lng: number) {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
				{ headers: { "Accept-Language": "pt-BR" } },
			);
			const data: NominatimResult = await response.json();
			setSelectedAddress(data.display_name ?? "");
			onLocationSelect(lat, lng, extractAddressParts(data));
		} catch {
			onLocationSelect(lat, lng, { street: "", number: "", city: "", state: "", zipCode: "" });
		}
	}

	function extractAddressParts(result: NominatimResult): AddressParts {
		const address = result.address ?? {};
		return {
			street: address.road ?? "",
			number: address.house_number ?? "",
			city: address.city ?? address.town ?? address.village ?? "",
			state: address.state ?? "",
			zipCode: address.postcode ?? "",
		};
	}

	async function handleSearch() {
		if (!query.trim()) return;
		setSearching(true);
		setResults([]);
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=${NOMINATIM_MAX_RESULTS}`,
				{ headers: { "Accept-Language": "pt-BR" } },
			);
			const data: NominatimResult[] = await response.json();
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
		placeMarker(lat, lng);
		onLocationSelect(lat, lng, extractAddressParts(result));
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2">
				<div className="relative flex-1">
					<MapPin
						size={15}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
					/>
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

			{results.length > 0 && (
				<ul className="border border-gray-200 rounded-lg bg-white shadow-sm divide-y divide-gray-100 text-sm max-h-48 overflow-auto">
					{results.map((result, index) => (
						<li key={index}>
							<button
								type="button"
								onClick={() => handleSelectResult(result)}
								className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-600 transition-colors"
							>
								{result.display_name}
							</button>
						</li>
					))}
				</ul>
			)}

			<div className="relative isolate h-64 w-full rounded-lg border border-gray-200 overflow-hidden">
				<div ref={mapContainerRef} className="absolute inset-0" />
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
