import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import OnboardingPage from '../OnboardingPage';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock clipboard utilities
vi.mock('../../utils/clipboard', () => ({
  copyToClipboard: vi.fn().mockResolvedValue(true),
  triggerHapticFeedback: vi.fn()
}));

// Mock storage - simplified approach
vi.mock('../../services/vaultStorage', () => ({
  updateSettings: vi.fn().mockResolvedValue(undefined),
  getAllProfiles: vi.fn().mockResolvedValue([]),
  createProfile: vi.fn().mockResolvedValue(undefined),
  isVaultInitialized: vi.fn().mockResolvedValue(false),
  getSettings: vi.fn().mockResolvedValue(null),
  getAllDocuments: vi.fn().mockResolvedValue([]),
  db: {
    delete: vi.fn().mockResolvedValue(undefined)
  }
}));

describe('OnboardingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  describe('Welcome Step', () => {
    it('should render welcome screen', () => {
      render(<OnboardingPage />);
      
      expect(screen.getByRole('heading', { name: /welcome to filesafe/i })).toBeInTheDocument();
      expect(screen.getByText(/your family documents, secure and private/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /i understand/i })).toBeInTheDocument();
    });

    it('should show privacy policy link', () => {
      render(<OnboardingPage />);
      
      const privacyLink = screen.getByText(/privacy policy/i);
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy');
    });

    it('should show "Already have a vault?" button', () => {
      render(<OnboardingPage />);
      
      const loginButton = screen.getByRole('button', { name: /already have a vault\? login here/i });
      expect(loginButton).toBeInTheDocument();
    });

    it('should move to PIN entry step when clicking "I Understand"', async () => {
      const user = userEvent.setup();
      render(<OnboardingPage />);
      
      const continueButton = screen.getByRole('button', { name: /i understand/i });
      await user.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /create your pin/i })).toBeInTheDocument();
      });
    });

    it('should show error when clicking login with no vault', async () => {
      const user = userEvent.setup();
      const { isVaultInitialized } = await import('../../services/vaultStorage');
      vi.mocked(isVaultInitialized).mockResolvedValueOnce(false);
      
      render(<OnboardingPage />);
      
      const loginButton = screen.getByRole('button', { name: /already have a vault\? login here/i });
      await user.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/no vault found/i)).toBeInTheDocument();
      });
    });
  });

  describe('PIN Entry Step', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<OnboardingPage />);
      
      // Move to PIN entry step
      const continueButton = screen.getByRole('button', { name: /i understand/i });
      await user.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /create your pin/i })).toBeInTheDocument();
      });
    });

    it('should show PIN entry screen', () => {
      expect(screen.getByRole('heading', { name: /create your pin/i })).toBeInTheDocument();
      expect(screen.getByText(/create a 6-digit pin to secure your vault/i)).toBeInTheDocument();
    });

    it('should display PIN dots as user enters PIN', async () => {
      const user = userEvent.setup();
      
      const button1 = screen.getByRole('button', { name: /enter 1/i });
      await user.click(button1);
      
      const pinDots = screen.getAllByRole('status');
      expect(pinDots).toHaveLength(1); // Should have at least one status element for PIN display
    });

    it('should only accept numeric input', async () => {
      const user = userEvent.setup();
      
      // Try to enter non-numeric (should not work via number pad, but test the validation)
      const button1 = screen.getByRole('button', { name: /enter 1/i });
      await user.click(button1);
      
      // PIN should be 1 digit
      const pinDisplay = screen.getByRole('status', { name: /pin entered: 1 of 6 digits/i });
      expect(pinDisplay).toBeInTheDocument();
    });

    it('should move to confirm step after entering 6 digits', async () => {
      const user = userEvent.setup();
      
      // Enter 6 digits
      for (let i = 1; i <= 6; i++) {
        const button = screen.getByRole('button', { name: new RegExp(`enter ${i}`, 'i') });
        await user.click(button);
      }
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /confirm your pin/i })).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should allow delete last digit', async () => {
      const user = userEvent.setup();
      
      // Enter 2 digits
      const button1 = screen.getByRole('button', { name: /enter 1/i });
      await user.click(button1);
      await user.click(button1);
      
      // Delete one
      const deleteButton = screen.getByRole('button', { name: /delete last digit/i });
      await user.click(deleteButton);
      
      // Should show 1 digit entered
      const pinDisplay = screen.getByRole('status', { name: /pin entered: 1 of 6 digits/i });
      expect(pinDisplay).toBeInTheDocument();
    });

    it('should show back button', () => {
      const backButton = screen.getByRole('button', { name: /go back/i });
      expect(backButton).toBeInTheDocument();
    });
  });

  describe('PIN Confirmation Step', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<OnboardingPage />);
      
      // Move to PIN entry and enter PIN
      await user.click(screen.getByRole('button', { name: /i understand/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /create your pin/i })).toBeInTheDocument();
      });
      
      // Enter PIN: 123456
      for (let i = 1; i <= 6; i++) {
        const button = screen.getByRole('button', { name: new RegExp(`enter ${i}`, 'i') });
        await user.click(button);
      }
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /confirm your pin/i })).toBeInTheDocument();
      });
    });

    it('should show confirmation screen', () => {
      expect(screen.getByRole('heading', { name: /confirm your pin/i })).toBeInTheDocument();
    });

    it('should show error if PINs do not match', async () => {
      const user = userEvent.setup();
      
      // Enter different PIN: 654321
      for (let i = 6; i >= 1; i--) {
        const button = screen.getByRole('button', { name: new RegExp(`enter ${i}`, 'i') });
        await user.click(button);
      }
      
      await waitFor(() => {
        expect(screen.getByText(/pins do not match/i)).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should proceed to recovery key step if PINs match', async () => {
      const user = userEvent.setup();
      
      // Enter same PIN: 123456
      for (let i = 1; i <= 6; i++) {
        const button = screen.getByRole('button', { name: new RegExp(`enter ${i}`, 'i') });
        await user.click(button);
      }
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /save your recovery key/i })).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should allow going back to PIN entry', async () => {
      const user = userEvent.setup();
      
      const backButton = screen.getByRole('button', { name: /go back/i });
      await user.click(backButton);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /create your pin/i })).toBeInTheDocument();
      });
    });
  });

  describe('Recovery Key Step', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<OnboardingPage />);
      
      // Navigate to recovery key step
      await user.click(screen.getByRole('button', { name: /i understand/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /create your pin/i })).toBeInTheDocument();
      });
      
      // Enter PIN twice
      for (let round = 0; round < 2; round++) {
        for (let i = 1; i <= 6; i++) {
          const button = screen.getByRole('button', { name: new RegExp(`enter ${i}`, 'i') });
          await user.click(button);
        }
        
        if (round === 0) {
          await waitFor(() => {
            expect(screen.getByRole('heading', { name: /confirm your pin/i })).toBeInTheDocument();
          });
        }
      }
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /save your recovery key/i })).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should display recovery key', () => {
      expect(screen.getByRole('heading', { name: /save your recovery key/i })).toBeInTheDocument();
      
      // Recovery key should be visible (format: XXXX-XXXX-XXXX-XXXX)
      const recoveryKeyElement = screen.getByRole('status', { name: /your recovery key is:/i });
      expect(recoveryKeyElement).toBeInTheDocument();
    });

    it('should have download button', () => {
      const downloadButton = screen.getByRole('button', { name: /download recovery key as a text file/i });
      expect(downloadButton).toBeInTheDocument();
    });

    it('should have copy button', () => {
      const copyButton = screen.getByRole('button', { name: /copy recovery key to clipboard/i });
      expect(copyButton).toBeInTheDocument();
    });

    it('should copy recovery key to clipboard', async () => {
      const user = userEvent.setup();
      const { copyToClipboard } = await import('../../utils/clipboard');
      
      const copyButton = screen.getByRole('button', { name: /copy recovery key to clipboard/i });
      await user.click(copyButton);
      
      expect(copyToClipboard).toHaveBeenCalled();
    });

    it('should show error when copy fails', async () => {
      const user = userEvent.setup();
      const { copyToClipboard } = await import('../../utils/clipboard');
      vi.mocked(copyToClipboard).mockResolvedValueOnce(false);
      
      const copyButton = screen.getByRole('button', { name: /copy recovery key to clipboard/i });
      await user.click(copyButton);
      
      await waitFor(() => {
        expect(screen.getByText(/copy not supported/i)).toBeInTheDocument();
      });
    });

    it('should download recovery key', async () => {
      const user = userEvent.setup();
      const createObjectURLMock = vi.spyOn(URL, 'createObjectURL');
      const revokeObjectURLMock = vi.spyOn(URL, 'revokeObjectURL');
      
      const downloadButton = screen.getByRole('button', { name: /download recovery key as a text file/i });
      await user.click(downloadButton);
      
      expect(createObjectURLMock).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalled();
    });

    it('should require confirmation checkbox before continuing', async () => {
      const user = userEvent.setup();
      
      const continueButton = screen.getByRole('button', { name: /continue to vault/i });
      await user.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByText(/please confirm you have saved your recovery key/i)).toBeInTheDocument();
      });
    });

    it('should initialize vault after confirmation', async () => {
      const user = userEvent.setup();
      const { updateSettings, getAllProfiles } = await import('../../services/vaultStorage');
      
      vi.mocked(getAllProfiles).mockResolvedValueOnce([]);
      
      // Check the confirmation checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      // Click continue
      const continueButton = screen.getByRole('button', { name: /continue to vault/i });
      await user.click(continueButton);
      
      await waitFor(() => {
        expect(updateSettings).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
      });
    });

    it('should show error if vault initialization fails', async () => {
      const user = userEvent.setup();
      const { updateSettings } = await import('../../services/vaultStorage');
      
      vi.mocked(updateSettings).mockRejectedValueOnce(new Error('Database error'));
      
      // Check the confirmation checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      // Click continue
      const continueButton = screen.getByRole('button', { name: /continue to vault/i });
      await user.click(continueButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to initialize vault/i)).toBeInTheDocument();
      });
    });

    it('should allow going back to PIN confirmation', async () => {
      const user = userEvent.setup();
      
      const backButton = screen.getByRole('button', { name: /go back/i });
      await user.click(backButton);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /confirm your pin/i })).toBeInTheDocument();
      });
    });
  });

  describe('Integration - Full Onboarding Flow', () => {
    it('should complete full onboarding flow successfully', async () => {
      const user = userEvent.setup();
      const { updateSettings, getAllProfiles } = await import('../../services/vaultStorage');
      
      vi.mocked(getAllProfiles).mockResolvedValueOnce([]);
      
      render(<OnboardingPage />);
      
      // Step 1: Welcome screen - click "I Understand"
      await user.click(screen.getByRole('button', { name: /i understand/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /create your pin/i })).toBeInTheDocument();
      });
      
      // Step 2: Enter PIN (123456)
      for (let i = 1; i <= 6; i++) {
        await user.click(screen.getByRole('button', { name: new RegExp(`enter ${i}`, 'i') }));
      }
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /confirm your pin/i })).toBeInTheDocument();
      });
      
      // Step 3: Confirm PIN (123456)
      for (let i = 1; i <= 6; i++) {
        await user.click(screen.getByRole('button', { name: new RegExp(`enter ${i}`, 'i') }));
      }
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /save your recovery key/i })).toBeInTheDocument();
      }, { timeout: 1000 });
      
      // Step 4: Check confirmation checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      // Step 5: Click continue
      await user.click(screen.getByRole('button', { name: /continue to vault/i }));
      
      // Verify vault was initialized and navigation occurred
      await waitFor(() => {
        expect(updateSettings).toHaveBeenCalledWith({
          pin: '123456',
          recoveryKey: expect.any(String)
        });
        expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<OnboardingPage />);
      
      expect(screen.getByRole('heading', { name: /welcome to filesafe/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /i understand/i })).toBeInTheDocument();
    });

    it('should announce PIN entry progress', async () => {
      const user = userEvent.setup();
      render(<OnboardingPage />);
      
      await user.click(screen.getByRole('button', { name: /i understand/i }));
      
      await waitFor(() => {
        const pinStatus = screen.getByRole('status', { name: /pin entered: 0 of 6 digits/i });
        expect(pinStatus).toBeInTheDocument();
      });
    });
  });
});

