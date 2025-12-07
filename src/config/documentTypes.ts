// Document Type Configuration
// Single source of truth for all document type metadata

import { DocumentType } from '../types/vault';

export interface DocumentTypeConfig {
  id: DocumentType;
  label: string;
  emoji: string;
  category: 'identity' | 'immigration' | 'insurance_cards' | 'other';
  requiredFields: {
    quickMode: string[]; // Fields required in Quick Add mode
    fullMode: string[]; // Additional fields required in Full Detail mode (cumulative)
  };
  numberFieldLabel?: string; // Label for the document number field
  numberFieldPlaceholder?: string;
}

/**
 * Centralized configuration for all document types.
 * This is the single source of truth for:
 * - Display labels
 * - Required field validation
 * - Category grouping
 * - Field-specific metadata
 */
export const DOCUMENT_TYPE_CONFIGS: Record<DocumentType, DocumentTypeConfig> = {
  passport: {
    id: 'passport',
    label: 'Passport',
    emoji: '🛂',
    category: 'identity',
    requiredFields: {
      quickMode: ['title', 'passport_number', 'expiry_date'],
      fullMode: [] // No additional required fields in full mode
    },
    numberFieldLabel: 'Passport Number',
    numberFieldPlaceholder: 'e.g., N1234567 or AB123456'
  },

  driving_license: {
    id: 'driving_license',
    label: 'Driving License',
    emoji: '🚗',
    category: 'identity',
    requiredFields: {
      quickMode: ['title', 'license_number', 'expiry_date'],
      fullMode: []
    },
    numberFieldLabel: 'License Number',
    numberFieldPlaceholder: 'e.g., DL123456789 or D1234567'
  },

  national_id: {
    id: 'national_id',
    label: 'National ID',
    emoji: '🪪',
    category: 'identity',
    requiredFields: {
      quickMode: ['title', 'id_number', 'expiry_date'],
      fullMode: []
    },
    numberFieldLabel: 'ID Number',
    numberFieldPlaceholder: 'e.g., ID123456 or 123456789'
  },

  visa: {
    id: 'visa',
    label: 'Visa',
    emoji: '✈️',
    category: 'immigration',
    requiredFields: {
      quickMode: ['title', 'expiry_date'], // Visa number is optional
      fullMode: []
    },
    numberFieldLabel: 'Visa Number',
    numberFieldPlaceholder: 'e.g., VISA-2024-1234'
  },

  residence_permit: {
    id: 'residence_permit',
    label: 'Residence Permit',
    emoji: '🏠',
    category: 'immigration',
    requiredFields: {
      quickMode: ['title', 'expiry_date'], // Permit number is optional
      fullMode: []
    },
    numberFieldLabel: 'Permit Number',
    numberFieldPlaceholder: 'e.g., RP-2024-1234'
  },

  insurance: {
    id: 'insurance',
    label: 'Insurance Policy',
    emoji: '🛡️',
    category: 'insurance_cards',
    requiredFields: {
      quickMode: ['title', 'insurance_type'], // No expiry required for insurance
      fullMode: []
    },
    numberFieldLabel: 'Policy Number',
    numberFieldPlaceholder: 'e.g., POL-2024-123456'
  },

  bank_card: {
    id: 'bank_card',
    label: 'Bank Card',
    emoji: '💳',
    category: 'insurance_cards',
    requiredFields: {
      quickMode: ['title'], // Minimal requirements
      fullMode: []
    },
    numberFieldLabel: 'Card Number (last 4 digits recommended)',
    numberFieldPlaceholder: '**** **** **** 1234'
  },

  medical_card: {
    id: 'medical_card',
    label: 'Medical Card',
    emoji: '🏥',
    category: 'insurance_cards',
    requiredFields: {
      quickMode: ['title'], // Minimal requirements
      fullMode: []
    },
    numberFieldLabel: 'Card Number',
    numberFieldPlaceholder: 'MED-123456789'
  },

  custom: {
    id: 'custom',
    label: 'Custom Document',
    emoji: '📄',
    category: 'other',
    requiredFields: {
      quickMode: ['title'], // Only title required for custom
      fullMode: []
    }
  }
};

/**
 * Get the default title for a document type
 */
export const getDefaultTitle = (documentType: DocumentType): string => {
  return DOCUMENT_TYPE_CONFIGS[documentType].label;
};

/**
 * Check if a field is required for a specific document type and mode
 */
export const isFieldRequired = (
  documentType: DocumentType,
  fieldName: string,
  isQuickMode: boolean
): boolean => {
  const config = DOCUMENT_TYPE_CONFIGS[documentType];

  if (isQuickMode) {
    return config.requiredFields.quickMode.includes(fieldName);
  } else {
    // In full mode, both quickMode and fullMode required fields apply
    return [...config.requiredFields.quickMode, ...config.requiredFields.fullMode].includes(fieldName);
  }
};

/**
 * Get all required fields for a document type and mode
 */
export const getRequiredFields = (
  documentType: DocumentType,
  isQuickMode: boolean
): string[] => {
  const config = DOCUMENT_TYPE_CONFIGS[documentType];

  if (isQuickMode) {
    return config.requiredFields.quickMode;
  } else {
    return [...config.requiredFields.quickMode, ...config.requiredFields.fullMode];
  }
};

/**
 * Get document types grouped by category for display
 */
export const getDocumentTypesByCategory = () => {
  const categories = {
    identity: [] as DocumentTypeConfig[],
    immigration: [] as DocumentTypeConfig[],
    insurance_cards: [] as DocumentTypeConfig[],
    other: [] as DocumentTypeConfig[]
  };

  Object.values(DOCUMENT_TYPE_CONFIGS).forEach(config => {
    categories[config.category].push(config);
  });

  return categories;
};
