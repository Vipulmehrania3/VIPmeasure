import React from 'react';
import { Point } from '../types';

interface ConnectingLineProps {
  p1: Point;
  p2: Point;
  color: string;
}

const ConnectingLine: React.FC<ConnectingLineProps> = ({ p1, p2, color }) => {
  return (
    <g style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
        <line
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="white"
            strokeWidth="5"
            strokeDasharray="6 6"
            strokeOpacity="0.5"
        />
        <line
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={color}
            strokeWidth="3"
            strokeDasharray="6 6"
        />
    </g>
  );
};

export default ConnectingLine;