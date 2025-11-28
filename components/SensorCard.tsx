import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color: string;
  min: number;
  max: number;
  description: string;
}

export const SensorCard: React.FC<SensorCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  color,
  min,
  max,
  description
}) => {
  const isOptimal = value >= min && value <= max;
  
  // Dynamic color classes based on prop
  const bgClass = color === 'orange' ? 'bg-orange-50 text-orange-600' :
                  color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  color === 'purple' ? 'bg-purple-50 text-purple-600' :
                  'bg-emerald-50 text-emerald-600';

  const barColor = color === 'orange' ? 'bg-orange-500' :
                   color === 'blue' ? 'bg-blue-500' :
                   color === 'purple' ? 'bg-purple-500' :
                   'bg-emerald-500';

  // Calculate percentage for progress bar visualization (clamped 0-100)
  const range = max * 1.5; // Give some headroom
  const percentage = Math.min(Math.max((value / range) * 100, 0), 100);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${bgClass}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {/* Visual Indicator */}
      <div className="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden">
        <div 
          className={`h-full rounded-full ${barColor} transition-all duration-1000`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={isOptimal ? "text-emerald-600 font-medium" : "text-amber-500 font-medium"}>
          {isOptimal ? "• Kondisi Optimal" : "• Perlu Perhatian"}
        </span>
        <span className="text-slate-400">{min}-{max} {unit}</span>
      </div>
      
      <p className="mt-3 text-xs text-slate-500 border-t border-slate-50 pt-2">
        {description}
      </p>
    </div>
  );
};