import React from 'react';
import { Document, Profile } from '../types/vault';
import { Copy, FileText, CreditCard, BadgeCheck, Plane, Home, Shield, Wallet, Heart } from 'lucide-react';
import { formatDate, getExpiryStatus } from '../utils/dateHelpers';
import { useToast } from '../context/ToastContext';
import { copyToClipboard, triggerHapticFeedback } from '../utils/clipboard';

interface DocumentCardProps {
  document: Document;
  profile?: Profile;
  highlightedField?: string;
  onClick?: () => void;
  compact?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  profile,
  highlightedField,
  onClick,
  compact = false
}) => {
  const { success } = useToast();

  const getDocumentIcon = () => {
    switch (document.type) {
      case 'passport':
        return <Plane className="text-primary-600" size={22} />;
      case 'driving_license':
        return <CreditCard className="text-primary-600" size={22} />;
      case 'national_id':
        return <BadgeCheck className="text-primary-600" size={22} />;
      case 'visa':
        return <Plane className="text-blue-600" size={22} />;
      case 'residence_permit':
        return <Home className="text-emerald-600" size={22} />;
      case 'insurance':
        return <Shield className="text-purple-600" size={22} />;
      case 'bank_card':
        return <Wallet className="text-teal-600" size={22} />;
      case 'medical_card':
        return <Heart className="text-red-600" size={22} />;
      default:
        return <FileText className="text-slate-500" size={22} />;
    }
  };

  const handleCopyField = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const copySuccess = await copyToClipboard(text);
    if (copySuccess) {
      success(`✓ Copied: ${text}`);
      triggerHapticFeedback();
    } else {
      success('❌ Copy failed. Please try again.');
    }
  };

  const getFieldValue = (fieldName: string): string | undefined => {
    switch (fieldName) {
      case 'number':
        return document.passport_number ||
               document.license_number ||
               document.id_number ||
               document.permit_number ||
               document.policy_number ||
               document.card_number;
      case 'expiry_date':
        return document.expiry_date;
      case 'date_of_birth':
        return document.date_of_birth;
      case 'full_name':
        return document.full_name;
      case 'nationality':
        return document.nationality;
      case 'issue_date':
        return document.issue_date;
      default:
        return undefined;
    }
  };

  const expiryStatus = document.expiry_date ? getExpiryStatus(document.expiry_date) : null;

  const documentTitle = profile ? `${profile.name}'s ${document.title}` : document.title;
  const expiryInfo = expiryStatus ? ` - ${expiryStatus.status === 'expired' ? 'Expired' : 'Valid'}` : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all animate-fadeIn ${
        compact ? 'p-3' : 'p-4'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${documentTitle}${expiryInfo}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">{getDocumentIcon()}</div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-slate-900 text-base">
                {profile ? `${profile.name} · ${document.title}` : document.title}
              </h3>
              <p className="text-sm text-slate-600 capitalize">
                {document.type.replace('_', ' ')}
              </p>
            </div>

            {expiryStatus && (
              <span className={`badge badge-${expiryStatus.color === 'red' ? 'red' : expiryStatus.color === 'orange' || expiryStatus.color === 'yellow' ? 'yellow' : 'green'}`}>
                {expiryStatus.status === 'expired' ? 'Expired' : 'Valid'}
              </span>
            )}
          </div>

          {/* Highlighted or main fields */}
          {!compact && (
            <div className="space-y-2">
              {/* Show highlighted field or default important fields */}
              {highlightedField ? (
                <FieldDisplay
                  label={getFieldLabel(highlightedField)}
                  value={getFieldValue(highlightedField)}
                  onCopy={handleCopyField}
                  highlighted
                />
              ) : (
                <>
                  {(document.passport_number || document.license_number || document.id_number) && (
                    <FieldDisplay
                      label="Number"
                      value={document.passport_number || document.license_number || document.id_number}
                      onCopy={handleCopyField}
                    />
                  )}
                  {document.expiry_date && (
                    <FieldDisplay
                      label="Expires"
                      value={formatDate(document.expiry_date)}
                      onCopy={handleCopyField}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {expiryStatus && expiryStatus.status !== 'valid' && !compact && (
            <p className={`text-sm mt-2 font-medium ${expiryStatus.status === 'expired' ? 'text-red-700' : 'text-amber-700'}`}>
              {expiryStatus.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for field display
const FieldDisplay: React.FC<{
  label: string;
  value?: string;
  onCopy: (text: string, e: React.MouseEvent) => Promise<void>;
  highlighted?: boolean;
}> = ({ label, value, onCopy, highlighted = false }) => {
  if (!value) return null;

  return (
    <div className={`flex items-center justify-between gap-2 p-3 rounded-lg ${highlighted ? 'bg-primary-50 border border-primary-200' : 'bg-slate-50 border border-slate-200'}`}>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-600 font-medium">{label}</p>
        <p className="font-semibold text-slate-900 truncate">{value}</p>
      </div>
      <button
        onClick={(e) => onCopy(value, e)}
        className="flex-shrink-0 p-2 text-slate-400 hover:text-primary-600 active:text-primary-700 transition-colors rounded-lg hover:bg-slate-100 min-w-touch min-h-touch"
        aria-label={`Copy ${label}: ${value}`}
        title="Copy to clipboard"
      >
        <Copy size={18} />
      </button>
    </div>
  );
};

const getFieldLabel = (fieldName: string): string => {
  const labels: Record<string, string> = {
    'number': 'Number',
    'expiry_date': 'Expiry Date',
    'date_of_birth': 'Date of Birth',
    'full_name': 'Full Name',
    'nationality': 'Nationality',
    'issue_date': 'Issue Date'
  };
  return labels[fieldName] || fieldName;
};

export default DocumentCard;
