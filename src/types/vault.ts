// Core data types for FileSafe

export type FieldType = 'text' | 'date' | 'number' | 'email' | 'phone';

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: FieldType;
}

export type DocumentType =
  | 'passport'
  | 'driving_license'
  | 'national_id'
  | 'visa'
  | 'residence_permit'
  | 'insurance'
  | 'bank_card'
  | 'medical_card'
  | 'custom';

export interface Attachment {
  id: string;
  name: string;
  type: string; // MIME type (image/jpeg, application/pdf, etc.)
  size: number; // bytes
  url: string; // Data URL or blob URL
  uploadedAt: string; // ISO date string
}

export interface Document {
  id: string;
  profileId: string;
  type: DocumentType;
  title: string;

  // Standard fields (may be undefined depending on document type)
  passport_number?: string;
  license_number?: string;
  id_number?: string;
  permit_number?: string; // For residence permits
  policy_number?: string; // For insurance
  card_number?: string; // For bank/medical cards

  full_name?: string;
  date_of_birth?: string; // ISO date string
  nationality?: string;
  issue_date?: string; // ISO date string
  expiry_date?: string; // ISO date string
  issuing_authority?: string;
  place_of_issue?: string; // NEW: Place where document was issued

  // Insurance-specific fields
  insurance_type?: string; // Health, Auto, Home, Life, Travel
  provider?: string; // Insurance company
  coverage_amount?: string;
  premium?: string;

  // Bank/Medical card fields
  card_type?: string; // Visa, Mastercard, Amex, etc.
  bank_name?: string;

  // Residence permit fields
  permit_type?: string; // Work, Student, Family, Permanent
  sponsor?: string;

  // Custom fields
  customFields: CustomField[];

  // NEW: Notes and Attachments
  notes?: string; // Rich text notes
  attachments?: Attachment[]; // Files, images, scans

  // Metadata
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  // User preferences
  isPinned?: boolean; // Pin to top of home screen for quick access
  pinnedAt?: string; // ISO date string
  lastAccessedAt?: string; // ISO date string - for recent tracking
}

export interface Profile {
  id: string;
  name: string;
  relationship?: string; // 'self', 'spouse', 'child', 'parent', etc.
  avatar?: string; // emoji or image URL
  createdAt: string;
}

export interface VaultSettings {
  pin: string; // ⚠️ PROTOTYPE ONLY: Not secure, just plain text for demo
  recoveryKey: string; // Recovery key for PIN reset
  autoLockSeconds: number;
  biometricsEnabled: boolean;
}

export interface VaultData {
  profiles: Profile[];
  documents: Document[];
  settings: VaultSettings;
  version: string;
}

// Search result types
export interface SearchResult {
  type: 'document' | 'field' | 'multiple';
  documents: Document[];
  highlightedField?: string;
  profile?: Profile;
  query: string;
}

// Query intent parsing
export interface QueryIntent {
  profileName?: string;
  profileId?: string;
  documentType?: DocumentType;
  fieldName?: string;
  action?: 'find' | 'list' | 'expiry_check';
}
