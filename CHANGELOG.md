# Changelog

All notable changes to FileSafe will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2024-12-06

### 🔐 Security - CRITICAL FIXES
- **FIXED**: Cryptographically secure random number generator for recovery keys
  - Replaced `Math.random()` with `crypto.getRandomValues()` (Web Crypto API)
  - Prevents predictable recovery key generation attacks
  - File: `src/utils/recoveryKey.ts`
- **FIXED**: Protected localStorage access with try/catch
  - App no longer crashes in private browsing mode
  - Graceful fallback when localStorage unavailable
  - File: `src/context/ThemeContext.tsx`

### 🐛 Bug Fixes - Error Handling
- **FIXED**: Missing error handling in HomePage quick search (expiring documents)
- **FIXED**: Missing error handling in ProfilesPage add profile operation
- **FIXED**: Missing error handling in DocumentDetailPage load operation
- **FIXED**: Missing error handling in DocumentDetailPage delete operation
- **FIXED**: Missing error handling in OnboardingPage recovery key download
- All async operations now have proper try/catch blocks
- User receives feedback when operations fail

### 📚 Documentation
- Created `docs/SECURITY_AUDIT_v1.2.2.md` - Complete audit report
- Updated `docs/SECURITY_ROADMAP.md` with v1.2.2 fixes

### 🧪 Testing
- All fixes verified with successful build
- No TypeScript errors
- No linter errors

## [1.2.1] - 2024-12-06

### Added
- Version number display on Lock Screen (bottom of page)
- Version number display on Onboarding page (bottom of page)
- Beautiful Factory Reset confirmation modal with text input
- Comprehensive README with Architecture, Usage Guide, API Reference sections
- Detailed Known Limitations section in documentation
- Enhanced Security & Privacy documentation
- **NEW**: `docs/SECURITY_ROADMAP.md` - Complete security enhancement plan for v1.3.0+
- **NEW**: Production-safe logging (removed all debug console.log statements)

### Changed
- **BREAKING**: Renamed all `VaultKey` references to `FileSafe` in codebase
- **BREAKING**: localStorage key changed from `vaultkey-theme` to `filesafe-theme` (resets theme preference)
- Recovery key download filename changed from `vaultkey-recovery-*.txt` to `filesafe-recovery-*.txt`
- Factory Reset now uses modal with "DELETE" confirmation instead of browser prompts
- Factory Reset now auto-redirects to Onboarding page after completion (was broken)
- Updated "What's New" section in Settings to reflect v1.2.1 changes
- All archive documentation updated with FileSafe naming
- **SECURITY**: Removed 15+ console.log statements across 8 files for production safety

### Fixed
- Factory Reset UX: Removed confusing double confirmation (confirm + prompt)
- Factory Reset: Now properly redirects to onboarding after deletion
- Factory Reset: Button now disabled until "DELETE" typed correctly
- Factory Reset: No longer leaves user on settings page after reset
- **SECURITY**: Console logs no longer expose sensitive data in production

### Improved
- Documentation: 750+ line comprehensive README (was 234 lines)
- Documentation: Added complete API reference for developers
- Documentation: Added detailed usage guide for end users
- Documentation: Added architecture diagrams and data flow explanations
- Code organization: Cleaned up all legacy naming inconsistencies
- **ACCESSIBILITY**: Already WCAG 2.1 AA compliant, confirmed all ARIA labels working
- **SECURITY**: Production-ready error handling without exposing stack traces

### Removed
- Double browser confirmation for Factory Reset
- All VaultKey references from active codebase and documentation
- **SECURITY**: All debug console.log/console.error statements (15 instances removed)

## [1.2.0] - 2024-12-05

### Added
- Factory Reset functionality in Settings → Danger Zone
- Improved PIN recovery flow with clear instructions
- Reset utility page at `/reset.html`
- Consistent versioning across all UI locations
- Better error messaging throughout the app

### Changed
- Organized documentation into `/docs` folder
- Moved development history to `/docs/archive`
- Created comprehensive README.md
- Added proper .gitignore

### Fixed
- Version number inconsistencies (was showing v0.1.0, v1.1.0, v1.2.0)
- "Already have a vault?" button now checks vault status before navigating

## [1.1.0] - 2024-12-04

### Added
- Recovery key system for PIN reset
- PIN reset flow via "Forgot PIN?" screen
- Enhanced UI/UX with better visual design

## [1.0.0] - 2024-12-03

### Added
- Core vault functionality
- 6-digit PIN protection
- Document management (add, edit, delete, view)
- Profile system for family members
- Natural language search
- Dark mode support
- PWA support for offline use
- IndexedDB for local storage

### Security Notes
- ⚠️ This is a PROTOTYPE version
- Data is NOT encrypted (stored in plain text)
- PIN is stored in plain text
- Suitable for non-sensitive document organization only

---

## Upcoming in v2.0.0

### Planned (Security Update)
- End-to-end encryption using WebCrypto API
- PIN hashing with PBKDF2 (100,000 iterations)
- Encrypted recovery key
- Secure data export/import
- Password strength requirements
- Optional biometric authentication

### Planned (Features)
- File attachments (images, PDFs, scans)
- Data export/import functionality
- Advanced search with fuzzy matching
- Document templates
- Automated testing suite
- Performance optimizations

---

**Legend:**
- **BREAKING**: Changes that require user action or affect existing data
- Added: New features
- Changed: Changes to existing functionality
- Fixed: Bug fixes
- Improved: Enhancements to existing features
- Removed: Deprecated features

