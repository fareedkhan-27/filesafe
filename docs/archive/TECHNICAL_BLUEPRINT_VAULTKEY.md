# FileSafe - Technical Blueprint

## 1. High-Level Architecture

### System Overview

FileSafe is a client-side Progressive Web Application (PWA) with no backend dependencies. All data processing, storage, and search happen locally in the browser.

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│  (React Components - Mobile-First, Touch-Optimized)         │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    STATE MANAGEMENT                          │
│         (React Context + Hooks - VaultContext)              │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼──────┐   ┌────────▼────────┐
│ Search Engine│   │ Storage Service │
│  (Rule-based)│   │  (VaultStorage) │
└──────────────┘   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │   IndexedDB     │
                   │   (via Dexie)   │
                   └─────────────────┘
                            │
                   ┌────────▼────────┐
                   │ Browser Storage │
                   └─────────────────┘
```

### Component Layers

#### 1. **UI Layer** (`src/pages/` & `src/components/`)

**Pages (Main Screens):**
- `OnboardingPage` - Initial PIN setup
- `LockScreen` - PIN entry for unlocking
- `HomePage` - Search interface + document list
- `DocumentDetailPage` - Full document view
- `DocumentFormPage` - Add/edit documents
- `ProfilesPage` - Family member management
- `SettingsPage` - App configuration

**Reusable Components:**
- `SearchBar` - Main search input with voice button
- `DocumentCard` - Document preview with copy actions
- `ProfileSelector` - Dropdown for switching profiles
- `QuickChip` - Suggestion chips for common queries
- `FieldItem` - Individual field display with copy button

#### 2. **State Management** (`src/context/VaultContext.tsx`)

Global state managed via React Context:
```typescript
interface VaultContextType {
  profiles: Profile[]
  documents: Document[]
  settings: VaultSettings | null
  currentProfileId: string
  isLocked: boolean
  isInitialized: boolean

  // Actions
  unlock(pin: string): Promise<boolean>
  lock(): void
  setCurrentProfileId(id: string): void
  refreshAll(): Promise<void>
}
```

#### 3. **Storage Layer** (`src/services/vaultStorage.ts`)

Abstraction over IndexedDB using Dexie:
- All CRUD operations for profiles, documents, settings
- Utility functions (e.g., `getExpiringDocuments`)
- **Future**: Encryption/decryption hooks

#### 4. **Search Engine** (`src/services/searchEngine.ts`)

Rule-based natural language query parser:
- Intent extraction (person, document type, field)
- Keyword matching
- Result ranking

#### 5. **PWA Layer** (Vite PWA Plugin)

- **Manifest** - App metadata, icons, display mode
- **Service Worker** - Offline caching, background sync (future)

---

## 2. Data Model

### TypeScript Schemas

```typescript
// Profile (Family Member)
interface Profile {
  id: string                    // e.g., "profile-me"
  name: string                  // e.g., "Sara"
  relationship?: string         // "self" | "spouse" | "child" | "parent"
  avatar?: string               // Emoji or image URL
  createdAt: string             // ISO date string
}

// Document
interface Document {
  id: string                    // e.g., "doc-1"
  profileId: string             // Owner profile ID
  type: DocumentType            // "passport" | "driving_license" | etc.
  title: string                 // Display name

  // Standard fields (may be undefined)
  passport_number?: string
  license_number?: string
  id_number?: string
  full_name?: string
  date_of_birth?: string        // ISO date
  nationality?: string
  issue_date?: string           // ISO date
  expiry_date?: string          // ISO date
  issuing_authority?: string

  // Custom fields
  customFields: CustomField[]

  // Metadata
  createdAt: string
  updatedAt: string
}

// Custom Field
interface CustomField {
  id: string
  label: string                 // e.g., "Visa Type"
  value: string                 // e.g., "Tourist"
  type: FieldType              // "text" | "date" | "number"
}

// Settings
interface VaultSettings {
  pin: string                   // ⚠️ Prototype: plain text
  autoLockSeconds: number       // Auto-lock timeout
  biometricsEnabled: boolean    // Future feature
}
```

### Database Schema (Dexie/IndexedDB)

```javascript
db.version(1).stores({
  profiles: 'id, name',
  documents: 'id, profileId, type, expiry_date',
  settings: 'id'
});
```

### Example JSON Data

```json
{
  "profiles": [
    {
      "id": "profile-me",
      "name": "John",
      "relationship": "self",
      "avatar": "👤",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "profile-wife",
      "name": "Sara",
      "relationship": "spouse",
      "avatar": "👩",
      "createdAt": "2024-01-15T10:01:00Z"
    },
    {
      "id": "profile-kid1",
      "name": "Alex",
      "relationship": "child",
      "avatar": "👦",
      "createdAt": "2024-01-15T10:02:00Z"
    }
  ],
  "documents": [
    {
      "id": "doc-1",
      "profileId": "profile-me",
      "type": "passport",
      "title": "Passport",
      "passport_number": "N1234567",
      "full_name": "John Doe",
      "date_of_birth": "1990-05-15",
      "nationality": "USA",
      "issue_date": "2020-01-10",
      "expiry_date": "2030-01-10",
      "issuing_authority": "US Department of State",
      "customFields": [],
      "createdAt": "2024-01-15T10:05:00Z",
      "updatedAt": "2024-01-15T10:05:00Z"
    },
    {
      "id": "doc-2",
      "profileId": "profile-wife",
      "type": "passport",
      "title": "Passport",
      "passport_number": "P9876543",
      "full_name": "Sara Doe",
      "date_of_birth": "1992-08-22",
      "nationality": "USA",
      "issue_date": "2019-06-20",
      "expiry_date": "2029-06-20",
      "issuing_authority": "US Department of State",
      "customFields": [
        {
          "id": "custom-1",
          "label": "Emergency Contact",
          "value": "+1-555-0123",
          "type": "phone"
        }
      ],
      "createdAt": "2024-01-15T10:06:00Z",
      "updatedAt": "2024-01-15T10:06:00Z"
    }
  ],
  "settings": {
    "id": "settings-main",
    "pin": "123456",
    "autoLockSeconds": 300,
    "biometricsEnabled": false
  }
}
```

---

## 3. Search / "Natural Language" Layer

### Current Implementation (MVP)

**Rule-Based Intent Detection**

The search engine parses queries using keyword matching:

```typescript
// Example query: "When does Sara's passport expire?"

// Step 1: Parse intent
{
  profileName: "Sara",
  profileId: "profile-wife",
  documentType: "passport",
  fieldName: "expiry_date",
  action: "find"
}

// Step 2: Execute search
// - Filter documents by profileId = "profile-wife"
// - Filter by type = "passport"
// - Return document with highlightedField = "expiry_date"
```

**Keyword Mappings:**

- **Document types**: `passport`, `license`, `id card`, `visa`
- **Fields**: `expire`, `expiry`, `number`, `dob`, `birth`, `name`, `nationality`
- **Relationships**: `my`, `wife`, `husband`, `kid`, `child`, `son`, `daughter`

**Limitations:**
- No understanding of complex grammar
- Limited to predefined keywords
- Can't handle ambiguous queries well

### Future Enhancements

#### Option 1: Lightweight NLP (Offline)

Use a small, browser-based NLP library like **compromise.js**:

```javascript
import nlp from 'compromise'

const doc = nlp("When does Sara's passport expire?")

// Extract entities
const person = doc.people().out('text')        // "Sara"
const documentType = doc.nouns().out('text')   // "passport"
const verb = doc.verbs().out('text')           // "expire"
```

**Pros:**
- Still fully offline
- Better understanding of grammar
- More flexible queries

**Cons:**
- Adds ~100KB to bundle size
- Still limited compared to AI models

#### Option 2: Semantic Search with Embeddings

For even better search:

1. Generate embeddings for all document fields using a small model (e.g., **TensorFlow.js** with MobileBERT)
2. Store embeddings in IndexedDB
3. On query, generate embedding and find nearest matches

**Pros:**
- Can handle typos, synonyms, paraphrasing
- Very natural queries

**Cons:**
- Significant complexity
- Larger bundle size (~2-3MB)
- Slower on low-end devices

#### Recommended Approach

For v1.1, stick with **enhanced keyword matching** + basic grammar rules. For v2.0+, consider **compromise.js** or similar.

---

## 4. Security Design (Future Version)

### Threat Model

**What we protect:**
- Document data at rest (in browser storage)
- Document data in memory (when vault is locked)

**What we CANNOT protect:**
- Malware on the device (keyloggers, screen capture)
- Physical access to unlocked vault
- Browser vulnerabilities
- User sharing their PIN

**Attack Scenarios:**
1. **Device theft** → Data encrypted at rest (future)
2. **Malicious browser extension** → Limited protection possible
3. **Memory dump** → Clear data when locked
4. **Backup extraction** → Encrypted backup blobs (future)

### Proposed Secure Implementation

#### 1. Key Derivation from PIN

Use **PBKDF2** to derive an encryption key from the user's PIN:

```typescript
async function deriveKeyFromPin(pin: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const pinData = encoder.encode(pin)

  // Import PIN as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    pinData,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  // Add salt (store per-vault, generated once)
  const salt = crypto.getRandomValues(new Uint8Array(16))

  // Derive AES key
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,  // High iteration count for security
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )

  return key
}
```

#### 2. Encrypt Vault Data

Use **AES-GCM** for authenticated encryption:

```typescript
async function encryptVaultData(
  data: VaultData,
  key: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder()
  const plaintext = encoder.encode(JSON.stringify(data))

  // Generate random IV (12 bytes for GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Encrypt
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    plaintext
  )

  // Combine IV + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.length)

  // Return as base64
  return btoa(String.fromCharCode(...combined))
}
```

#### 3. Decrypt Vault Data

```typescript
async function decryptVaultData(
  encrypted: string,
  key: CryptoKey
): Promise<VaultData> {
  // Decode base64
  const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0))

  // Extract IV and ciphertext
  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)

  // Decrypt
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    ciphertext
  )

  // Parse JSON
  const decoder = new TextDecoder()
  return JSON.parse(decoder.decode(plaintext))
}
```

#### 4. Storage Architecture with Encryption

```typescript
// Store encrypted vault as a single blob
const encryptedBlob = await encryptVaultData(vaultData, key)
localStorage.setItem('vault', encryptedBlob)

// Also store salt (not secret, needed for key derivation)
localStorage.setItem('vault_salt', saltBase64)
```

#### 5. Session Management

```typescript
class SecureVaultSession {
  private key: CryptoKey | null = null
  private autoLockTimer: number | null = null

  async unlock(pin: string): Promise<boolean> {
    try {
      // Derive key
      this.key = await deriveKeyFromPin(pin)

      // Try to decrypt vault (validates PIN)
      const encrypted = localStorage.getItem('vault')
      await decryptVaultData(encrypted, this.key)

      // Start auto-lock timer
      this.startAutoLockTimer()

      return true
    } catch {
      return false
    }
  }

  lock() {
    // Clear key from memory
    this.key = null
    this.stopAutoLockTimer()
  }

  private startAutoLockTimer() {
    this.autoLockTimer = setTimeout(
      () => this.lock(),
      this.settings.autoLockSeconds * 1000
    )
  }
}
```

### Backup & Export

**Encrypted Backup Blob:**

```typescript
async function exportVault(pin: string): Promise<Blob> {
  const key = await deriveKeyFromPin(pin)
  const encrypted = await encryptVaultData(vaultData, key)

  // Create backup file
  const backup = {
    version: '1.0',
    encrypted: encrypted,
    salt: saltBase64,
    timestamp: new Date().toISOString()
  }

  return new Blob([JSON.stringify(backup)], { type: 'application/json' })
}
```

User can download this blob and restore it on another device or browser.

### Limitations of Browser-Based Encryption

**Fundamental Issues:**
1. **JavaScript is visible** - A sophisticated attacker with device access could inject code
2. **No hardware security** - Unlike native apps (iOS Keychain, Android Keystore)
3. **Browser memory** - Data in RAM when vault is unlocked
4. **No secure PIN entry** - No trusted UI for PIN input

**Mitigations:**
- Clear guidance: "This is NOT a replacement for password managers or bank-grade security"
- Auto-lock aggressively
- Warn users about browser extensions
- Consider: Future native app with real hardware-backed encryption

---

## 5. Roadmap

### v0.1 (Current Prototype) ✅

**Features:**
- ✅ Onboarding with PIN setup
- ✅ Lock/unlock flow
- ✅ Profile/family management
- ✅ Document CRUD (create, read, update, delete)
- ✅ Rule-based search engine
- ✅ Quick search suggestions
- ✅ Document expiry tracking
- ✅ PWA manifest and service worker skeleton
- ✅ Mobile-first UI

**Limitations:**
- ⚠️ PIN stored in plain text
- ⚠️ Data unencrypted in IndexedDB
- ⚠️ No backup/export
- ⚠️ No voice input
- ⚠️ No OCR

---

### v1.0 (Encrypted Storage)

**Priority: Security**

**Core Changes:**
- Implement WebCrypto encryption (PBKDF2 + AES-GCM)
- Encrypt all vault data at rest
- Secure session management with auto-lock
- Memory clearing on lock

**New Features:**
- Export encrypted vault backup (JSON blob)
- Import vault from backup
- PIN strength requirements (6-digit minimum)
- Optional biometric unlock (Web Authentication API)

**UX Improvements:**
- Loading states during encryption/decryption
- Better error messages
- Haptic feedback on mobile (Vibration API)

**Deliverables:**
- Encrypted storage implementation in `vaultStorage.ts`
- Updated UI with security indicators
- User documentation on security model

**Timeline:** Implement once prototype is validated

---

### v1.1 (Enhanced Search)

**Priority: Usability**

**Search Improvements:**
- Fuzzy matching for typos
- Synonym support ("license" = "permit")
- Better date parsing ("next month", "in 2 weeks")
- Search history

**UI Enhancements:**
- Inline editing of fields from search results
- Bulk operations (e.g., "show all expiring documents")
- Keyboard shortcuts for power users

**Deliverables:**
- Enhanced `searchEngine.ts` with fuzzy matching
- Search history in settings
- UI polish based on user feedback

---

### v2.0 (OCR & Smart Input)

**Priority: Automation**

**Document Scanning:**
- Camera integration (MediaDevices API)
- OCR using Tesseract.js (browser-based)
- AI-powered field extraction:
  - Detect document type (passport, license, etc.)
  - Auto-fill fields from image
  - Confidence scores for extracted data

**Example Flow:**
1. User taps "Scan Document"
2. Takes photo of passport
3. OCR extracts: name, passport number, DOB, expiry
4. User confirms and saves

**Technical Approach:**
```typescript
// OCR Pipeline
async function scanDocument(imageBlob: Blob): Promise<Partial<Document>> {
  // 1. OCR with Tesseract
  const text = await Tesseract.recognize(imageBlob)

  // 2. Extract fields with regex patterns
  const passportNumber = extractPassportNumber(text)
  const expiryDate = extractExpiryDate(text)
  // ... more fields

  // 3. Return structured data
  return {
    passport_number: passportNumber,
    expiry_date: expiryDate,
    // ...
  }
}
```

**Challenges:**
- Large bundle size (Tesseract is ~2MB)
- OCR accuracy varies by document quality
- Need fallback for manual entry

**Deliverables:**
- Camera interface
- OCR integration
- Field extraction patterns for common document types
- User flow for confirming OCR results

---

### v2.1 (Sharing & Collaboration)

**Priority: Family Features**

**Selective Sharing:**
- Share individual documents with family members
- QR code for secure sharing
- Time-limited access links

**Example Use Case:**
- Dad shares his passport info with son for booking a family trip
- Link expires after 24 hours

**Technical Approach:**
- Generate temporary encryption key
- Encrypt document with temp key
- Share link with key in URL fragment (never sent to server)

**Security Considerations:**
- Still client-side only (no backend)
- Recipient needs FileSafe app
- Clear warnings about link security

---

### v3.0 (Cloud Sync - Optional)

**Priority: Multi-Device**

**Optional Backend:**
- User can choose to enable cloud sync
- End-to-end encrypted (client-side encryption)
- Backend only stores encrypted blobs
- Sync across devices

**Architecture:**
```
Device A                   Device B
   ↓                          ↓
Encrypt locally         Encrypt locally
   ↓                          ↓
   →  Cloud Storage (E2EE)  ←
      (Firebase/Supabase)
```

**Privacy Guarantees:**
- Server NEVER sees unencrypted data
- User controls sync on/off
- Can delete cloud data anytime

**Challenges:**
- Conflict resolution (multiple devices editing)
- Account management (authentication)
- Costs (hosting)

---

## 6. Technical Considerations

### Performance

**Current:**
- IndexedDB queries: < 50ms for typical vault size (< 100 documents)
- Search: < 100ms for rule-based matching
- UI renders: 60fps on modern devices

**Optimization Strategies:**
- Lazy load document list (virtualization for 100+ docs)
- Debounce search input
- Service worker caching for instant load

### Bundle Size

**Current (estimated):**
- React + ReactDOM: ~140KB (gzip)
- Dexie: ~30KB
- Lucide Icons: ~10KB (tree-shaken)
- Tailwind (purged): ~10KB
- **Total: ~200KB**

**Future Growth:**
- OCR (Tesseract): +2MB
- NLP (compromise): +100KB
- Offline ML models: +500KB - 5MB

### Browser Compatibility

**Required APIs:**
- IndexedDB (all modern browsers)
- Web Crypto API (all modern browsers)
- Service Workers (all modern browsers)
- Vibration API (mobile only, optional)

**Tested On:**
- Chrome 90+
- Safari 14+ (iOS 14+)
- Firefox 88+
- Edge 90+

### Accessibility

**Current:**
- Semantic HTML
- ARIA labels for icons
- Keyboard navigation (basic)

**To Improve:**
- Screen reader testing
- Focus management in modals
- High contrast mode
- Font size scaling

### Testing Strategy

**Unit Tests:**
- Storage layer (CRUD operations)
- Search engine (intent parsing)
- Date helpers (expiry calculations)

**Integration Tests:**
- Full user flows (onboarding → add document → search)
- Lock/unlock cycle

**E2E Tests:**
- Critical paths only (Playwright or Cypress)

---

## 7. Deployment

### Development

```bash
npm run dev
# http://localhost:3000
```

### Production Build

```bash
npm run build
# Output: dist/
```

### Hosting Options

**Static Hosting (Free):**
- **Vercel** - Best DX, automatic HTTPS
- **Netlify** - Great PWA support
- **GitHub Pages** - Simple, free

**Self-Hosted:**
- Any static file server (nginx, Apache)
- Cloudflare Pages

### PWA Installation

**Desktop:**
1. Visit site in Chrome
2. Click install icon in address bar
3. App opens in standalone window

**Mobile (iOS):**
1. Open in Safari
2. Tap Share → Add to Home Screen
3. App opens fullscreen

**Mobile (Android):**
1. Open in Chrome
2. Tap "Install FileSafe" banner
3. App installs like native app

---

## 8. Developer Onboarding

### Prerequisites

- Node.js 18+
- npm or yarn
- Basic React/TypeScript knowledge

### Project Structure Overview

```
filesafe/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route pages
│   ├── services/         # Business logic
│   │   ├── vaultStorage.ts    # IndexedDB wrapper
│   │   ├── searchEngine.ts    # Query parser
│   │   └── encryption.ts      # (Future) WebCrypto
│   ├── types/            # TypeScript definitions
│   ├── context/          # React Context (global state)
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Root component + routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Tailwind + global styles
├── public/               # Static assets (icons, manifest)
├── vite.config.ts        # Vite + PWA config
└── package.json

Key Files:
- src/types/vault.ts         # Core data models
- src/services/vaultStorage.ts   # All storage operations
- src/context/VaultContext.tsx   # Global state provider
- src/services/searchEngine.ts   # Search logic
```

### Adding a New Feature

**Example: Add "Favorite Documents" feature**

1. **Update Types** (`src/types/vault.ts`):
```typescript
interface Document {
  // ... existing fields
  isFavorite?: boolean  // Add new field
}
```

2. **Update Storage** (`src/services/vaultStorage.ts`):
```typescript
export const getFavoriteDocuments = async (): Promise<Document[]> => {
  const allDocs = await db.documents.toArray()
  return allDocs.filter(doc => doc.isFavorite)
}
```

3. **Update UI** (e.g., `src/pages/HomePage.tsx`):
```typescript
const favorites = documents.filter(d => d.isFavorite)
// Render favorites section
```

4. **Add Toggle** (`src/pages/DocumentDetailPage.tsx`):
```typescript
const toggleFavorite = async () => {
  await updateDocument(document.id, {
    isFavorite: !document.isFavorite
  })
  await refreshDocuments()
}
```

---

## 9. Conclusion

FileSafe MVP demonstrates the core concept: **instant, search-first access to personal documents**.

**What Works Now:**
- Natural language-ish queries
- Family mode (multi-profile)
- Expiry tracking
- Mobile-first PWA

**Critical Next Steps:**
1. **Add real encryption** (v1.0) - Security is paramount
2. **User testing** - Validate the search UX
3. **OCR integration** (v2.0) - Eliminate manual data entry

**Long-Term Vision:**
- A truly intelligent personal document assistant
- No more fumbling through photos when you need your passport number
- Proactive reminders before documents expire
- Secure, private, and fully user-controlled

**Questions? Issues?**
- GitHub Issues: [your-repo]/issues
- Email: [your-email]

---

**Built with ❤️ using React, TypeScript, and modern web APIs.**
