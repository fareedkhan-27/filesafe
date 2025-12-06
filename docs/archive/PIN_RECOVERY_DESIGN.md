# PIN Recovery & Account Recovery Design

## 🚨 The Problem

**User forgets PIN** → Locked out → Loses all documents

This is a **critical UX failure** that makes the app unusable.

---

## 🎯 Solution Strategy

We need **multiple recovery options** based on security level:

1. **Prototype (v0.1)**: Simple browser-based recovery
2. **Encrypted (v1.0)**: Recovery key backup
3. **Secure (v2.0)**: Multi-factor recovery

---

## 📱 Prototype Solution (Implement Now)

### Option 1: Recovery Key

**How it works:**
1. During PIN setup, generate a random recovery key
2. Show it to user: "Save this recovery key: **RXKP-2H9F-LM4Q-8TYN**"
3. User must write it down or copy it
4. Store key in settings (separate from PIN)
5. On forgot PIN → Enter recovery key → Reset PIN

**Implementation:**

```typescript
// Generate recovery key
function generateRecoveryKey(): string {
  const segments = Array.from({ length: 4 }, () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  });
  return segments.join('-');
}

// Save during onboarding
const recoveryKey = generateRecoveryKey();
await updateSettings({
  pin: userPin,
  recoveryKey: recoveryKey
});

// Show to user
alert(`⚠️ SAVE THIS RECOVERY KEY:
${recoveryKey}

Write it down and keep it safe.
You'll need it if you forget your PIN.`);
```

**UI Flow:**

```
Onboarding:
┌────────────────────────────────────┐
│ PIN Created Successfully! ✓        │
│                                    │
│ Your Recovery Key:                 │
│ ┌────────────────────────────────┐ │
│ │  RXKP-2H9F-LM4Q-8TYN          │ │
│ │  [Copy to Clipboard]          │ │
│ └────────────────────────────────┘ │
│                                    │
│ ⚠️ Write this down NOW!            │
│ You'll need it if you forget PIN  │
│                                    │
│ [ ] I've saved my recovery key    │
│ [Continue] (disabled until checked)│
└────────────────────────────────────┘

Lock Screen (Forgot PIN):
┌────────────────────────────────────┐
│ Enter PIN                          │
│ ○ ○ ○ ○ ○ ○                      │
│                                    │
│ [Forgot PIN?]                     │
└────────────────────────────────────┘
                ↓
┌────────────────────────────────────┐
│ Reset PIN                          │
│                                    │
│ Enter your recovery key:           │
│ [____-____-____-____]             │
│                                    │
│ [Verify & Reset PIN]              │
│ [Cancel]                          │
└────────────────────────────────────┘
                ↓
┌────────────────────────────────────┐
│ Create New PIN                     │
│ ○ ○ ○ ○ ○ ○                      │
└────────────────────────────────────┘
```

**Pros:**
- ✅ Simple to implement (1 hour)
- ✅ Standard practice (like password managers)
- ✅ Offline-capable
- ✅ No external dependencies

**Cons:**
- ⚠️ User must save it (many won't)
- ⚠️ If lost, still locked out
- ⚠️ Not encrypted (prototype limitation)

---

### Option 2: Browser Storage Emergency Access

**How it works:**
1. User forgets PIN
2. Clicks "Emergency Reset"
3. Shows warning: "This will reveal your PIN"
4. Requires biometric/system auth (if available)
5. Shows PIN or allows reset

**Implementation:**

```typescript
// On lock screen
<button onClick={handleEmergencyAccess}>
  Forgot PIN? Emergency Access
</button>

async function handleEmergencyAccess() {
  // Show scary warning
  const confirmed = confirm(`
    ⚠️ EMERGENCY ACCESS ⚠️

    This will show your current PIN.

    In the secure version, this won't be possible.
    Data will be permanently locked without recovery key.

    Continue?
  `);

  if (confirmed) {
    const settings = await getSettings();
    alert(`Your PIN is: ${settings.pin}`);
    // Or redirect to PIN reset
  }
}
```

**Pros:**
- ✅ Always works
- ✅ No external keys to save
- ✅ Quick implementation

**Cons:**
- ⚠️ Only works in prototype (unencrypted data)
- ⚠️ Security theater (defeats purpose of PIN)
- ⚠️ Must be removed in v1.0

**Recommendation:** Use this for prototype, but add big warnings.

---

### Option 3: Email/SMS Recovery (Future)

**Requires backend** - not for current prototype.

---

## 🔐 Secure Version Solution (v1.0+)

Once data is encrypted, PIN recovery becomes **much harder**.

### The Encryption Problem

```
PIN → PBKDF2 → Encryption Key → Encrypted Data

If user forgets PIN:
  - Can't derive encryption key
  - Can't decrypt data
  - Data is permanently lost
```

**This is how it works in:**
- 1Password
- LastPass
- Apple Keychain
- BitWarden

**If you forget master password → Data is gone forever.**

---

### Solution 1: Recovery Key (Encrypted)

**Standard approach** (used by 1Password, BitWarden):

**Setup:**
1. Generate random 128-bit key
2. Encrypt vault with this key
3. Encrypt recovery key with PIN-derived key
4. Show recovery key to user in human-readable format

**Recovery:**
1. User enters recovery key
2. Use recovery key to decrypt vault
3. Set new PIN
4. Re-encrypt with new PIN

**Format:**
```
A3-B7K9-XM4P-QR2T-F8NH-G5LW-YJ6C-D9VZ
```

**Implementation:**

```typescript
// Generate recovery key
async function generateRecoveryKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Export for display
async function exportRecoveryKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  const bytes = new Uint8Array(exported);

  // Convert to base32 (human-readable)
  return base32Encode(bytes);
}

// Encrypt vault with recovery key
async function encryptVault(data: VaultData, recoveryKey: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    recoveryKey,
    JSON.stringify(data)
  );
  return { encrypted, iv };
}
```

**UX:**

```
During Onboarding:
┌────────────────────────────────────────┐
│ ⚠️ CRITICAL: Save Your Recovery Key    │
├────────────────────────────────────────┤
│ If you forget your PIN, this is the   │
│ ONLY way to recover your data.        │
│                                        │
│ Recovery Key:                          │
│ ┌────────────────────────────────────┐ │
│ │ A3B7-K9XM-4PQR-2TF8-NH              │ │
│ │ G5LW-YJ6C-D9VZ-3M8P                 │ │
│ │                                     │ │
│ │ [Copy]  [Print]  [Download PDF]   │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Where to save:                         │
│ ✓ Write on paper, store safely        │
│ ✓ Print and keep in safe/vault        │
│ ✓ Save in separate password manager   │
│                                        │
│ ✗ Don't save in FileSafe               │
│ ✗ Don't screenshot                     │
│ ✗ Don't email to yourself              │
│                                        │
│ ☐ I've saved my recovery key safely   │
│ [Continue]                            │
└────────────────────────────────────────┘
```

**Pros:**
- ✅ Industry standard
- ✅ True security (encrypted)
- ✅ Offline
- ✅ No backend needed

**Cons:**
- ⚠️ User must save it
- ⚠️ If lost, data is gone forever
- ⚠️ Users often don't understand importance

---

### Solution 2: Security Questions (Weak)

**DON'T DO THIS**

Security questions are:
- Easily guessable
- Reduce entropy
- Not recommended by NIST

---

### Solution 3: Trusted Contact Recovery

**How it works:**
1. User designates 2-3 trusted contacts
2. Recovery key is split into shares (Shamir's Secret Sharing)
3. Each contact gets one share
4. Need 2 out of 3 shares to recover

**Example:**
```
Recovery Key: ABCDEFGH12345678

Split into 3 shares:
  Share 1 → Mom:     K8P2-XM9Q-...
  Share 2 → Wife:    R4T7-LN3F-...
  Share 3 → Brother: Y6H5-WJ8C-...

To recover: Get any 2 shares → Reconstruct key
```

**Pros:**
- ✅ Social backup
- ✅ No single point of failure
- ✅ Very secure

**Cons:**
- ⚠️ Complex to implement
- ⚠️ Requires cooperation
- ⚠️ Privacy concerns

---

### Solution 4: Cloud Backup with Email Recovery

**How it works:**
1. Encrypt recovery key with email-derived key
2. Upload encrypted recovery key to server
3. To recover: Enter email → Get code → Download recovery key

**Requires:**
- Backend server
- Email service
- User account system

**Pros:**
- ✅ Can't lose physical key
- ✅ Easy UX
- ✅ Industry standard

**Cons:**
- ⚠️ Requires backend
- ⚠️ Email compromise = vault compromise
- ⚠️ Not truly zero-knowledge

---

## 🎯 Recommended Approach

### For Prototype (Now)
**Use Recovery Key (Option 1)**

**Implementation Steps:**
1. Generate 16-character recovery key during onboarding
2. Force user to copy/save it (can't skip)
3. Add "Forgot PIN?" link on lock screen
4. Enter recovery key → Reset PIN
5. Show clear warnings about saving it

**Time:** 2-3 hours
**Impact:** Critical (prevents lockout)

---

### For Encrypted Version (v1.0)
**Use Recovery Key + Optional Cloud Backup**

**Default Flow:**
1. Generate cryptographic recovery key
2. Show in human-readable format
3. User MUST save (checkbox + confirmation)
4. Optional: Upload encrypted copy to cloud (with email recovery)

**Advanced Options:**
- Export to PDF
- Print recovery sheet
- Split into shares (for power users)

---

## 📋 Implementation Plan

### Phase 1: Prototype Recovery (This Week)

**Files to Create:**
- `src/components/RecoveryKeyDisplay.tsx`
- `src/pages/ForgotPinPage.tsx`

**Files to Update:**
- `src/pages/OnboardingPage.tsx` - Show recovery key
- `src/App.tsx` - Add forgot PIN route
- `src/types/vault.ts` - Add `recoveryKey` to settings

**Code:**

```typescript
// In OnboardingPage.tsx - after PIN setup
const recoveryKey = generateRecoveryKey();
await updateSettings({
  pin: newPin,
  recoveryKey: recoveryKey
});

// Show recovery key screen
setStep('recovery-key');

// Generate function
function generateRecoveryKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  );
  return segments.join('-');
}
```

---

### Phase 2: Secure Recovery (v1.0)

**Use WebCrypto:**

```typescript
// Generate recovery key
const recoveryKey = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
);

// Export for user
const exported = await crypto.subtle.exportKey('raw', recoveryKey);
const base32 = base32Encode(new Uint8Array(exported));

// Encrypt vault with recovery key
const { encrypted, iv } = await encryptVaultWithKey(vaultData, recoveryKey);

// Store encrypted vault
localStorage.setItem('vault', btoa(encrypted));
```

---

## 🎨 UX Best Practices

### 1. Make Saving Recovery Key Mandatory

**Bad:**
```
[ ] I've saved my recovery key (skippable)
```

**Good:**
```
Type "I understand I'll lose everything if I lose this key"
[________________________]

[Continue] (enabled only when typed correctly)
```

### 2. Offer Multiple Save Options

```
┌────────────────────────────────────┐
│ Save Your Recovery Key:            │
│                                    │
│ [📋 Copy to Clipboard]            │
│ [🖨️ Print Recovery Sheet]         │
│ [📥 Download PDF]                 │
│ [📧 Email to Myself] (not secure) │
└────────────────────────────────────┘
```

### 3. Test Recovery During Onboarding

```
Step 3: Verify Recovery Key
┌────────────────────────────────────┐
│ To make sure you saved it,         │
│ please enter your recovery key:    │
│                                    │
│ [____-____-____-____]             │
│                                    │
│ [Verify]                          │
└────────────────────────────────────┘
```

### 4. Show Periodic Reminders

```
After 30 days:
┌────────────────────────────────────┐
│ ⚠️ Recovery Key Check              │
│                                    │
│ Do you still have your recovery    │
│ key saved? Test it now:            │
│                                    │
│ [Test Recovery]  [I'm Sure]       │
└────────────────────────────────────┘
```

---

## 🔒 Security Considerations

### 1. Recovery Key Security

**Storage:**
- ✅ Paper in safe/lockbox
- ✅ Printed and stored securely
- ✅ Separate password manager
- ❌ In the same app
- ❌ Unencrypted on device
- ❌ In email/cloud storage

### 2. Attack Vectors

**Brute Force:**
- 16-character alphanumeric = 95^16 combinations
- Impossible to brute force

**Social Engineering:**
- Attacker calls user: "I'm from FileSafe support..."
- User gives recovery key
- **Mitigation:** Warn users NEVER share recovery key

### 3. Recovery Key vs PIN

**PIN:**
- Short (6 digits)
- Easy to remember
- Entered frequently
- Can be changed

**Recovery Key:**
- Long (16+ chars)
- Impossible to remember
- Used once (maybe never)
- Can't be changed (tied to encryption)

---

## 📊 Analytics to Track

1. **% users who save recovery key** (Goal: 100%)
2. **% users who test recovery** (Goal: 50%+)
3. **Recovery attempts** (should be rare)
4. **Failed recoveries** (lost key)
5. **Lockout rate** (should be near 0%)

---

## 🎯 Summary & Next Steps

### Immediate Action (Prototype)
1. ✅ Add simple recovery key generation
2. ✅ Show on onboarding (force save)
3. ✅ Add "Forgot PIN?" flow
4. ✅ Test recovery works

**Time:** 2-3 hours
**Impact:** 🔥 Critical

### Future (Encrypted Version)
1. Use cryptographic recovery key
2. Add cloud backup option
3. Consider social recovery (shares)
4. Implement recovery testing

---

## 🚀 Want Me to Implement This Now?

I can add the recovery key system to your prototype right now:

1. **Recovery key generation** during onboarding
2. **Recovery key display** with copy/save options
3. **Forgot PIN flow** on lock screen
4. **Recovery verification** before continuing

**Estimated time:** 2-3 hours of implementation

**Should I proceed?** 🚀

---

**Remember:** In security, there's always a tradeoff between usability and security. Recovery keys are the industry-standard solution to this problem.
