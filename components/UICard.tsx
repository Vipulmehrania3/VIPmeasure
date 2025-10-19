import React from 'react';

interface UICardProps {
  children: React.ReactNode;
  className?: string;
}

const UICard: React.FC<UICardProps> = ({ children, className = '' }) => {
  return (
    <div className={`ui-card bg-gray-900/60 backdrop-blur-lg border border-sky-500/30 rounded-lg shadow-2xl shadow-black/50 p-6 max-w-sm mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default UICard;