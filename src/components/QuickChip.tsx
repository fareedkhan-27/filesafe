import React from 'react';

interface QuickChipProps {
  label: string;
  onClick: () => void;
}

const QuickChip: React.FC<QuickChipProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full
                 text-base font-bold text-gray-700 dark:text-gray-300
                 hover:border-primary-400 dark:hover:border-primary-500
                 hover:bg-primary-50 dark:hover:bg-primary-900/30
                 hover:text-primary-700 dark:hover:text-primary-300
                 active:scale-95 transition-all shadow-sm hover:shadow-md 
                 whitespace-nowrap min-h-[48px] flex items-center gap-2"
      aria-label={`Search for ${label}`}
    >
      {label}
    </button>
  );
};

export default QuickChip;
