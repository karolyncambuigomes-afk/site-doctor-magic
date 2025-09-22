import React from 'react';

export const BuildStatus: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">Build OK - {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};