import React from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard, triggerHapticFeedback } from '../utils/clipboard';

interface FieldItemProps {
  label: string;
  value?: string;
  type?: 'text' | 'date' | 'number';
}

const FieldItem: React.FC<FieldItemProps> = ({ label, value }) => {
  const [copied, setCopied] = React.useState(false);

  if (!value) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      triggerHapticFeedback();
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 mb-0.5">{label}</p>
        <p className="font-medium text-gray-900 break-words">{value}</p>
      </div>

      <button
        onClick={handleCopy}
        className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
          copied
            ? 'bg-green-100 text-green-600'
            : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'
        }`}
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </div>
  );
};

export default FieldItem;
