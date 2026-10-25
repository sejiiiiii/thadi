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
        attribution: '&copy; OpenStreetMap &copy; CARTO',
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
      html: `<div style="background-color: #10b981; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #090b10; box-shadow: 0 4px 12px rgba(16,185,129,0.5); display: flex; align-items: center; justify-content: center; font-size: 13px;">🏪</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    stores.forEach((store) => {
      const marker = L.marker([store.lat, store.lng], { icon: customIcon });
      
      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 170px;">
          <b style="color: #10b981; font-size: 13px;">${store.name}</b><br/>
          <span style="color: #64748b;">${store.area}</span><br/>
          <div style="margin-top: 5px; padding: 4px; background: rgba(0,0,0,0.06); border-radius: 4px;">
            <b>Specialty:</b> ${store.specialty}<br/>
            <b>Price:</b> ${store.pricingTier}
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
        html: `<div style="background-color: #0284c7; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px #0284c7; display: flex; align-items: center; justify-content: center; font-size: 11px;">📍</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup('<b>Your Current Location</b>');
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
    <div className="space-y-4">
      {/* 1. Header Card (Double Bezel) */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Mangaluru Central Map
              </span>
              <h3 className="font-extrabold text-sm text-white mt-1">Local Wholesale & Grocery Spots</h3>
            </div>
            <button
              onClick={handleLocateMe}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/[0.08] text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>GPS</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Verified spots for Nandini milk, bulk soya chunks, raw peanuts & bananas in Hampankatta, Falnir, Attavar.
          </p>

          {/* Relocation Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 pb-0.5">
            {PRESET_CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => handleSelectCity(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 active:scale-95 ${
                  currentCity.name === c.name
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Map Container */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md overflow-hidden">
        <div 
          ref={mapContainerRef} 
          className="w-full h-64 sm:h-72 rounded-[calc(1.5rem-2px)] relative z-10"
        />
        <div className="px-4 py-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Tap any pin to view specialty & prices</span>
          <span className="text-emerald-400 font-bold">Central Mangaluru</span>
        </div>
      </div>

      {/* 3. Stores List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5 px-1">
          <Store className="w-4 h-4 text-emerald-400" />
          <span>Verified Local Stores</span>
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {stores.map((store) => (
            <div 
              key={store.id} 
              className={`p-3.5 rounded-2xl border transition-all ${
                selectedStore?.id === store.id 
                  ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30' 
                  : 'bg-slate-900/60 border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-bold text-white text-xs">{store.name}</h5>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {store.area}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-950 text-emerald-400 border border-white/[0.08]">
                  {store.pricingTier}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                <div className="bg-slate-950 p-2 rounded-xl border border-white/[0.05] text-[11px]">
                  <span className="text-emerald-400 font-bold">Specialty: </span>
                  <span className="text-slate-300">{store.specialty}</span>
                </div>
                <p className="text-slate-400 text-[10px] italic px-1">{store.notes}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{store.type}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.area)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
