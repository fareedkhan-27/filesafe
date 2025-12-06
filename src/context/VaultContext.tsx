// Vault Context - Global state management for FileSafe
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, Document, VaultSettings } from '../types/vault';
import * as storage from '../services/vaultStorage';

interface VaultContextType {
  // State
  profiles: Profile[];
  documents: Document[];
  settings: VaultSettings | null;
  currentProfileId: string;
  isLocked: boolean;
  isInitialized: boolean;
  isLoading: boolean;

  // Actions
  setCurrentProfileId: (id: string) => void;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
  initializeVault: (pin: string, recoveryKey: string) => Promise<void>;

  // Data operations
  refreshProfiles: () => Promise<void>;
  refreshDocuments: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within VaultProvider');
  }
  return context;
};

interface VaultProviderProps {
  children: ReactNode;
}

export const VaultProvider: React.FC<VaultProviderProps> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [settings, setSettings] = useState<VaultSettings | null>(null);
  const [currentProfileId, setCurrentProfileId] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check initialization status on mount
  useEffect(() => {
    const checkInit = async () => {
      try {
        const initialized = await storage.isVaultInitialized();
        console.log('[VaultContext] Vault initialization check:', initialized);
        setIsInitialized(initialized);

        // Removed: Sample data initialization
        // User will create their vault through onboarding
        
        setIsLoading(false);
      } catch (error) {
        console.error('[VaultContext] Failed to check vault initialization:', error);
        setIsLoading(false);
      }
    };

    checkInit();
  }, []);

  // Refresh functions
  const refreshProfiles = async () => {
    const data = await storage.getAllProfiles();
    setProfiles(data);

    // Set default current profile if not set
    if (!currentProfileId && data.length > 0) {
      const meProfile = data.find(p => p.relationship === 'self') || data[0];
      setCurrentProfileId(meProfile.id);
    }
  };

  const refreshDocuments = async () => {
    const data = await storage.getAllDocuments();
    setDocuments(data);
  };

  const refreshSettings = async () => {
    const data = await storage.getSettings();
    setSettings(data || null);
  };

  const refreshAll = async () => {
    await Promise.all([
      refreshProfiles(),
      refreshDocuments(),
      refreshSettings()
    ]);
  };

  // Initialize vault with PIN and recovery key
  const initializeVault = async (pin: string, recoveryKey: string) => {
    try {
      // Save settings (PIN and recovery key)
      await storage.updateSettings({ pin, recoveryKey });
      
      // Check if "Me" profile already exists
      const existingProfiles = await storage.getAllProfiles();
      
      if (existingProfiles.length === 0) {
        // Create default "Me" profile for the user
        const meProfile: Profile = {
          id: 'profile-me',
          name: 'Me',
          relationship: 'self',
          avatar: '👤',
          createdAt: new Date().toISOString()
        };
        
        await storage.createProfile(meProfile);
      }
      
      await refreshAll();
      setIsInitialized(true);
      setIsLocked(false);
    } catch (error) {
      throw error;
    }
  };

  // Unlock vault with PIN
  const unlock = async (pin: string): Promise<boolean> => {
    const currentSettings = await storage.getSettings();

    if (!currentSettings) {
      return false;
    }

    // ⚠️ PROTOTYPE: Plain text comparison (NOT SECURE)
    if (currentSettings.pin === pin) {
      await refreshAll();
      setIsLocked(false);
      return true;
    }

    return false;
  };

  // Lock vault
  const lock = () => {
    setIsLocked(true);
    // Clear sensitive data from memory
    setProfiles([]);
    setDocuments([]);
  };

  const value: VaultContextType = {
    profiles,
    documents,
    settings,
    currentProfileId,
    isLocked,
    isInitialized,
    isLoading,
    setCurrentProfileId,
    unlock,
    lock,
    initializeVault,
    refreshProfiles,
    refreshDocuments,
    refreshSettings,
    refreshAll
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
};
