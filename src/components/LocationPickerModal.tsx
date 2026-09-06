import React, { useState } from 'react';
import { MapPin, Search, X, Check, Compass, Sparkles } from 'lucide-react';
import { LocationData } from '../types';
import { searchLocation, INSPIRATIONAL_SANCTUARIES, getCurrentBrowserCoordinates } from '../services/mapsService';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: LocationData) => void;
  currentLocation?: LocationData | null;
  isDark: boolean;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  currentLocation,
  isDark
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>(INSPIRATIONAL_SANCTUARIES);
  const [isSearching, setIsSearching] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    const res = await searchLocation(query);
    setResults(res);
    setIsSearching(false);
  };

  const handleDetectGps = async () => {
    setDetectingGps(true);
    const coords = await getCurrentBrowserCoordinates();
    setDetectingGps(false);
    if (coords) {
      const loc: LocationData = {
        name: 'Current Coordinates',
        address: `${coords.lat}° N, ${coords.lng}° W`,
        lat: coords.lat,
        lng: coords.lng
      };
      onSelectLocation(loc);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative transition-all ${
        isDark ? 'bg-[#151b2a] border-[#2f3d5c] text-slate-100' : 'bg-[#fffdfa] border-[#dfd2be] text-[#2c221a]'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-[#ebd8c5] text-[#7a4831]'
            }`}>
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-literary text-xl font-bold">Attach Location</h3>
              <p className="text-xs font-typewriter opacity-60">Pin a sanctuary or memory setting to this page</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 opacity-70" />
          </button>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search place, café, mountain, or city..."
              className={`w-full pl-10 pr-24 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                isDark 
                  ? 'bg-[#1c2438] border-[#313f5f] placeholder-slate-500' 
                  : 'bg-[#f8f3ec] border-[#d8cbbb] placeholder-[#948174]'
              }`}
            />
            <button
              type="submit"
              disabled={isSearching}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-medium font-serif-literary ${
                isDark ? 'bg-amber-400 text-slate-900' : 'bg-[#5a3b29] text-white'
              }`}
            >
              {isSearching ? 'Seeking...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Current Browser GPS Button */}
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={detectingGps}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-typewriter transition-colors ${
              isDark ? 'border-[#303e5e] hover:bg-white/5 text-amber-300' : 'border-[#dfd3c1] hover:bg-black/5 text-[#734833]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{detectingGps ? 'Reading Horizon...' : 'Use Current Coordinates'}</span>
          </button>

          {currentLocation && (
            <button
              type="button"
              onClick={() => {
                onSelectLocation({ name: '' });
                onClose();
              }}
              className="text-xs text-rose-500 hover:underline"
            >
              Clear Location
            </button>
          )}
        </div>

        {/* Preset & Searched Sanctuaries */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          <div className="text-[10px] font-typewriter uppercase tracking-widest opacity-60 px-1 mb-1">
            Suggested Sanctuaries
          </div>

          {results.map((loc, idx) => {
            const isSelected = currentLocation?.name === loc.name;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectLocation(loc);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? isDark 
                      ? 'bg-amber-400/15 border-amber-400/50' 
                      : 'bg-[#ebd8c5]/50 border-[#85533d]'
                    : isDark
                      ? 'bg-[#182030]/70 border-[#2b3752] hover:bg-[#1f293d]'
                      : 'bg-[#faf6ef] border-[#e6dbc9] hover:bg-[#f3ece0]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 opacity-60 text-amber-500" />
                  <div>
                    <h4 className="font-serif-literary font-bold text-sm leading-tight">
                      {loc.name}
                    </h4>
                    {loc.address && (
                      <p className="text-xs opacity-60 font-sans-editorial mt-0.5">
                        {loc.address}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
