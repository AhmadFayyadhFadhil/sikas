import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const Alert = ({ variant = 'info', title, message, onClose }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const icons = {
    info: <Info size={20} />,
    success: <CheckCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    error: <AlertCircle size={20} />
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${variants[variant]}`}>
      <div className="flex-shrink-0 mt-0.5">{icons[variant]}</div>
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        {message && <p className="text-sm">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-50 hover:opacity-75 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
