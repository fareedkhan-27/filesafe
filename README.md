# 🔐 FileSafe - Secure Document Vault

**Version:** 1.1.0
**Developer:** Fareed Khan ([LinkedIn](https://www.linkedin.com/in/fareedkhankk))
**Status:** Production Ready
**Type:** Progressive Web App (PWA)

---

## 📖 Overview

FileSafe is a secure, privacy-focused document management application for storing and organizing family documents. All data is stored locally in your browser - nothing is sent to any server.

### ✨ Key Features

- 🔒 **100% Local Storage** - All data stays on your device
- 🔑 **PIN Protection** - Secure 6-digit PIN lock
- 🎫 **Recovery Key** - Reset PIN if forgotten
- 👥 **Multiple Profiles** - Manage documents for family members
- 🔍 **Instant Search** - Find any document quickly
- 🌙 **Dark Mode** - Easy on the eyes
- 📱 **Mobile Friendly** - Works on all devices
- ⚡ **Offline First** - No internet required

---

## 🚀 Quick Start

### **For Users:**

1. **Open:** https://file-safe.vercel.app
2. **First time?** Click "I Understand - Let's Get Started"
3. **Create:** 6-digit PIN
4. **Save:** Your recovery key (important!)
5. **Start:** Adding documents

### **For Developers:**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Runs on:** http://localhost:3000

---

## 📖 Usage Guide

### First-Time Setup

**Step 1: Initial Onboarding**
1. Visit the app (web or installed PWA)
2. Read the welcome message explaining local storage
3. Click "I Understand - Let's Get Started"

**Step 2: Create Your PIN**
1. Enter a 6-digit PIN (easy to remember)
2. Re-enter to confirm
3. PIN is your primary authentication method

**Step 3: Save Recovery Key**
1. App generates a unique recovery key
2. **Critical**: Copy or download this key
3. Store it somewhere safe (password manager, secure note)
4. This is your only way to recover access if you forget your PIN

**Step 4: First Document**
- You're automatically taken to the home screen
- Start adding documents using the + button

### Managing Profiles

**Adding Family Members:**
1. Tap the profile icon (top left)
2. Select "Manage Profiles"
3. Click "+ Add Profile"
4. Enter name, relationship, and choose an emoji avatar
5. Save

**Switching Profiles:**
- Tap the current profile name (top left)
- Select from the dropdown list
- Home screen updates to show that profile's documents

**Editing/Deleting Profiles:**
- Go to "Manage Profiles"
- Tap a profile card
- Edit details or delete (warning: deletes all documents)

### Adding Documents

**Quick Add (Recommended):**
1. Click the + button (bottom right on mobile, top on desktop)
2. Select document type (Passport, ID, Insurance, etc.)
3. Fill in the essential fields shown
4. Click "Save Document"

**Custom Fields:**
- Scroll to bottom of any document form
- Click "+ Add Custom Field"
- Enter label (e.g., "Visa Number") and value
- Add multiple custom fields as needed

**Document Types Supported:**
- Passport
- Driving License
- National ID
- Visa
- Residence Permit
- Insurance (Health, Auto, Life, etc.)
- Bank/Credit Cards
- Medical Cards
- Custom (any document type)

### Searching Documents

**Natural Language Search:**
- Type naturally: "Alex passport" or "my insurance"
- Search understands:
  - Profile names: "Sara's documents"
  - Document types: "all passports"
  - Specific fields: "passport number"
  - Dates: "expiring documents"

**Quick Chips:**
- Tap suggested chips below search bar
- Based on your current profile
- "⏰ Expiring" shows docs expiring in next 90 days

**Search Results:**
- Matched field highlighted in gold
- Tap any document to view full details
- Copy individual fields with one tap

### Viewing & Editing Documents

**Document Detail View:**
- Tap any document card
- See all fields and values
- Copy any field value by tapping the copy icon
- Edit using pencil icon (top right)
- Delete using trash icon

**Copying Data:**
- Single tap on copy icon copies to clipboard
- Success message confirms copy
- Works on all modern browsers (optimized for iOS)

### PIN Recovery

**If You Forgot Your PIN:**
1. On lock screen, tap "Forgot your PIN?"
2. Enter your recovery key (exactly as saved)
3. Create a new 6-digit PIN
4. Confirm new PIN
5. You're back in!

**If You Lost Your Recovery Key:**
- Only option: Factory Reset (see Settings)
- **This deletes ALL data permanently**

### Settings

**Change PIN:**
1. Go to Settings (gear icon)
2. Tap "Change PIN"
3. Enter new 6-digit PIN
4. Confirm new PIN

**Toggle Dark Mode:**
- Tap the sun/moon icon in Settings
- Or use the toggle in user menu (top right)

**View Recovery Key:**
- Settings → "View Recovery Key"
- Re-enter your current PIN
- Copy or download again

**Factory Reset (Danger Zone):**
1. Settings → Scroll to bottom
2. "Danger Zone" section
3. "Factory Reset" button
4. Confirm (requires typing "DELETE")
5. All data permanently erased
6. Alternative: Visit `/reset.html` for browser-level reset

### Tips & Best Practices

**Security:**
- Choose a PIN you can remember (write it down offline if needed)
- Store recovery key in password manager
- Don't store sensitive documents in prototype version

**Organization:**
- Create profiles for each family member
- Use consistent document titles
- Add expiry dates for time-sensitive docs
- Use custom fields for unique information

**Maintenance:**
- Periodically check "Expiring" documents
- Update documents before they expire
- Keep recovery key accessible

---

## 📚 Documentation

- **[User Guide](docs/COMPLETE_USER_SCENARIOS_v1.2.0.md)** - All user scenarios
- **[Testing Guide](docs/TESTING_CHECKLIST_V1.2.0.md)** - Complete testing checklist
- **[Final Summary](FINAL_SUMMARY_v1.2.0.md)** - v1.2.0 overview
- **[Archive](docs/archive/)** - Development history

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Database:** IndexedDB (via Dexie.js)
- **Build:** Vite
- **PWA:** vite-plugin-pwa
- **Icons:** Lucide React

---

## 🏗️ Architecture

### High-Level Overview

FileSafe is a **100% client-side** Progressive Web Application with no backend dependencies. All data processing, storage, and search operations happen locally in the browser.

```
┌─────────────────────────────────────────────┐
│          USER INTERFACE (React)             │
│     Pages + Components (Mobile-First)       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│      STATE MANAGEMENT (Context API)         │
│   VaultContext • ThemeContext • Toast       │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
┌────────▼────────┐  ┌───────▼────────┐
│  Search Engine  │  │ Vault Storage  │
│  (NLP Parsing)  │  │   (Dexie.js)   │
└─────────────────┘  └───────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   IndexedDB     │
                    │ (Browser Local) │
                    └─────────────────┘
```

### Component Architecture

**Pages (8 routes):**
- `OnboardingPage` - First-time setup (PIN + recovery key creation)
- `LockScreen` - PIN authentication gate
- `HomePage` - Main dashboard with search and document list
- `DocumentDetailPage` - Full document view
- `DocumentFormPage` - Add/edit documents
- `ProfilesPage` - Family member management
- `SettingsPage` - App configuration & danger zone
- `PrivacyPolicyPage` - Privacy information

**Key Components:**
- `SearchBar` - Natural language search input
- `DocumentCard` - Document preview with quick actions
- `ProfileSelector` - Profile switcher dropdown
- `QuickChip` - Smart search suggestions
- `RecoveryKeyDisplay` - Recovery key generation & display

### Data Flow

**User Authentication:**
```
User enters PIN → VaultContext.unlock() → 
vaultStorage.getSettings() → Compare PIN → 
Load data if valid → Unlock UI
```

**Document Search:**
```
User types query → searchEngine.parse() → 
Extract intent (profile/type/field) → 
Filter documents → Rank results → 
Display matches
```

**Data Persistence:**
```
User action → Component state update → 
Context method call → vaultStorage service → 
Dexie.js CRUD operation → IndexedDB write → 
Refresh context state
```

### State Management

Global state is managed via React Context API:

- **VaultContext**: Profiles, documents, settings, authentication state
- **ThemeContext**: Dark/light mode preference (persisted to localStorage)
- **ToastContext**: Notification messages and alerts

### Security Model (Current)

⚠️ **Prototype Phase - No Encryption**
- PIN stored in plain text in IndexedDB
- All document data stored unencrypted
- Recovery keys use weak random generator (Math.random())
- No rate limiting on PIN attempts
- No network requests (100% offline)
- Data never leaves the device
- **Production-safe logging** (no console logs in v1.2.1+)

---

## 📁 Project Structure

```
FileSafe/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── context/            # React context providers
│   ├── services/           # Business logic & storage
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── public/
│   └── reset.html          # Database reset utility
├── docs/                   # Documentation
│   ├── archive/            # Development history
│   ├── COMPLETE_USER_SCENARIOS_v1.2.0.md
│   ├── TESTING_CHECKLIST_V1.2.0.md
│   └── TESTING_GUIDE.md
├── index.html              # App entry point
├── package.json            # Dependencies
├── vite.config.ts          # Build configuration
├── tailwind.config.js      # Styling configuration
└── vercel.json             # Deployment configuration
```

---

## 🔌 API Reference

### VaultContext API

Central state management for authentication and data:

```typescript
const {
  // State
  profiles,           // Profile[] - All family profiles
  documents,          // Document[] - All documents
  settings,           // VaultSettings | null
  currentProfileId,   // string - Active profile ID
  isLocked,           // boolean - Authentication state
  isInitialized,      // boolean - Has vault been created?
  isLoading,          // boolean - Initial load state

  // Actions
  unlock,             // (pin: string) => Promise<boolean>
  lock,               // () => void
  initializeVault,    // (pin: string, recoveryKey: string) => Promise<void>
  setCurrentProfileId,// (id: string) => void
  refreshAll,         // () => Promise<void> - Reload all data
} = useVault();
```

**Example Usage:**
```typescript
import { useVault } from './context/VaultContext';

function MyComponent() {
  const { documents, currentProfileId } = useVault();
  
  // Get current profile's documents
  const myDocs = documents.filter(d => d.profileId === currentProfileId);
  
  return <div>{myDocs.length} documents</div>;
}
```

### vaultStorage Service

Low-level IndexedDB operations:

```typescript
// Profiles
getAllProfiles(): Promise<Profile[]>
getProfileById(id: string): Promise<Profile | undefined>
createProfile(profile: Profile): Promise<void>
updateProfile(id: string, updates: Partial<Profile>): Promise<void>
deleteProfile(id: string): Promise<void>

// Documents
getAllDocuments(): Promise<Document[]>
getDocumentById(id: string): Promise<Document | undefined>
getDocumentsByProfile(profileId: string): Promise<Document[]>
createDocument(document: Document): Promise<void>
updateDocument(id: string, updates: Partial<Document>): Promise<void>
deleteDocument(id: string): Promise<void>

// Settings
getSettings(): Promise<VaultSettings | undefined>
updateSettings(updates: Partial<VaultSettings>): Promise<void>

// Utilities
getExpiringDocuments(daysAhead: number): Promise<Document[]>
isVaultInitialized(): Promise<boolean>

// Database access
db // Dexie instance for advanced operations
```

**Example Usage:**
```typescript
import { createDocument, getExpiringDocuments } from './services/vaultStorage';

// Add a new document
await createDocument({
  id: 'doc-' + Date.now(),
  profileId: 'profile-me',
  type: 'passport',
  title: 'My Passport',
  passport_number: 'N1234567',
  // ... other fields
});

// Get documents expiring in 30 days
const expiring = await getExpiringDocuments(30);
```

### searchEngine Service

Natural language query parsing:

```typescript
// Main search function
search(
  query: string,
  documents: Document[],
  profiles: Profile[],
  currentProfileId: string
): SearchResult

// Get smart suggestions
getQuickSearchSuggestions(
  profile: Profile,
  documents: Document[]
): string[]
```

**SearchResult Type:**
```typescript
interface SearchResult {
  type: 'document' | 'field' | 'multiple';
  documents: Document[];
  highlightedField?: string;
  profile?: Profile;
  query: string;
}
```

**Example Usage:**
```typescript
import { search } from './services/searchEngine';

const result = search(
  "Sara's passport",
  documents,
  profiles,
  currentProfileId
);

if (result.type === 'document') {
  console.log('Found:', result.documents[0].title);
}
```

### Utility Functions

**clipboard.ts:**
```typescript
// Copy text to clipboard (iOS-optimized)
copyToClipboard(text: string): Promise<boolean>
```

**recoveryKey.ts:**
```typescript
// Generate random recovery key
generateRecoveryKey(): string // Format: XXXX-XXXX-XXXX-XXXX
```

**dateHelpers.ts:**
```typescript
// Format dates for display
formatDate(dateString: string): string // "Jan 15, 2024"
getRelativeTime(dateString: string): string // "in 30 days"
isExpiringSoon(dateString: string, days: number): boolean
```

**duplicateChecker.ts:**
```typescript
// Check for duplicate documents
checkForDuplicates(
  newDoc: Partial<Document>,
  existingDocs: Document[]
): { isDuplicate: boolean; matches: Document[] }
```

---

## 🔧 Configuration

### **Environment Variables:**
None required - works completely offline!

### **Build Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Dev Command:** `npm run dev`

---

## 🎯 Features by Version

### **v1.2.1 (Current)**
- ✅ Beautiful Factory Reset modal with type-to-confirm
- ✅ Auto-redirect to onboarding after reset
- ✅ Version number visible on all screens
- ✅ Complete VaultKey → FileSafe renaming
- ✅ Comprehensive documentation and cleanup
- ✅ Enhanced README with full architecture details

### **v1.2.0**
- ✅ Factory Reset functionality
- ✅ Improved PIN recovery flow
- ✅ Danger Zone in Settings
- ✅ Reset utility page
- ✅ Better error messaging
- ✅ Consistent versioning

### **v1.1.0**
- Recovery key system
- PIN reset flow
- Enhanced UI/UX

### **v1.0.0**
- Core vault functionality
- PIN protection
- Document management
- Profile system

---

## 🔐 Security & Privacy

### Current Implementation (v1.2.1 - Prototype)

**⚠️ IMPORTANT: This is a prototype version without encryption**

**What is NOT Secure:**
- ❌ **PIN**: Stored in plain text in IndexedDB
- ❌ **Documents**: All data stored unencrypted
- ❌ **Recovery Key**: Stored in plain text
- ❌ **No Password Hashing**: PIN compared directly
- ❌ **No Encryption at Rest**: IndexedDB is not encrypted

**What IS Private:**
- ✅ **100% Local**: No data ever sent to any server
- ✅ **No Network**: App works completely offline
- ✅ **No Analytics**: No tracking or telemetry
- ✅ **No Third Parties**: No external services or APIs
- ✅ **Browser Isolated**: Data stays in your browser's IndexedDB
- ✅ **No Cloud Sync**: Data never leaves your device

**Suitable For:**
- ✅ Personal document organization
- ✅ Family document management
- ✅ Non-sensitive information
- ✅ Testing and demonstration
- ✅ Quick reference documents

**NOT Suitable For:**
- ❌ Highly sensitive documents (SSN, passwords, financial data)
- ❌ Classified or confidential information
- ❌ Medical records (HIPAA-protected)
- ❌ Legal documents requiring encryption
- ❌ Production environments requiring security compliance

### How Your Data is Stored

**Browser Storage:**
```
IndexedDB Database: "FileSafeDB"
├── profiles (table)
│   └── Plain JSON objects
├── documents (table)
│   └── Plain JSON objects
└── settings (table)
    └── PIN in plain text
    
localStorage:
└── filesafe-theme (dark/light preference)
```

**Browser Isolation:**
- Data is isolated per-origin (domain)
- Other websites cannot access your FileSafe data
- Clearing browser data deletes everything
- Incognito mode = separate database

**Physical Security:**
- Data stored on your device's hard drive
- As secure as your device's disk encryption
- Device lock screen provides first layer of security
- App PIN provides second layer (not cryptographic)

### Privacy Guarantees

**What We DO:**
- Store all data locally in your browser
- Operate completely offline
- Respect your privacy

**What We DON'T DO:**
- ❌ Send data to servers
- ❌ Track your usage
- ❌ Use analytics or cookies
- ❌ Require sign-up or email
- ❌ Access your files or camera
- ❌ Request unnecessary permissions

### Future Security (v2.0 Roadmap)

**Planned Encryption Features:**
- 🔒 **AES-256-GCM Encryption**: All data encrypted at rest
- 🔒 **PBKDF2 Key Derivation**: PIN → Cryptographic key (100k iterations)
- 🔒 **Encrypted Recovery**: Recovery key encrypted with secondary key
- 🔒 **WebCrypto API**: Browser-native cryptography
- 🔒 **Export/Import Encrypted**: Backup files encrypted
- 🔒 **Zero-Knowledge**: Only you can decrypt your data

**Security Roadmap:**
1. Implement WebCrypto-based encryption layer
2. Migrate existing data to encrypted format
3. Add encrypted backup/restore
4. Implement password strength requirements
5. Add optional biometric authentication
6. Security audit by external firm

### Recommendations

**For Current Version:**
1. ✅ Use for organizing non-sensitive documents
2. ✅ Choose a strong PIN (avoid 123456, birthdays)
3. ✅ Keep recovery key in password manager
4. ✅ Enable device disk encryption
5. ✅ Use device lock screen
6. ⚠️ Don't store passwords or financial PINs
7. ⚠️ Don't use on shared/public computers

**Device-Level Security:**
- Enable BitLocker (Windows) or FileVault (Mac)
- Use strong device password
- Keep OS and browser updated
- Use antivirus software
- Enable firewall

### Data Backup & Export

**Manual Backup:**
- Currently: No export feature (v2.0 planned)
- Workaround: Browser's IndexedDB export tools
- Alternative: Take screenshots (not recommended for sensitive data)

**Browser Data:**
- Clearing browser data = permanent deletion
- No recovery if IndexedDB is deleted
- Recovery key only resets PIN, doesn't backup data

---

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- IndexedDB support
- Service Worker support (for PWA features)

---

## 🐛 Troubleshooting

### **App Not Updating?**
1. Go to `/reset.html`
2. Click "Delete All Data & Reset"
3. Or press Ctrl+Shift+R (hard refresh)

### **Buttons Not Working?**
1. Clear browser cache
2. Open in Incognito mode
3. Check console for errors (F12)

### **Forgot PIN?**
1. Click "Forgot your PIN?" on lock screen
2. Enter recovery key
3. Create new PIN
4. If lost recovery key → Factory reset (loses all data)

---

## ⚠️ Known Limitations

### Security Limitations

**No Encryption (v1.x):**
- All data stored in plain text in IndexedDB
- PIN not cryptographically hashed
- Recovery key stored unencrypted
- Recovery keys use Math.random() (not cryptographically secure)
- No rate limiting on PIN attempts

**See `docs/SECURITY_ROADMAP.md` for detailed security enhancement plans.**
- **Impact**: Not suitable for highly sensitive data
- **Workaround**: Use device-level encryption, wait for v2.0

**Single-Device Only:**
- No cloud sync between devices
- No backup to cloud
- Data exists only on one browser
- **Impact**: Lost device = lost data
- **Workaround**: Manual export (planned v2.0)

### Feature Limitations

**No File Attachments:**
- Cannot upload document scans or photos
- No PDF or image storage
- Text-based fields only
- **Impact**: Must store scans separately
- **Planned**: v2.0 will support file attachments

**No Data Export:**
- Cannot export all documents at once
- No CSV/JSON export
- No backup file creation
- **Impact**: Difficult to migrate or backup
- **Planned**: v2.0 export/import feature

**No Multi-User:**
- Profiles are for organization only
- Everyone who unlocks sees all profiles
- No per-profile authentication
- **Impact**: Shared device = shared access
- **Note**: Designed for single-user/family use

**No Document Versioning:**
- Editing overwrites previous version
- No history or undo
- No audit trail
- **Impact**: Can't recover old values
- **Workaround**: Be careful when editing

**No Advanced Search:**
- Basic keyword matching only
- No fuzzy search
- No OCR on images
- No search within custom fields
- **Impact**: Exact spelling required
- **Improvement**: Continuous refinement

### Browser Limitations

**Storage Quota:**
- IndexedDB has browser-imposed limits
- Typically 50MB - 1GB depending on browser
- Can fill up with many documents
- **Impact**: May hit storage limit
- **Workaround**: Delete old documents

**Browser Compatibility:**
- Requires modern browser (2020+)
- No Internet Explorer support
- Some features need IndexedDB v2
- **Impact**: Won't work on old devices
- **Minimum**: Chrome 90, Firefox 88, Safari 14

**PWA Limitations:**
- iOS PWA limitations (no true background sync)
- Must "Add to Home Screen" for full experience
- Some browsers don't support all PWA features
- **Impact**: Varies by platform

**Cache Issues:**
- Service worker can cause update delays
- Hard refresh needed sometimes
- Cache can become stale
- **Workaround**: Use /reset.html or hard refresh

### Data Limitations

**No Relationships:**
- Documents can't reference each other
- No parent-child relationships
- No document linking
- **Impact**: Can't model complex relationships

**Limited Document Types:**
- Pre-defined types only
- Custom type is generic
- Can't create new structured types
- **Workaround**: Use custom fields

**Date Handling:**
- Dates stored as ISO strings
- No recurring events/reminders
- No date-based workflows
- **Impact**: Manual date tracking

**No Full-Text Search:**
- Searches document-level fields only
- Custom fields not fully indexed
- No cross-document search
- **Impact**: May miss some matches

### Performance Limitations

**Large Datasets:**
- Performance degrades with >1000 documents
- Search slower with many profiles
- UI lag possible with large result sets
- **Impact**: Not suitable for enterprise use
- **Optimization**: Planned for v2.0

**No Pagination:**
- All documents loaded at once
- Memory usage grows with data
- No lazy loading
- **Impact**: Slow on low-end devices

### Network & Sync Limitations

**Completely Offline:**
- ✅ Pro: Works without internet
- ❌ Con: No cloud backup
- ❌ Con: No cross-device sync
- ❌ Con: No sharing capabilities
- **Note**: By design for privacy

**No Collaboration:**
- Single user only
- Can't share specific documents
- No permissions/roles
- **Impact**: Everyone has full access

### Development Limitations

**No Automated Tests:**
- Manual testing only
- No unit tests
- No integration tests
- **Impact**: Potential bugs
- **Planned**: Test coverage in future

**No Error Reporting:**
- Errors only in browser console
- No crash analytics
- No remote debugging
- **Impact**: Hard to diagnose issues
- **Workaround**: Check F12 console

### Roadmap for Addressing Limitations

**v2.0 (Planned):**
- ✅ Full encryption
- ✅ Data export/import
- ✅ File attachments
- ✅ Cloud backup (optional)

**v2.1 (Future):**
- ✅ Advanced search
- ✅ Document templates
- ✅ Automated testing
- ✅ Performance optimization

**Long-term:**
- Optional cloud sync (end-to-end encrypted)
- Mobile native apps
- Biometric authentication
- Document sharing (encrypted)

---

## 🚀 Deployment

### **Vercel (Recommended):**
1. Connect GitHub repository
2. Auto-deploys on push to main
3. Live at: https://file-safe.vercel.app

### **Manual:**
```bash
npm run build
# Deploy `dist` folder to any static host
```

---

## 📄 License

MIT License - Free to use and modify

---

## 👨‍💻 Developer

**Fareed Khan**  
[LinkedIn](https://linkedin.com/in/fareedkhankk/)

---

## 🤝 Contributing

This is a prototype project. For production use:
1. Implement proper encryption
2. Add comprehensive security audits
3. Follow OWASP security guidelines
4. Add automated testing
5. Implement proper error logging

---

## ⚠️ Disclaimer

This is a PROTOTYPE version. Data is not encrypted. Do not use for storing highly sensitive information. Always keep backups of important documents.

---

**Made with ❤️ for secure document management**
