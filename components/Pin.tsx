import React from 'react';
import { Point } from '../types';

interface PinProps {
  point: Point;
  color: string;
}

const Pin: React.FC<PinProps> = ({ point, color }) => {
  return (
    <g transform={`translate(${point.x}, ${point.y})`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
      <circle
        cx="0"
        cy="0"
        r="12"
        fill={color}
        fillOpacity="0.3"
      />
      <circle
        cx="0"
        cy="0"
        r="6"
        fill={color}
        fillOpacity="0.8"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="0" cy="0" r="1.5" fill="white" />
    </g>
  );
};

export default Pin;