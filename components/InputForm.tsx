import React, { useState } from 'react';
import { TravelPreferences } from '../types';
import { Plane, Calendar, Heart, Loader2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (prefs: TravelPreferences) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [interests, setInterests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination && duration && interests) {
      onSubmit({
        destination,
        duration: Number(duration),
        interests,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Rencanakan Liburan Impian</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Destination Input */}
        <div className="space-y-2">
          <label htmlFor="destination" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Plane className="w-4 h-4 text-indigo-600" />
            Tujuan Wisata
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Contoh: Bali, Indonesia"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
            required
            disabled={isLoading}
          />
        </div>

        {/* Duration Input */}
        <div className="space-y-2">
          <label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Durasi (Hari)
          </label>
          <input
            id="duration"
            type="number"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            placeholder="Contoh: 5"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
            required
            disabled={isLoading}
          />
        </div>

        {/* Interests Input */}
        <div className="space-y-2">
          <label htmlFor="interests" className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Heart className="w-4 h-4 text-indigo-600" />
            Minat Khusus
          </label>
          <textarea
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Contoh: Kuliner, Sejarah, Alam, Belanja"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400 min-h-[100px] resize-none"
            required
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !destination || !duration || !interests}
          className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2
            ${isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98]'
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sedang Membuat Itinerary...
            </>
          ) : (
            'Buat Itinerary'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;