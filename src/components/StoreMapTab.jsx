import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Navigation, Search, Compass, Store, ExternalLink, 
  Tag, CheckCircle2, ShieldCheck, Map as MapIcon 
} from 'lucide-react';
import L from 'leaflet';
import { MANGALORE_STORES } from '../data/defaultData';

// Fix standard Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PRESET_CITIES = [
  { name: 'Mangaluru Central', lat: 12.8698, lng: 74.8430, isDefault: true },
  { name: 'Bengaluru (Koramangala/HSR)', lat: 12.9352, lng: 77.6245 },
  { name: 'Mumbai (Andheri/Bandra)', lat: 19.0760, lng: 72.8777 },
  { name: 'Pune (Viman Nagar)', lat: 18.5679, lng: 73.9143 }
];

export default function StoreMapTab() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  const [currentCity, setCurrentCity] = useState(PRESET_CITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState(MANGALORE_STORES);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCity.lat, currentCity.lng],
        zoom: 14,
        zoomControl: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background-color: #10b981; width: 26px; height: 26px; border-radius: 50%; border: 3px solid #0f172a; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 12px;">🏪</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    stores.forEach((store) => {
      const marker = L.marker([store.lat, store.lng], { icon: customIcon });
      
      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 170px;">
          <b style="color: #10b981; font-size: 13px;">${store.name}</b><br/>
          <span style="color: #94a3b8;">${store.area}</span><br/>
          <div style="margin-top: 5px; padding: 4px; background: rgba(255,255,255,0.06); border-radius: 4px;">
            <b style="color: #38bdf8;">Specialty:</b> ${store.specialty}<br/>
            <b style="color: #34d399;">Price:</b> ${store.pricingTier}
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.area)}" target="_blank" style="display: inline-block; margin-top: 5px; color: #10b981; text-decoration: underline; font-weight: bold;">Open in Maps &rarr;</a>
        </div>
      `;
      marker.bindPopup(popupContent);
      marker.on('click', () => setSelectedStore(store));
      markersGroupRef.current.addLayer(marker);
    });

    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `<div style="background-color: #0284c7; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px #0284c7; display: flex; align-items: center; justify-content: center; font-size: 10px;">📍</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup('<b>You are here</b>');
      markersGroupRef.current.addLayer(userMarker);
    }
  }, [stores, userLocation]);

  const handleSelectCity = (city) => {
    setCurrentCity(city);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([city.lat, city.lng], 14);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = { lat: latitude, lng: longitude, name: 'Current Location' };
        setUserLocation(loc);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
        }
      },
      (err) => {
        alert('Could not retrieve GPS location: ' + err.message);
      }
    );
  };

  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', India')}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const first = data[0];
        const newCoords = {
          lat: parseFloat(first.lat),
          lng: parseFloat(first.lon),
          name: first.display_name.split(',')[0]
        };
        setCurrentCity(newCoords);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newCoords.lat, newCoords.lng], 14);
        }
      } else {
        alert('Location not found. Try searching with city name.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to search location.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      {/* 1. Map Header */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Location-Based Grocery Filter
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Local Stores & Wholesale Spots</h2>
            <p className="text-xs text-slate-400">Verified spots for Nandini milk, bulk soya chunks, raw peanuts & bananas</p>
          </div>

          <button
            onClick={handleLocateMe}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Use My GPS</span>
          </button>
        </div>

        {/* Relocation Switcher */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 md:pb-0">
            <span className="text-slate-500 text-[11px] shrink-0 mr-1 flex items-center gap-1">
              <MapIcon className="w-3 h-3" /> City:
            </span>
            {PRESET_CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => handleSelectCity(c)}
                className={`px-2.5 py-1 rounded-md text-xs transition shrink-0 ${
                  currentCity.name === c.name
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleCitySearch} className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder="Search other city in India..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-52 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition"
            >
              {isSearching ? '...' : <Search className="w-3 h-3" />}
            </button>
          </form>
        </div>
      </section>

      {/* 2. Interactive Map */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-sm overflow-hidden">
        <div 
          ref={mapContainerRef} 
          className="w-full h-72 sm:h-80 rounded-xl relative z-10"
        />
        <div className="px-3 py-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Click any pin to inspect pricing and specialty</span>
          <span className="text-emerald-400 font-medium">Mangalore Central: Hampankatta / Falnir / Attavar</span>
        </div>
      </section>

      {/* 3. Stores List */}
      <section className="space-y-3">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Store className="w-4 h-4 text-emerald-400" />
          Recommended Physical Stores in Central Mangaluru
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stores.map((store) => (
            <div 
              key={store.id} 
              className={`p-3.5 rounded-xl border transition-all ${
                selectedStore?.id === store.id 
                  ? 'bg-emerald-500/10 border-emerald-500/50' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{store.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {store.area}
                  </p>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                  {store.pricingTier}
                </span>
              </div>

              <div className="mt-2.5 space-y-1 text-xs">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-semibold">Specialty: </span>
                  <span className="text-slate-300">{store.specialty}</span>
                </div>
                <p className="text-slate-500 text-[11px] italic">{store.notes}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">{store.type}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.area)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
