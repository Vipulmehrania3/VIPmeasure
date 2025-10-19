import React from 'react';
import { Unit } from '../types';

interface PlaneShiftControlProps {
  value: number;
  onChange: (value: number) => void;
  unit: Unit;
  maxForward: number; // Cannot move forward more than the initial calibration distance
}

const PlaneShiftControl: React.FC<PlaneShiftControlProps> = ({ value, onChange, unit, maxForward }) => {
  const min = -200; // Arbitrary backward limit
  const max = Math.floor(maxForward * 0.95); // Don't allow moving exactly to 0 distance

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-lg gap-3">
      <label htmlFor="plane-shift" className="text-sm font-medium text-gray-300 tracking-wide">
        Adjust Camera Distance from Measurement Plane
      </label>
      
      <div className="w-full flex items-center gap-4 px-2">
        <span className="text-xs text-gray-400">Closer</span>
        <input
          id="plane-shift"
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 cursor-pointer bg-gray-700 rounded-lg appearance-none"
          style={{ accentColor: '#0ea5e9' }}
        />
        <span className="text-xs text-gray-400">Further</span>
      </div>

      <p className="text-xl font-semibold text-sky-300 bg-black/30 px-3 py-1 rounded-md">
        {value >= 0 ? `+${value}` : value} {unit}
      </p>
    </div>
  );
};

export default PlaneShiftControl;