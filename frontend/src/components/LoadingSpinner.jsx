import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    <p className="text-slate-400 text-sm">{text}</p>
  </div>
);

export default LoadingSpinner;