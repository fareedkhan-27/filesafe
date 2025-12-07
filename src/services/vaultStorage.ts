// VaultStorage Service
// This service abstracts all data persistence logic
// ⚠️ PROTOTYPE VERSION: Data is NOT encrypted yet
// Future: This layer will handle encryption/decryption using WebCrypto

import Dexie, { Table } from 'dexie';
import { Profile, Document, VaultSettings } from '../types/vault';

// Dexie database
class VaultDatabase extends Dexie {
  profiles!: Table<Profile, string>;
  documents!: Table<Document, string>;
  settings!: Table<VaultSettings & { id: string }, string>;

  constructor() {
    super('FileSafeDB');

    this.version(1).stores({
      profiles: 'id, name',
      documents: 'id, profileId, type, expiry_date',
      settings: 'id'
    });
  }
}

const db = new VaultDatabase();

// Export database instance for advanced operations (like factory reset)
export { db };

// Initialize with sample data for demo
export const initializeSampleData = async (): Promise<void> => {
  const profileCount = await db.profiles.count();

  if (profileCount > 0) {
    // Already initialized
    return;
  }

  // Create sample profiles
  const profiles: Profile[] = [
    {
      id: 'profile-me',
      name: 'Me',
      relationship: 'self',
      avatar: '👤',
      createdAt: new Date().toISOString()
    },
    {
      id: 'profile-wife',
      name: 'Sara',
      relationship: 'spouse',
      avatar: '👩',
      createdAt: new Date().toISOString()
    },
    {
      id: 'profile-kid1',
      name: 'Alex',
      relationship: 'child',
      avatar: '👦',
      createdAt: new Date().toISOString()
    }
  ];

  // Create sample documents - diverse types for testing
  const documents: Document[] = [
    // Identity Documents
    {
      id: 'doc-1',
      profileId: 'profile-me',
      type: 'passport',
      title: 'Passport',
      passport_number: 'N1234567',
      full_name: 'John Doe',
      date_of_birth: '1990-05-15',
      nationality: 'USA',
      issue_date: '2020-01-10',
      expiry_date: '2030-01-10',
      issuing_authority: 'US Department of State',
      customFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'doc-2',
      profileId: 'profile-me',
      type: 'driving_license',
      title: 'Driving License',
      license_number: 'DL123456789',
      full_name: 'John Doe',
      date_of_birth: '1990-05-15',
      issue_date: '2021-03-15',
      expiry_date: '2026-03-15',
      issuing_authority: 'DMV',
      customFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'doc-3',
      profileId: 'profile-me',
      type: 'national_id',
      title: 'National ID',
      id_number: 'ID987654321',
      full_name: 'John Doe',
      date_of_birth: '1990-05-15',
      nationality: 'USA',
      issue_date: '2018-05-20',
      expiry_date: '2028-05-20',
      issuing_authority: 'Department of Internal Affairs',
      customFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Wife's Documents
    {
      id: 'doc-4',
      profileId: 'profile-wife',
      type: 'passport',
      title: 'Passport',
      passport_number: 'P9876543',
      full_name: 'Sara Doe',
      date_of_birth: '1992-08-22',
      nationality: 'USA',
      issue_date: '2019-06-20',
      expiry_date: '2029-06-20',
      issuing_authority: 'US Department of State',
      customFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'doc-5',
      profileId: 'profile-wife',
      type: 'residence_permit',
      title: 'Residence Permit',
      permit_number: 'RP-2024-5566',
      permit_type: 'Permanent Residence',
      full_name: 'Sara Doe',
      date_of_birth: '1992-08-22',
      issue_date: '2023-01-15',
      expiry_date: '2028-01-15',
      issuing_authority: 'Immigration Department',
      customFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Child's Documents
    {
      id: 'doc-6',
      profileId: 'profile-kid1',
      type: 'passport',
      title: 'Passport',
      passport_number: 'C1112233',
      full_name: 'Alex Doe',
      date_of_birth: '2015-12-10',
      nationality: 'USA',
      issue_date: '2022-01-05',
      expiry_date: '2027-01-05',
      issuing_authority: 'US Department of State',
      customFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'doc-7',
      profileId: 'profile-kid1',
      type: 'medical_card',
      title: 'Health Insurance Card',
      card_number: 'MED-445566778',
      provider: 'Blue Cross Health',
      full_name: 'Alex Doe',
      date_of_birth: '2015-12-10',
      issue_date: '2024-01-01',
      expiry_date: '2025-01-01',
      customFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Insurance Documents
    {
      id: 'doc-8',
      profileId: 'profile-me',
      type: 'insurance',
      title: 'Health Insurance',
      policy_number: 'HI-2024-123456',
      insurance_type: 'Health',
      provider: 'Blue Cross Blue Shield',
      coverage_amount: '$500,000',
      premium: '$450/month',
      issue_date: '2024-01-01',
      expiry_date: '2025-01-01',
      customFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'doc-9',
      profileId: 'profile-me',
      type: 'insurance',
      title: 'Auto Insurance',
      policy_number: 'AUTO-8877665',
      insurance_type: 'Auto',
      provider: 'State Farm',
      coverage_amount: '$100,000',
      premium: '$120/month',
      issue_date: '2024-03-15',
      expiry_date: '2025-03-15',
      customFields: [
        { id: 'c1', label: 'Vehicle', value: '2021 Honda Accord', type: 'text' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Financial Documents
    {
      id: 'doc-10',
      profileId: 'profile-me',
      type: 'bank_card',
      title: 'Credit Card',
      card_number: '**** **** **** 1234',
      card_type: 'Visa',
      bank_name: 'Chase Bank',
      full_name: 'John Doe',
      expiry_date: '2027-12-31',
      customFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Immigration Documents
    {
      id: 'doc-11',
      profileId: 'profile-me',
      type: 'visa',
      title: 'Tourist Visa',
      permit_number: 'VISA-2024-9988',
      full_name: 'John Doe',
      nationality: 'USA',
      issue_date: '2024-06-01',
      expiry_date: '2025-06-01',
      issuing_authority: 'Embassy of France',
      customFields: [
        { id: 'c2', label: 'Visa Type', value: 'Tourist (90 days)', type: 'text' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Default settings
  const settings: VaultSettings & { id: string } = {
    id: 'settings-main',
    pin: '', // Will be set during onboarding
    recoveryKey: '', // Will be generated during onboarding
    autoLockSeconds: 300,
    biometricsEnabled: false
  };

  await db.profiles.bulkAdd(profiles);
  await db.documents.bulkAdd(documents);
  await db.settings.add(settings);
};

// Profile CRUD
export const getAllProfiles = async (): Promise<Profile[]> => {
  return await db.profiles.toArray();
};

export const getProfileById = async (id: string): Promise<Profile | undefined> => {
  return await db.profiles.get(id);
};

export const createProfile = async (profile: Profile): Promise<void> => {
  await db.profiles.add(profile);
};

export const updateProfile = async (id: string, updates: Partial<Profile>): Promise<void> => {
  await db.profiles.update(id, updates);
};

export const deleteProfile = async (id: string): Promise<void> => {
  // Also delete all documents for this profile
  await db.documents.where('profileId').equals(id).delete();
  await db.profiles.delete(id);
};

// Document CRUD
export const getAllDocuments = async (): Promise<Document[]> => {
  return await db.documents.toArray();
};

export const getDocumentById = async (id: string): Promise<Document | undefined> => {
  return await db.documents.get(id);
};

export const getDocumentsByProfile = async (profileId: string): Promise<Document[]> => {
  return await db.documents.where('profileId').equals(profileId).toArray();
};

export const createDocument = async (document: Document): Promise<void> => {
  await db.documents.add(document);
};

export const updateDocument = async (id: string, updates: Partial<Document>): Promise<void> => {
  // IMPORTANT: Document type changes are not allowed for existing documents
  // The UI should disable the Document Type field in Edit mode
  // If 'type' is included in updates, it will be applied, but the UI prevents this
  // If document type changes are ever needed, add explicit validation here
  await db.documents.update(id, { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteDocument = async (id: string): Promise<void> => {
  await db.documents.delete(id);
};

// Settings
export const getSettings = async (): Promise<VaultSettings | undefined> => {
  const result = await db.settings.get('settings-main');
  if (!result) return undefined;
  const { id, ...settings } = result;
  return settings;
};

export const updateSettings = async (updates: Partial<VaultSettings>): Promise<void> => {
  // Get existing settings or use defaults
  const existing = await db.settings.get('settings-main');
  
  if (existing) {
    // Update existing record
    await db.settings.update('settings-main', updates);
  } else {
    // Create new record with defaults
    await db.settings.put({
      id: 'settings-main',
      pin: '',
      recoveryKey: '',
      autoLockSeconds: 300,
      biometricsEnabled: false,
      ...updates
    });
  }
};

// Utility: Get documents expiring soon
export const getExpiringDocuments = async (daysAhead: number = 90): Promise<Document[]> => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  const allDocs = await db.documents.toArray();

  return allDocs.filter(doc => {
    if (!doc.expiry_date) return false;
    const expiryDate = new Date(doc.expiry_date);
    return expiryDate >= now && expiryDate <= futureDate;
  }).sort((a, b) => {
    const dateA = new Date(a.expiry_date!);
    const dateB = new Date(b.expiry_date!);
    return dateA.getTime() - dateB.getTime();
  });
};

// Check if vault is initialized
export const isVaultInitialized = async (): Promise<boolean> => {
  const settings = await db.settings.get('settings-main');
  const hasPin = settings?.pin !== undefined && settings.pin !== '';
  return hasPin;
};

// ⚠️ FUTURE: Encryption layer
// TODO: Implement WebCrypto-based encryption
// - generateKeyFromPin(pin: string): Promise<CryptoKey>
// - encryptVaultData(data: VaultData, key: CryptoKey): Promise<string>
// - decryptVaultData(encrypted: string, key: CryptoKey): Promise<VaultData>
// - exportVault(): Promise<Blob> - encrypted backup
// - importVault(blob: Blob, pin: string): Promise<void>
