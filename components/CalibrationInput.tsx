import React, { useState } from 'react';
import { Unit, UNITS } from '../types';

interface CalibrationInputProps {
  onSubmit: (knownLength: number, unit: Unit, distanceFromObject: number) => void;
}

const CalibrationInput: React.FC<CalibrationInputProps> = ({ onSubmit }) => {
  const [length, setLength] = useState('');
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState<Unit>('cm');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericLength = parseFloat(length);
    const numericDistance = parseFloat(distance);
    if (!isNaN(numericLength) && numericLength > 0 && !isNaN(numericDistance) && numericDistance > 0) {
      onSubmit(numericLength, unit, numericDistance);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-center text-gray-300 mb-2">
        Enter the real-world length of the object you pinned, and how far your camera is from it.
      </p>
      
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Object's Known Length</label>
        <div className="w-full flex gap-2">
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="e.g., 29.7"
            className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            autoFocus
            required
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Distance from Object ({unit})</label>
        <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="e.g., 50"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            required
          />
      </div>

      <button
        type="submit"
        className="w-full mt-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-500"
        disabled={!length || !distance || parseFloat(length) <= 0 || parseFloat(distance) <= 0}
      >
        Calibrate
      </button>
    </form>
  );
};

export default CalibrationInput;