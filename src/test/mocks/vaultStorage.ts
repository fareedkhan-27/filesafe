import { vi } from 'vitest';
import { VaultSettings, Profile, Document } from '../../types/vault';

// Mock data
export const mockSettings: VaultSettings = {
  pin: '123456',
  recoveryKey: 'ABCD-EFGH-IJKL-MNOP',
  createdAt: '2024-12-06T00:00:00.000Z',
  biometricsEnabled: false
};

export const mockProfile: Profile = {
  id: 'profile-me',
  name: 'Me',
  relationship: 'self',
  avatar: '👤',
  createdAt: '2024-12-06T00:00:00.000Z'
};

export const mockDocument: Document = {
  id: 'doc-1',
  profileId: 'profile-me',
  type: 'passport',
  title: 'My Passport',
  full_name: 'John Doe',
  date_of_birth: '1990-01-01',
  nationality: 'US',
  passportNumber: 'AB1234567',
  issue_date: '2020-01-01',
  expiry_date: '2030-01-01',
  issuing_authority: 'US Government',
  customFields: [],
  createdAt: '2024-12-06T00:00:00.000Z',
  updatedAt: '2024-12-06T00:00:00.000Z'
};

// Mock storage functions
export const mockVaultStorage = {
  // Settings
  getSettings: vi.fn().mockResolvedValue(null),
  updateSettings: vi.fn().mockResolvedValue(undefined),
  isVaultInitialized: vi.fn().mockResolvedValue(false),

  // Profiles
  getAllProfiles: vi.fn().mockResolvedValue([]),
  getProfileById: vi.fn().mockResolvedValue(null),
  createProfile: vi.fn().mockResolvedValue(undefined),
  updateProfile: vi.fn().mockResolvedValue(undefined),
  deleteProfile: vi.fn().mockResolvedValue(undefined),

  // Documents
  getAllDocuments: vi.fn().mockResolvedValue([]),
  getDocumentById: vi.fn().mockResolvedValue(null),
  createDocument: vi.fn().mockResolvedValue(undefined),
  updateDocument: vi.fn().mockResolvedValue(undefined),
  deleteDocument: vi.fn().mockResolvedValue(undefined),
  getExpiringDocuments: vi.fn().mockResolvedValue([]),

  // Database
  db: {
    delete: vi.fn().mockResolvedValue(undefined)
  }
};

// Helper to reset all mocks
export const resetVaultStorageMocks = () => {
  Object.values(mockVaultStorage).forEach(mock => {
    if (typeof mock === 'function' && 'mockClear' in mock) {
      mock.mockClear();
    }
  });
  mockVaultStorage.db.delete.mockClear();
};

