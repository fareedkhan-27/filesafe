// Recovery Key Utilities

/**
 * Generate a random recovery key in format: XXXX-XXXX-XXXX-XXXX
 * Uses uppercase letters and numbers (excluding ambiguous characters)
 */
export const generateRecoveryKey = (): string => {
  // Exclude ambiguous characters: 0, O, 1, I, L
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  const segments = Array.from({ length: 4 }, () => {
    return Array.from({ length: 4 }, () => {
      // ✅ Use cryptographically secure random (Web Crypto API)
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      const randomIndex = randomArray[0] % chars.length;
      return chars[randomIndex];
    }).join('');
  });

  return segments.join('-');
};

/**
 * Validate recovery key format
 */
export const validateRecoveryKeyFormat = (key: string): boolean => {
  // Should be: XXXX-XXXX-XXXX-XXXX
  const regex = /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
  return regex.test(key);
};

/**
 * Format recovery key input (auto-add dashes)
 */
export const formatRecoveryKeyInput = (input: string): string => {
  // Remove all non-alphanumeric characters and convert to uppercase
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Add dashes every 4 characters
  const segments = [];
  for (let i = 0; i < clean.length; i += 4) {
    segments.push(clean.slice(i, i + 4));
  }

  return segments.join('-').slice(0, 19); // Max length: XXXX-XXXX-XXXX-XXXX
};

/**
 * Compare recovery keys (case-insensitive, ignores dashes)
 */
export const compareRecoveryKeys = (key1: string, key2: string): boolean => {
  const normalize = (key: string) => key.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return normalize(key1) === normalize(key2);
};
