import React from 'react';

export const Badge = ({ variant = 'default', size = 'md', children }) => {
  const variants = {
    default: 'bg-slate-200 text-slate-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`inline-block rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 ${sizes[size]} ${className}`} />
  );
};

export const Tabs = ({ tabs, defaultTab = 0, onChange }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div>
      <div className="border-b border-slate-200 flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === index
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default { Badge, Spinner, Tabs };
