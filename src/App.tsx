import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import { generateItinerary } from './services/gemini';
import { TravelPreferences, ItineraryResponse } from './types';
import { Map, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateItinerary = async (prefs: TravelPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateItinerary(prefs);
      setItinerary(data);
    } catch (err) {
      setError("Something went wrong while generating your itinerary. Please ensure your API key is configured and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Map className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              AI Travel Planner
            </h1>
          </div>
          {itinerary && (
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              New Search
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {!itinerary ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-2xl">
              <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                  Your Next Adventure <br />
                  <span className="text-indigo-600">Starts Here</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-lg mx-auto">
                  Enter your dream destination and let our AI craft the perfect personalized itinerary for you in seconds.
                </p>
              </div>
              <InputForm onSubmit={handleCreateItinerary} isLoading={loading} />
            </div>
          </div>
        ) : (
          <ItineraryDisplay data={itinerary} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Powered by Gemini API. Built for adventurers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
