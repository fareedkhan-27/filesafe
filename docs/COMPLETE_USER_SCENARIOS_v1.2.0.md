# Complete User Scenarios - FileSafe v1.2.0

## 🎭 USER PERSONAS & SCENARIOS

### Version: 1.2.0 (All versions now consistent)
**Date:** December 6, 2024

---

## 👤 PERSONA 1: NEW USER (Never Used FileSafe)

### **Scenario 1.1: First Time Visit - Create New Vault**

**Starting State:**
- No vault in browser storage
- Fresh browser or incognito mode

**User Journey:**
1. **Opens:** `http://localhost:3000` or `https://file-safe.vercel.app`
2. **Sees:** Welcome screen with "Welcome to FileSafe"
3. **Reads:** Privacy information (What We Do, What We DON'T Do, Important Notes)
4. **Action:** Clicks "I Understand - Let's Get Started →"
5. **Result:** ✅ Navigates to PIN entry screen

**Steps to Complete Setup:**
1. Enters 6-digit PIN (e.g., 123456)
2. Auto-advances to confirmation screen
3. Enters same PIN to confirm
4. Auto-advances to Recovery Key screen
5. Sees recovery key (format: XXXX-XXXX-XXXX-XXXX)
6. **Must do ONE of:**
   - Click "Download as Text File"
   - Click "Copy to Clipboard"
   - Write down manually
7. Checks "I have saved my recovery key" checkbox
8. Clicks "Continue to FileSafe →"
9. **Result:** ✅ Home page with v1.2.0 badge

**Expected State After:**
- Vault created and initialized
- Vault is unlocked
- Default "Me" profile created
- No documents yet (empty state)

---

### **Scenario 1.2: First Time Visit - Mistakenly Clicks "Already have vault"**

**Starting State:**
- No vault in browser storage
- On welcome screen

**User Journey:**
1. **Opens:** FileSafe welcome screen
2. **Action:** Clicks "Already have a vault? Login here" button
3. **Result:** ✅ Shows error message: "No vault found. Please create a new vault first by clicking 'I Understand' above."
4. **UI:** Error disappears after 4 seconds
5. **Stays:** On welcome screen

**Why This Happens:**
- User has no vault yet
- Button checks `isInitialized` status
- Since false, shows helpful error message
- Prevents confusion and guides user

---

## 👤 PERSONA 2: RETURNING USER (Has Existing Vault)

### **Scenario 2.1: Normal Login with Correct PIN**

**Starting State:**
- Vault exists in browser storage
- Vault is locked
- User opens app fresh

**User Journey:**
1. **Opens:** `http://localhost:3000`
2. **Sees:** Lock Screen with "Enter your PIN to unlock"
3. **UI Shows:**
   - 6 empty PIN circles
   - Number pad (1-9, 0, Delete, Back)
   - "Forgot your PIN?" button at bottom
4. **Action:** Enters correct 6-digit PIN using number pad
5. **Result:** ✅ Auto-submits after 6th digit (300ms delay)
6. **Unlocks:** Redirects to Home page
7. **Shows:** v1.2.0 badge, profile selector, search bar, documents

**Expected State After:**
- Vault is unlocked
- Can access all features
- Data persists from previous session

---

### **Scenario 2.2: Login with Wrong PIN**

**Starting State:**
- Vault exists and is locked
- On lock screen

**User Journey:**
1. **Sees:** Lock Screen
2. **Action:** Enters wrong 6-digit PIN (e.g., 999999)
3. **Result:** ✅ Shows error: "Incorrect PIN. Please try again."
4. **UI:**
   - PIN input clears automatically
   - Error message shows in red
   - Error disappears after 2 seconds
5. **User Can:** Try again with correct PIN

**Edge Cases:**
- **Multiple wrong attempts:** No lockout (prototype version)
- **User forgets PIN:** Must use "Forgot your PIN?" button

---

### **Scenario 2.3: Forgot PIN - Has Recovery Key**

**Starting State:**
- Vault exists and is locked
- User has saved recovery key
- On lock screen

**User Journey:**
1. **Clicks:** "Forgot your PIN?" button on lock screen
2. **Navigates to:** `/forgot-pin` page
3. **Sees:**
   - Title: "Reset Your PIN"
   - Recovery key input field (format: XXXX-XXXX-XXXX-XXXX)
   - "Verify & Continue" button
4. **Action:** Enters recovery key
5. **Clicks:** "Verify & Continue"
6. **Result:** ✅ Success toast: "Recovery key verified"
7. **Advances to:** New PIN entry screen
8. **Creates:** New 6-digit PIN
9. **Confirms:** New PIN
10. **Result:** ✅ Success: "PIN reset successfully"
11. **Redirects to:** Lock screen (with new PIN)
12. **Can now:** Login with new PIN

**Expected State After:**
- PIN updated in vault settings
- Recovery key unchanged
- All data intact
- Can login with new PIN

---

### **Scenario 2.4: Forgot PIN - Lost Recovery Key - Factory Reset**

**Starting State:**
- Vault exists and is locked
- User lost recovery key
- On Forgot PIN page

**User Journey:**
1. **On:** Forgot PIN page
2. **Tries:** Entering recovery key → Fails (don't have it)
3. **Sees:** Help text at bottom:
   - "❌ Don't have your recovery key?"
   - Explanation about recovery key shown during setup
4. **Sees:** Red button: "🗑️ Factory Reset - Delete All Data & Start Over"
5. **Clicks:** Factory Reset button
6. **Prompt 1:** Confirmation dialog with warning
   - Lists what will be deleted
   - "This action CANNOT be undone!"
7. **Clicks:** OK
8. **Prompt 2:** "Type DELETE in capital letters to confirm"
9. **Types:** "DELETE"
10. **Result:** ✅ Success toast: "All data deleted. Redirecting to setup..."
11. **Action:** Deletes IndexedDB database
12. **Redirects to:** `/` (root)
13. **Shows:** Welcome screen (becomes NEW USER)
14. **Can now:** Create fresh vault with new PIN

**Expected State After:**
- All profiles deleted
- All documents deleted
- All settings deleted (PIN, recovery key)
- Becomes new user
- Must set up from scratch

---

## 👤 PERSONA 3: POWER USER (Frequent User)

### **Scenario 3.1: Using Factory Reset from Settings**

**Starting State:**
- Logged in and vault unlocked
- On any page in app

**User Journey:**
1. **Clicks:** Profile icon (top-right) → "Settings"
2. **Scrolls to:** "Danger Zone" section (red-themed, near bottom)
3. **Sees:**
   - ⚠️ Danger Zone heading
   - Warning about destructive actions
   - "Factory Reset" button with trash icon
   - Description: "Delete all data and start over"
   - Warning text about permanent deletion
4. **Clicks:** "Factory Reset" button
5. **Prompt 1:** Confirmation dialog
6. **Clicks:** OK
7. **Prompt 2:** "Type DELETE to confirm"
8. **Types:** "DELETE"
9. **Result:** ✅ All data deleted
10. **Redirects to:** Fresh welcome screen

**Use Cases:**
- Wants to start completely fresh
- Switching devices
- Testing/development
- Privacy concerns (wipe all data)

---

### **Scenario 3.2: Manually Resetting via Reset Page**

**Starting State:**
- Any state (logged in or not)

**User Journey:**
1. **Navigates to:** `http://localhost:3000/reset.html` or `https://file-safe.vercel.app/reset.html`
2. **Sees:** Red-themed reset page
   - Title: "🗑️ Reset FileSafe"
   - Warning about permanent deletion
   - List of what will be deleted
3. **Clicks:** "🗑️ DELETE ALL DATA & RESET" button
4. **Prompt:** Final confirmation
5. **Clicks:** OK
6. **Action:**
   - Deletes IndexedDB databases
   - Clears localStorage
   - Clears sessionStorage
   - Unregisters service workers
   - Clears browser caches
7. **Shows:** Success message
8. **Auto-redirects to:** `/?fresh=true` (welcome screen)

**When to Use:**
- Troubleshooting cache issues
- App behaving strangely
- Want complete clean start
- Development/testing

---

## 👤 PERSONA 4: CONFUSED USER (Needs Help)

### **Scenario 4.1: On Welcome Screen, Not Sure What to Do**

**Options Available:**

**Option A: Create New Vault**
- Click "I Understand - Let's Get Started →"
- Follow setup wizard

**Option B: Has Existing Vault (Different Browser)**
- Click "Already have a vault? Login here"
- If vault exists in this browser → Lock screen
- If no vault → Error message guiding to create new

**Option C: Read Privacy Policy**
- Click "Read Full Privacy Policy" link
- Opens `/privacy` page
- Can return via back button

**Option D: Reset Everything**
- Click small red button: "🗑️ Reset & Clear All Data"
- Opens reset page in new tab

---

### **Scenario 4.2: On Lock Screen, Can't Remember PIN**

**Options Available:**

**Option A: Try to Remember**
- Use number pad to enter PIN
- No limit on attempts (prototype)
- Wrong PIN shows error

**Option B: Use Recovery Key**
- Click "Forgot your PIN?" button
- Enter recovery key
- Create new PIN

**Option C: Factory Reset (Lost Recovery Key)**
- Click "Forgot your PIN?"
- Scroll to bottom
- Click "Factory Reset" button
- Lose all data, start fresh

---

## 📊 APP STATE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER OPENS APP                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │  Check Vault Exists? │
              └──────────┬───────────┘
                         │
        ┌────────────────┼────────────────┐
        │                                 │
        ▼                                 ▼
   ┌─────────┐                     ┌──────────────┐
   │   NO    │                     │     YES      │
   │ (New)   │                     │  (Existing)  │
   └────┬────┘                     └──────┬───────┘
        │                                 │
        ▼                                 ▼
┌───────────────┐              ┌──────────────────┐
│  WELCOME      │              │   Is Locked?     │
│  SCREEN       │              └────────┬─────────┘
│ (Onboarding)  │                       │
└───────┬───────┘              ┌────────┼────────┐
        │                      │                 │
        │                      ▼                 ▼
        │             ┌─────────────┐    ┌──────────────┐
        │             │ LOCK SCREEN │    │  HOME PAGE   │
        │             │ (Enter PIN) │    │  (Unlocked)  │
        │             └─────────────┘    └──────────────┘
        │
        ▼
┌────────────────────────────────────────────┐
│         CREATE VAULT WIZARD                │
│  1. Enter PIN                              │
│  2. Confirm PIN                            │
│  3. Save Recovery Key                      │
│  4. Confirm Saved                          │
│  ────────────────────────────────────────► │
└────────────────────────────────────────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │  HOME PAGE   │
                 │  (Unlocked)  │
                 └──────────────┘
```

---

## 🔧 TROUBLESHOOTING SCENARIOS

### **Issue 1: "Already have vault" button doesn't work**

**Symptoms:**
- Button flickers
- Stays on same page
- No error message

**Diagnosis:**
- Check vault status in console:
  ```javascript
  indexedDB.databases().then(console.log)
  ```

**Solutions:**

**If vault EXISTS:**
- Should navigate to lock screen
- If not → Clear cache and try again

**If vault DOESN'T exist:**
- Should show error message
- If not → Version mismatch or cache issue
- Solution: Hard refresh (Ctrl+Shift+R)

---

### **Issue 2: Version numbers don't match**

**Expected:**
- All versions should show **v1.2.0**

**Check locations:**
1. Home page header (top-left badge) → v1.2.0
2. Home page footer (bottom-right circle) → v1.2.0
3. Settings → About section → v1.2.0
4. User menu dropdown → v1.2.0

**If different:**
- Clear cache completely
- Hard refresh (Ctrl+Shift+R)
- Check console for errors
- Try incognito mode

---

### **Issue 3: Can't see updates**

**Solutions (in order):**

1. **Hard Refresh:**
   - Press Ctrl+Shift+R
   - Or Ctrl+F5

2. **Clear Service Worker:**
   - F12 → Application → Service Workers → Unregister
   - F12 → Application → Cache Storage → Delete all
   - Refresh

3. **Reset Everything:**
   - Go to `/reset.html`
   - Click reset button
   - Confirms all caches cleared

4. **Incognito Mode:**
   - Ctrl+Shift+N
   - Open app
   - Zero cache = fresh version

---

## ✅ VERIFICATION CHECKLIST

### **After Fresh Reset:**
- [ ] Welcome screen appears
- [ ] Both buttons work (no flicker)
- [ ] Can create new vault
- [ ] v1.2.0 badge shows on home
- [ ] Version consistent everywhere

### **All User Flows Work:**
- [ ] New user can create vault
- [ ] Existing user can login
- [ ] Forgot PIN with recovery key works
- [ ] Factory reset works
- [ ] Settings reset works
- [ ] Reset.html page works

### **Version Consistency:**
- [ ] Home header: v1.2.0
- [ ] Home footer: v1.2.0
- [ ] Settings: v1.2.0
- [ ] User menu: v1.2.0
- [ ] Package.json: 1.2.0

---

## 📝 KNOWN LIMITATIONS (Prototype)

1. **Security:**
   - PIN stored in plain text (not encrypted)
   - Recovery key stored in plain text
   - No password hashing

2. **Data:**
   - Stored only in browser (IndexedDB)
   - No cloud backup
   - Lost if browser data cleared

3. **Multi-device:**
   - Cannot sync across devices
   - Each browser = separate vault

4. **Recovery:**
   - Factory reset = permanent data loss
   - No way to recover without recovery key

---

**All scenarios documented and ready for testing!** ✅

