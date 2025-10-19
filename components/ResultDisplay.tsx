import React from 'react';
import { Unit } from '../types';

interface ResultDisplayProps {
  distance: number;
  unit: Unit;
  onRemeasure: () => void;
  onRecalibrate: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ distance, unit, onRemeasure, onRecalibrate }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-gray-300">Measured Distance:</p>
      <p className="text-4xl font-bold text-sky-300">
        {distance.toFixed(2)} <span className="text-2xl font-normal">{unit}</span>
      </p>
      <div className="w-full flex flex-col gap-3 mt-2">
        <button
          onClick={onRemeasure}
          className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Measure Again
        </button>
        <button
          onClick={onRecalibrate}
          className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Recalibrate
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;