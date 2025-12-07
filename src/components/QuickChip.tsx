import React from 'react';

interface QuickChipProps {
  label: string;
  onClick: () => void;
}

const QuickChip: React.FC<QuickChipProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-full
                 text-sm font-semibold text-slate-700
                 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700
                 active:scale-95 transition-all shadow-sm hover:shadow-md
                 whitespace-nowrap min-h-[44px] flex items-center gap-2"
      aria-label={`Search for ${label}`}
    >
      {label}
    </button>
  );
};

export default QuickChip;
