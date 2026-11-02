import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Shop } from '../types/index.ts';
import {
  Search,
  MapPin,
  Clock,
  Phone,
  Compass,
  Store,
  Star,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Filter,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { calculateDistanceKm, formatDistance } from '../utils/geo.ts';
import { handleImageError } from '../utils/imageFallback.ts';
import L from 'leaflet';

export const WarungMap: React.FC = () => {
  const { approvedShops, setSelectedShopForDetails, setActiveTab } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [shopId: string]: L.Marker }>({});

  const [mapSearch, setMapSearch] = useState('');
  const [filterOpenOnly, setFilterOpenOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(15); // km
  const [userLocation] = useState<{ lat: number; lng: number }>({
    lat: -6.2297,
    lng: 106.8558, // Centered near Tebet, South Jakarta
  });
  const [activeShopId, setActiveShopId] = useState<string | null>(null);

  // Filter approved shops by search, open status, and distance
  const filteredShops = approvedShops
    .map((shop) => {
      const distance = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        shop.latitude,
        shop.longitude
      );
      return { ...shop, distanceKm: distance };
    })
    .filter((shop) => {
      const matchSearch =
        shop.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
        shop.address.toLowerCase().includes(mapSearch.toLowerCase()) ||
        shop.city.toLowerCase().includes(mapSearch.toLowerCase());
      const matchOpen = !filterOpenOnly || shop.isOpen;
      const matchDistance = shop.distanceKm <= maxDistance;
      return matchSearch && matchOpen && matchDistance;
    })
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  const activeShop = filteredShops.find((s) => s.id === activeShopId) || filteredShops[0] || null;

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // User location marker
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="background-color: #2563eb; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.6); display: flex; align-items: center; justify-content: center;">
            <div style="background-color: white; width: 6px; height: 6px; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Lokasi Anda Saat Ini</b><br>Tebet, Jakarta Selatan');

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync shop markers on filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    filteredShops.forEach((shop) => {
      const shopIcon = L.divIcon({
        className: 'custom-shop-marker',
        html: `
          <div style="background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%); width: 36px; height: 36px; border-radius: 12px; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(29,78,216,0.35); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
              <path d="M2 7h20"/>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([shop.latitude, shop.longitude], { icon: shopIcon }).addTo(map);

      marker.on('click', () => {
        setActiveShopId(shop.id);
      });

      markersRef.current[shop.id] = marker;
    });
  }, [filteredShops]);

  const handleSelectShop = (shop: Shop & { distanceKm?: number }) => {
    setActiveShopId(shop.id);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([shop.latitude, shop.longitude], 15, { duration: 1.2 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50/40 to-slate-50 py-6 sm:py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Top Control Container matching Reference Screenshot "Store locator" */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/90 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Store Locator & Peta 24 Jam</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
                Peta Warung Madura Terdekat
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Temukan warung resmi terverifikasi dengan stok sembako, tabung gas 3kg, dan aqua galon aktif.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                {filteredShops.length} Warung Terdeteksi
              </span>
            </div>
          </div>

          {/* Top Filter Strip */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 border-t border-slate-100 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari warung, jalan (contoh: Tebet, Benhil, Kemang)..."
                value={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
              />
            </div>

            {/* Radius Selector */}
            <div className="md:col-span-3">
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
              >
                <option value={5}>Radius &lt; 5 km (Terdekat)</option>
                <option value={10}>Radius &lt; 10 km</option>
                <option value={15}>Radius &lt; 15 km</option>
                <option value={25}>Radius &lt; 25 km (Semua Area)</option>
              </select>
            </div>

            {/* Open 24 Hours checkbox */}
            <div className="md:col-span-3 flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 flex-1">
                <input
                  type="checkbox"
                  checked={filterOpenOnly}
                  onChange={(e) => setFilterOpenOnly(e.target.checked)}
                  className="rounded-sm text-blue-600 focus:ring-blue-500"
                />
                <span>Buka 24 Jam</span>
              </label>

              <button
                type="button"
                onClick={() => setMapSearch('')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
              >
                Cari
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Interactive Map (Left) + Store Locator List (Right) matching Screenshot 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden min-h-[640px]">
          {/* Map Container */}
          <div className="lg:col-span-7 xl:col-span-8 relative min-h-[400px] lg:min-h-full">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

            {/* Floating Store Card directly on the Map matching Reference Screenshot */}
            {activeShop && (
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-xs z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200/90 animate-fade-in">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={activeShop.photoUrl}
                    alt={activeShop.name}
                    onError={(e) => handleImageError(e, 'store')}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-0.5">
                      {activeShop.openHours}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                      {activeShop.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">{activeShop.address}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-bold">
                      <span className="text-blue-600 font-black">
                        {formatDistance(activeShop.distanceKm || 0)}
                      </span>
                      <span className="text-amber-500">★ {activeShop.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedShopForDetails(activeShop)}
                    className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Buka Profil
                  </button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeShop.latitude},${activeShop.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>Petunjuk Rute</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Store List Sidebar (Right) matching "Hardware & Co" cards */}
          <div className="lg:col-span-5 xl:col-span-4 p-5 flex flex-col h-full bg-slate-50/60 border-t lg:border-t-0 lg:border-l border-slate-200">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Daftar Warung Terdekat
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                Urutkan berdasarkan jarak
              </span>
            </div>

            {/* Store List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[560px]">
              {filteredShops.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
                  <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-700 text-sm">Tidak Ada Warung</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Coba perbesar radius jarak pencarian di bagian atas.
                  </p>
                </div>
              ) : (
                filteredShops.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => handleSelectShop(shop)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white text-left ${
                      activeShopId === shop.id
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200/90 hover:border-blue-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className="text-sm font-extrabold text-slate-900 truncate">
                            {shop.name}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                          {shop.address}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-600 font-semibold">
                          <span className="inline-flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                            <MapPin className="w-3 h-3" />
                            {formatDistance(shop.distanceKm || 0)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <Clock className="w-3 h-3" />
                            {shop.openHours}
                          </span>
                          <span className="text-amber-500 font-bold">
                            ★ {shop.rating}
                          </span>
                        </div>
                      </div>

                      {/* Action Icons matching Reference Screenshot */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedShopForDetails(shop);
                          }}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                          title="Lihat Katalog Produk Warung"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Buka Rute Navigasi"
                        >
                          <Navigation className="w-4 h-4 text-blue-600" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
