import React, { useState, useEffect } from 'react';
import { ItineraryResponse, DayPlan, Activity } from '../types';
import { Clock, DollarSign, MapPin, ExternalLink, Calculator, Wallet, TrendingDown, PiggyBank, Globe } from 'lucide-react';

interface ItineraryDisplayProps {
  data: ItineraryResponse;
  onReset: () => void;
}

interface ActivityItemProps {
  activity: Activity;
  currency: string;
  costValue: number | '';
  onCostChange: (val: number | '') => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, currency, costValue, onCostChange }) => (
  <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors group">
    <div className="flex-1 space-y-2">
      <h4 className="font-bold text-slate-800 text-lg flex items-start gap-2">
        <MapPin className="w-5 h-5 text-indigo-500 mt-1 shrink-0" />
        <span className="flex-1">{activity.placeName}</span>
        <a 
          href={`https://www.google.com/search?q=${encodeURIComponent(activity.placeName)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-1 text-blue-500 hover:text-blue-700 transition-colors opacity-70 hover:opacity-100"
          title="Verifikasi di Google"
        >
          <Globe className="w-4 h-4" /> 
        </a>
      </h4>
      <p className="text-slate-600 text-sm leading-relaxed">{activity.description}</p>
      
      <div className="flex flex-wrap gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
          <Clock className="w-4 h-4 text-teal-500" />
          {activity.timeSlot}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span className="truncate max-w-[150px]">{activity.cost}</span>
        </div>
      </div>
    </div>
    
    <div className="flex flex-col gap-3 sm:w-48 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
       {/* Actual Cost Input */}
       <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
          Actual Cost ({currency})
        </label>
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-medium text-sm">$</span>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={costValue}
            onChange={(e) => onCostChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full text-slate-700 font-semibold bg-transparent outline-none placeholder:text-slate-300"
          />
        </div>
      </div>

      <a
        href={`https://www.google.com/search?q=${encodeURIComponent(activity.placeName + ' ticket price')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-100 transition-all w-full"
      >
        Check Price
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  </div>
);

const DayCard: React.FC<{ 
  day: DayPlan; 
  currency: string;
  dayIndex: number;
  userCosts: Record<string, number>;
  onUpdateCost: (key: string, val: number | '') => void;
}> = ({ day, currency, dayIndex, userCosts, onUpdateCost }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
    <div className="bg-indigo-600 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h3 className="text-xl font-bold text-white">Day {day.dayNumber}</h3>
      <span className="inline-block bg-indigo-500/50 text-indigo-50 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-indigo-400/30">
        {day.theme}
      </span>
    </div>
    <div className="p-6 space-y-4">
      {day.activities.map((activity, actIndex) => {
        const key = `${dayIndex}-${actIndex}`;
        return (
          <ActivityItem 
            key={actIndex} 
            activity={activity} 
            currency={currency}
            costValue={userCosts[key] ?? ''}
            onCostChange={(val) => onUpdateCost(key, val)}
          />
        );
      })}
    </div>
  </div>
);

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ data, onReset }) => {
  const [userCosts, setUserCosts] = useState<Record<string, number>>({});
  const [totalTripBudget, setTotalTripBudget] = useState<number | ''>('');

  // Calculate totals
  const totalSpent = Object.values(userCosts).reduce((acc, curr) => acc + (curr || 0), 0);
  const remainingBudget = (typeof totalTripBudget === 'number' ? totalTripBudget : 0) - totalSpent;
  const dailyAverageRemaining = Math.max(0, remainingBudget / data.days.length);

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Itinerary for {data.destination}</h2>
          <p className="text-slate-500 mt-1">Found {data.days.length} days of adventure</p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors self-start md:self-center"
        >
          Plan New Trip
        </button>
      </div>

      <div className="space-y-8">
        {data.days.map((day, index) => (
          <DayCard 
            key={day.dayNumber} 
            day={day} 
            currency={data.currency} 
            dayIndex={index}
            userCosts={userCosts}
            onUpdateCost={(key, val) => setUserCosts(prev => ({ ...prev, [key]: val === '' ? 0 : val }))}
          />
        ))}
      </div>

      {/* Budget Summary Section */}
      <div className="mt-12 bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Calculator className="w-64 h-64" />
        </div>
        
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
          <Wallet className="w-6 h-6 text-emerald-400" />
          Budget Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          {/* Total Budget Input */}
          <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
            <label className="text-indigo-200 text-sm font-medium mb-2 block flex items-center gap-2">
              <PiggyBank className="w-4 h-4" />
              Total Trip Budget
            </label>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-indigo-200">{data.currency}</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={totalTripBudget}
                onChange={(e) => setTotalTripBudget(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="bg-transparent text-4xl font-bold w-full outline-none text-white placeholder:text-white/20"
              />
            </div>
            <p className="text-xs text-indigo-200/60 mt-2">Enter your total budget</p>
          </div>

          {/* Total Estimated Cost */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
            <label className="text-slate-400 text-sm font-medium mb-2 block flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Total Activities Cost
            </label>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-400">{data.currency}</span>
              <span className="text-3xl font-bold text-white">
                {totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Sum of inputs above</p>
          </div>

          {/* Remaining / Recommendation */}
          <div className={`rounded-2xl p-5 border transition-colors ${
            remainingBudget < 0 
              ? 'bg-red-500/20 border-red-500/30' 
              : 'bg-emerald-500/20 border-emerald-500/30'
          }`}>
            <label className={`text-sm font-medium mb-2 block flex items-center gap-2 ${
              remainingBudget < 0 ? 'text-red-200' : 'text-emerald-200'
            }`}>
              <TrendingDown className="w-4 h-4" />
              {remainingBudget < 0 ? 'Over Budget' : 'Remaining / Day'}
            </label>
            
            <div className="flex items-baseline gap-1">
               <span className={`text-xl font-bold ${remainingBudget < 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                 {data.currency}
               </span>
               <span className={`text-3xl font-bold ${remainingBudget < 0 ? 'text-white' : 'text-white'}`}>
                 {remainingBudget < 0 
                    ? Math.abs(remainingBudget).toLocaleString() 
                    : dailyAverageRemaining.toLocaleString(undefined, { maximumFractionDigits: 0 })
                 }
               </span>
            </div>
            
            <p className={`text-xs mt-2 ${remainingBudget < 0 ? 'text-red-200' : 'text-emerald-200/70'}`}>
              {remainingBudget < 0 
                ? "You exceeded your budget!" 
                : `Avg. daily allowance for ${data.days.length} days`
              }
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
