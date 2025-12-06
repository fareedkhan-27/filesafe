# 🔐 Security Roadmap - FileSafe

**Status:** Planned for v1.3.0+  
**Last Updated:** December 6, 2024

---

## 🎯 Overview

This document outlines critical security enhancements planned for future releases of FileSafe. The current version (v1.2.1) is a **prototype** with basic security. These improvements are **required** before any production use with real sensitive data.

---

## 🔴 Priority 1: Critical Security (v1.3.0) - Required Before Production

### 1.1 Cryptographically Secure Random Number Generator ✅ FIXED in v1.2.2

**Previous Issue:**
- Recovery key generation used `Math.random()` which was NOT cryptographically secure
- File: `src/utils/recoveryKey.ts` (line 13)
- Risk: Recovery keys could be predictable, allowing attackers to guess them

**Status:** ✅ **FIXED** - Now uses `crypto.getRandomValues()`

**Solution:**
```typescript
// Replace Math.random() with crypto.getRandomValues()
export const generateRecoveryKey = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = Array.from({ length: 4 }, () => {
    return Array.from({ length: 4 }, () => {
      // ✅ Cryptographically secure random
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      const randomIndex = randomArray[0] % chars.length;
      return chars[randomIndex];
    }).join('');
  });
  return segments.join('-');
};
```

**Impact:** ✅ High - Prevents recovery key prediction attacks  
**Effort:** 🟢 Low - 15 minutes  
**Priority:** 🔴 **CRITICAL** - Must fix before any real use

---

### 1.2 PIN Hashing with Web Crypto API

**Current Issue:**
- PINs stored in plain text in IndexedDB
- Files: `src/context/VaultContext.tsx` (line 143), `src/types/vault.ts` (line 94)
- Risk: Anyone with IndexedDB access can read PINs in plain text

**Current Code:**
```typescript
// ⚠️ INSECURE
if (currentSettings.pin === pin) {  // Plain text comparison
  // ...
}
```

**Solution:**
```typescript
// Hash PIN with SHA-256 before storing
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// When creating PIN
const hashedPin = await hashPin(pin);
await updateSettings({ pin: hashedPin });

// When verifying PIN
const hashedInputPin = await hashPin(inputPin);
if (currentSettings.pin === hashedInputPin) {
  // PIN correct
}
```

**Implementation Steps:**
1. Create `src/utils/pinSecurity.ts`
2. Add `hashPin(pin: string): Promise<string>`
3. Update `VaultContext.tsx` - hash on init and unlock
4. Update `OnboardingPage.tsx` - hash before saving
5. Update `ForgotPinPage.tsx` - hash new PIN
6. Update `SettingsPage.tsx` - hash new PIN

**Migration Note:**
- Existing users will need to reset their PIN once (cannot migrate from plain text)
- Show migration notice on first load after update

**Impact:** ✅ High - Prevents PIN exposure in database  
**Effort:** 🟡 Medium - 2-3 hours  
**Priority:** 🔴 **CRITICAL** - Must fix before production

---

### 1.3 PIN Attempt Rate Limiting

**Current Issue:**
- No limit on PIN attempts
- File: `src/context/VaultContext.tsx` (unlock function)
- Risk: Brute force attacks (only 1 million combinations for 6-digit PIN)

**Solution:**
```typescript
// Add to VaultContext
const [failedAttempts, setFailedAttempts] = useState(0);
const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

const unlock = async (pin: string): Promise<boolean> => {
  // Check if locked out
  if (lockoutUntil && Date.now() < lockoutUntil) {
    const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
    showError(`Too many attempts. Try again in ${remainingSeconds} seconds.`);
    return false;
  }
  
  // Check if max attempts reached
  if (failedAttempts >= MAX_ATTEMPTS) {
    const newLockoutTime = Date.now() + LOCKOUT_DURATION;
    setLockoutUntil(newLockoutTime);
    showError(`Too many failed attempts. Locked for 5 minutes.`);
    return false;
  }

  const currentSettings = await storage.getSettings();
  const hashedPin = await hashPin(pin);
  
  if (currentSettings.pin === hashedPin) {
    // Success - reset attempts
    setFailedAttempts(0);
    setLockoutUntil(null);
    await refreshAll();
    setIsLocked(false);
    return true;
  } else {
    // Failed - increment attempts
    setFailedAttempts(prev => prev + 1);
    return false;
  }
};
```

**Enhanced Features:**
- Progressive delays (1st fail: 0s, 2nd: 5s, 3rd: 10s, 4th: 30s, 5th: 5min lockout)
- Persist lockout state to localStorage (prevents refresh bypass)
- Show remaining attempts to user
- Optional: Wipe data after 10 consecutive failures

**Impact:** ✅ High - Prevents brute force attacks  
**Effort:** 🟡 Medium - 1-2 hours  
**Priority:** 🔴 **HIGH** - Important for security

---

## 🟡 Priority 2: Enhanced Security (v1.4.0)

### 2.1 Shared PIN Validation Utility

**Current Issue:**
- PIN validation logic duplicated in 4 files
- Files: `App.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`, `ForgotPinPage.tsx`
- Risk: Inconsistent validation if one file is updated but others aren't

**Solution:**
```typescript
// src/utils/pinHelpers.ts
export const PIN_LENGTH = 6;
export const PIN_REGEX = /^\d+$/;

/**
 * Validate PIN input (ensures only digits, max length)
 */
export const validatePinInput = (value: string, maxLength = PIN_LENGTH): boolean => {
  return value.length <= maxLength && PIN_REGEX.test(value);
};

/**
 * Check if PIN meets requirements
 */
export const isPinValid = (pin: string): boolean => {
  return pin.length === PIN_LENGTH && PIN_REGEX.test(pin);
};

/**
 * Check if PIN is weak (e.g., 123456, 000000)
 */
export const isPinWeak = (pin: string): boolean => {
  const weakPins = [
    '123456', '000000', '111111', '222222', '333333',
    '444444', '555555', '666666', '777777', '888888', '999999',
    '654321', '012345'
  ];
  
  // Check if sequential
  const isSequential = /^(?:0123456|1234567|2345678|3456789|9876543|8765432|7654321|6543210|5432109|4321098|3210987|2109876|1098765)/.test(pin);
  
  return weakPins.includes(pin) || isSequential;
};
```

**Impact:** ✅ Medium - Better code maintainability and consistency  
**Effort:** 🟢 Low - 30 minutes  
**Priority:** 🟡 **MEDIUM** - Improves code quality

---

### 2.2 Document Encryption

**Current Status:**
- Documents stored in plain text in IndexedDB
- File: `src/services/vaultStorage.ts` (line 373 - TODO comment)

**Solution:**
```typescript
// Generate encryption key from PIN
async function deriveKeyFromPin(pin: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const pinData = encoder.encode(pin);
  
  // Derive key using PBKDF2
  const baseKey = await crypto.subtle.importKey(
    'raw',
    pinData,
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  // Use a stored salt (generate once per vault)
  const salt = getSalt(); // Stored in settings
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt document before storing
async function encryptDocument(document: Document, key: CryptoKey): Promise<EncryptedDocument> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(document));
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return {
    id: document.id,
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };
}

// Decrypt document when retrieving
async function decryptDocument(encrypted: EncryptedDocument, key: CryptoKey): Promise<Document> {
  const iv = new Uint8Array(encrypted.iv);
  const data = new Uint8Array(encrypted.data);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  const decoder = new TextDecoder();
  const json = decoder.decode(decrypted);
  return JSON.parse(json);
}
```

**Impact:** ✅ Very High - True end-to-end encryption  
**Effort:** 🔴 High - 8-12 hours  
**Priority:** 🟡 **HIGH** - Required for production with sensitive data

---

### 2.3 HTTPS Enforcement

**Current Issue:**
- No check if app is running on HTTP vs HTTPS
- Risk: Data exposed in transit if accessed via HTTP

**Solution:**
```typescript
// Add to App.tsx useEffect
useEffect(() => {
  // Only enforce in production
  if (import.meta.env.PROD && window.location.protocol !== 'https:') {
    // Redirect to HTTPS
    window.location.href = window.location.href.replace('http:', 'https:');
  }
}, []);

// Also add meta tag to index.html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

**Impact:** ✅ Medium - Prevents man-in-the-middle attacks  
**Effort:** 🟢 Low - 15 minutes  
**Priority:** 🟡 **MEDIUM** - Important for production

---

## 🟢 Priority 3: Advanced Security (v2.0.0)

### 3.1 Biometric Authentication (Future)
- Face ID / Touch ID / Windows Hello
- Use Web Authentication API
- Fallback to PIN always available
- Effort: 🔴 High - 16+ hours

### 3.2 Encrypted Cloud Backup (Future)
- Export encrypted vault to cloud (Google Drive, Dropbox)
- Zero-knowledge encryption (cloud provider cannot decrypt)
- Effort: 🔴 High - 20+ hours

### 3.3 Security Audit Logging
- Track all vault access attempts
- Log failed PIN attempts
- Track document access
- Display security log in Settings
- Effort: 🟡 Medium - 4 hours

### 3.4 Session Timeout
- Auto-lock after X minutes of inactivity
- Configurable timeout (5, 10, 15, 30 minutes, never)
- Effort: 🟢 Low - 1 hour

### 3.5 Emergency Wipe Trigger
- Special "panic PIN" that wipes all data
- Useful if forced to unlock under duress
- Effort: 🟡 Medium - 2 hours

---

## 📋 Implementation Timeline

### v1.2.2 - Security Patches ✅ COMPLETED
**Time Actual: 1 hour**
- [x] Fix recovery key random generator (15 min) ✅
- [x] Protected localStorage access (15 min) ✅
- [x] Add error handling to async operations (30 min) ✅

### v1.3.0 - Security Foundations (Target: Next Release)
**Time Estimate: 4-5 hours**
- [ ] Implement PIN hashing (2-3 hours)
- [ ] Add PIN attempt rate limiting (1-2 hours)
- [ ] Add HTTPS enforcement (15 min)
- [ ] Create shared PIN validation utility (30 min)

### v1.4.0 - Document Encryption (Target: 2-3 weeks)
**Time Estimate: 10-12 hours**
- [ ] Implement Web Crypto document encryption (8-10 hours)
- [ ] Migration tool for existing users (2 hours)
- [ ] Update all storage operations (2 hours)

### v2.0.0 - Advanced Features (Target: TBD)
**Time Estimate: 30+ hours**
- [ ] Biometric authentication (16+ hours)
- [ ] Encrypted cloud backup (20+ hours)
- [ ] Security audit logging (4 hours)
- [ ] Session timeout (1 hour)
- [ ] Emergency wipe trigger (2 hours)

---

## 🧪 Security Testing Checklist

Before marking each feature as complete, test:

### Recovery Key Security:
- [ ] Generated keys are truly random (no patterns)
- [ ] Keys cannot be predicted
- [ ] Test with 1000+ generated keys

### PIN Hashing:
- [ ] PINs never stored in plain text
- [ ] Cannot reverse hash to get original PIN
- [ ] Existing users can migrate gracefully
- [ ] Test with various PIN combinations

### Rate Limiting:
- [ ] Lockout triggers after max attempts
- [ ] Lockout persists across page refreshes
- [ ] Timer counts down correctly
- [ ] Successful login resets counter

### Document Encryption:
- [ ] Documents unreadable in IndexedDB
- [ ] Decryption only works with correct PIN
- [ ] Performance impact acceptable (< 100ms per document)
- [ ] Large documents (images) handle correctly

---

## 📚 References

- [Web Crypto API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Crypto.getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
- [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)

---

## ⚠️ Security Notice

**Current Version (v1.2.1) Security Status:**

```
🔴 NOT PRODUCTION READY FOR SENSITIVE DATA
```

**Known Security Limitations:**
- ❌ PINs stored in plain text
- ❌ Documents stored in plain text
- ❌ Recovery keys use weak random generator
- ❌ No rate limiting on PIN attempts
- ❌ No encryption at rest

**Safe for:**
- ✅ Development and testing
- ✅ Demo purposes
- ✅ Non-sensitive data

**NOT safe for:**
- ❌ Real passports, IDs, or financial documents
- ❌ Production deployment with user data
- ❌ Anything you wouldn't write on a sticky note

**Recommendation:**
Implement v1.3.0 security features (PIN hashing, secure random, rate limiting) before any real-world use.

---

*Last Updated: December 6, 2024*  
*Current Version: v1.2.1*  
*Next Security Release: v1.3.0 (Planned)*

