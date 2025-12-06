# FileSafe v1.2.0 - Complete Testing Checklist

## 🚨 **CRITICAL FIX DEPLOYED**

**Issue:** Buttons not working on onboarding page
**Root Cause:** Vercel configuration was redirecting JS/CSS files to index.html
**Fix:** Updated `vercel.json` to use `routes` with `filesystem` handler
**Status:** ✅ Pushed (Commit: e23efa2)

---

## ⏱️ **Before Testing - Wait & Clear Cache**

### Step 1: Wait for Deployment (2-3 minutes)
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Check deployment status: Should show ✅ **Ready**

### Step 2: Clear ALL Caches (CRITICAL!)
1. **Open DevTools:** Press `F12`
2. **Right-click Refresh button** → Select **"Empty Cache and Hard Reload"**
3. **Or use keyboard:** `Ctrl + Shift + Delete` → Clear everything → Restart browser
4. **Best:** Test in **Incognito/Private mode** first

---

## ✅ **Complete Functionality Test**

### **1. NEW USER FLOW (First-Time Setup)**

#### Test 1.1: Landing on Onboarding
- [ ] Open https://file-safe.vercel.app in Incognito
- [ ] Should see "Welcome to FileSafe" screen
- [ ] Should see privacy cards (What We Do, What We DON'T Do, Important Notes)
- [ ] Should see two buttons at bottom

#### Test 1.2: Welcome Screen Buttons
- [ ] Click **"I Understand - Let's Get Started →"** button
  - ✅ Should navigate to PIN entry screen
  - ✅ Should show "Create Your PIN" heading
  - ✅ Should show 6 empty PIN circles
  - ✅ Should show number pad (1-9, 0, Delete, Back)

- [ ] Go back to welcome, then click **"Already have a vault? Login here"**
  - ✅ Should redirect to `/` (root)
  - ✅ Should show "Enter your PIN to unlock" (Lock Screen)

#### Test 1.3: PIN Creation
- [ ] Enter a 6-digit PIN (e.g., 123456)
  - ✅ Each number fills a circle
  - ✅ After 6th digit, auto-advances to confirmation
- [ ] Should see "Confirm Your PIN" screen
- [ ] Enter the SAME PIN again
  - ✅ Should advance to Recovery Key screen

#### Test 1.4: Recovery Key Screen
- [ ] Should see your recovery key (format: XXXX-XXXX-XXXX-XXXX)
- [ ] Click **"Copy to Clipboard"** button
  - ✅ Button should show checkmark
  - ✅ Text should change to "Copied!"
- [ ] Click **"Download as Text File"**
  - ✅ Should download a .txt file with recovery key
- [ ] Check the **"I have saved my recovery key"** checkbox
  - ✅ Button should become enabled
- [ ] Click **"Continue to FileSafe →"**
  - ✅ Should redirect to home page
  - ✅ Should see "FileSafe" with **v1.2.0** badge

---

### **2. HOME PAGE (Main Features)**

#### Test 2.1: Version Display
- [ ] Should see **v1.2.0** badge next to "FileSafe" heading (top-left)
- [ ] Badge should be cyan colored with border

#### Test 2.2: Profile Selector
- [ ] Should see "Me" profile selected by default
- [ ] Avatar should show 👤 icon

#### Test 2.3: Search Bar
- [ ] Type in search box (e.g., "passport")
  - ✅ Should show search results
- [ ] Click quick chips below search
  - ✅ Should filter documents

#### Test 2.4: Add Document Button
- [ ] Click floating **"+"** button (bottom-right)
  - ✅ Should open document form page

#### Test 2.5: User Menu
- [ ] Click profile icon (top-right)
  - ✅ Should show dropdown menu
  - ✅ Should show "Settings" option
  - ✅ Should show "Lock Vault" option

---

### **3. SETTINGS PAGE**

#### Test 3.1: Navigate to Settings
- [ ] Click User Menu → **Settings**
  - ✅ Should show Settings page

#### Test 3.2: Version Info
- [ ] Scroll to **"About"** section at bottom
- [ ] Should see **Version 1.2.0**
- [ ] Should see **"What's New in v1.2.0"** section
- [ ] Should list:
  - Factory Reset functionality for lost recovery keys
  - Improved PIN recovery flow with clear instructions
  - New Danger Zone in Settings for advanced actions

#### Test 3.3: Danger Zone Section
- [ ] Scroll to **"Danger Zone"** section (red-themed)
- [ ] Should have warning icon and text
- [ ] Should see **"Factory Reset"** button with trash icon
- [ ] Click **"Factory Reset"** button
  - ✅ Should show first confirmation dialog
  - [ ] Click **Cancel** → Should dismiss
  - [ ] Click **OK** → Should ask to type "DELETE"
  - [ ] Type "delete" (lowercase) → Should show error
  - [ ] Type "DELETE" (uppercase) → Should delete data and redirect

---

### **4. LOCK & UNLOCK FLOW**

#### Test 4.1: Lock Vault
- [ ] From Settings, click **"Lock Vault"**
  - ✅ Should redirect to Lock Screen
  - ✅ Should show "Enter your PIN to unlock"
  - ✅ Should show **"Forgot your PIN?"** button

#### Test 4.2: Unlock with Correct PIN
- [ ] Enter your 6-digit PIN on number pad
  - ✅ Should auto-submit after 6 digits
  - ✅ Should unlock and go to home page

#### Test 4.3: Unlock with Wrong PIN
- [ ] Lock vault again
- [ ] Enter wrong PIN (e.g., 999999)
  - ✅ Should show error: "Incorrect PIN. Please try again."
  - ✅ PIN input should clear
  - ✅ Error should disappear after 2 seconds

---

### **5. FORGOT PIN FLOW**

#### Test 5.1: Navigate to Forgot PIN
- [ ] From Lock Screen, click **"Forgot your PIN?"**
  - ✅ Should go to `/forgot-pin` page
  - ✅ Should show "Reset Your PIN" heading
  - ✅ Should show recovery key input field

#### Test 5.2: Test with Correct Recovery Key
- [ ] Enter your recovery key (format: XXXX-XXXX-XXXX-XXXX)
- [ ] Click **"Verify & Continue"**
  - ✅ Should show success toast
  - ✅ Should advance to "Create a new PIN" screen
- [ ] Enter new 6-digit PIN
  - ✅ Should advance to confirmation
- [ ] Confirm new PIN
  - ✅ Should show success message
  - ✅ Should redirect to Lock Screen
- [ ] Test new PIN works

#### Test 5.3: Test with Wrong Recovery Key
- [ ] Lock vault and go to Forgot PIN page
- [ ] Enter wrong recovery key (e.g., AAAA-BBBB-CCCC-DDDD)
- [ ] Click **"Verify & Continue"**
  - ✅ Should show error: "Invalid recovery key"

#### Test 5.4: Factory Reset from Forgot PIN
- [ ] Scroll to bottom of Forgot PIN page
- [ ] Should see help section: **"Don't have your recovery key?"**
- [ ] Should see red button: **"Factory Reset - Delete All Data & Start Over"**
- [ ] Click the button
  - ✅ Should show warning dialog
  - [ ] Click **Cancel** → Should dismiss
  - [ ] Click **OK** → Should prompt to type "DELETE"
  - [ ] Type "DELETE" correctly
    - ✅ Should delete all data
    - ✅ Should show success message
    - ✅ Should redirect to `/` (root)
    - ✅ Should show Onboarding page (Welcome screen)

---

### **6. DOCUMENTS FUNCTIONALITY**

#### Test 6.1: Create New Document
- [ ] From home, click **"+"** button
- [ ] Select document type (e.g., Passport)
- [ ] Fill in required fields
- [ ] Click **"Save"**
  - ✅ Should save document
  - ✅ Should return to home page
  - ✅ Document should appear in list

#### Test 6.2: View Document
- [ ] Click on any document card
  - ✅ Should show document details
  - ✅ Should show all fields

#### Test 6.3: Edit Document
- [ ] From document detail, click **"Edit"**
- [ ] Modify a field
- [ ] Click **"Save"**
  - ✅ Should update document

#### Test 6.4: Delete Document
- [ ] From document detail, click **"Delete"**
- [ ] Confirm deletion
  - ✅ Should delete document
  - ✅ Should return to home page

---

### **7. PROFILES FUNCTIONALITY**

#### Test 7.1: Navigate to Profiles
- [ ] Click on Profile selector or go to `/profiles`
  - ✅ Should show profiles page
  - ✅ Should show "Me" profile

#### Test 7.2: Add New Profile
- [ ] Click **"Add Profile"** button
- [ ] Enter name, relationship, select avatar
- [ ] Click **"Save"**
  - ✅ Should create profile
  - ✅ Should appear in list

#### Test 7.3: Switch Profiles
- [ ] From home page, click profile selector
- [ ] Select different profile
  - ✅ Should switch to that profile
  - ✅ Should show only their documents

---

### **8. THEME & SETTINGS**

#### Test 8.1: Dark/Light Mode Toggle
- [ ] Go to Settings
- [ ] Click **Theme** toggle button
  - ✅ Should switch between dark and light mode
  - ✅ Should persist after page reload

#### Test 8.2: Auto-lock Setting
- [ ] In Settings, find **Auto-lock** dropdown
- [ ] Change value (e.g., to 1 minute)
- [ ] Click **"Save"**
  - ✅ Should save setting

#### Test 8.3: Change PIN
- [ ] In Settings → Security, click **"Change PIN"**
- [ ] Should show modal with PIN entry
- [ ] Enter new 6-digit PIN
- [ ] Confirm new PIN
  - ✅ Should update PIN
  - ✅ Test new PIN works when locking/unlocking

---

### **9. NAVIGATION & ROUTING**

#### Test 9.1: All Routes Work
- [ ] `/` → Should show Lock Screen or Onboarding
- [ ] `/home` → Should show home page (if unlocked)
- [ ] `/onboarding` → Should show onboarding (if not initialized)
- [ ] `/forgot-pin` → Should show forgot PIN page
- [ ] `/settings` → Should show settings (if unlocked)
- [ ] `/profiles` → Should show profiles (if unlocked)
- [ ] `/privacy` → Should show privacy policy

#### Test 9.2: Protected Routes
- [ ] Try accessing `/home` when locked
  - ✅ Should redirect to Lock Screen
- [ ] Try accessing `/settings` when locked
  - ✅ Should redirect to Lock Screen

---

### **10. ERROR HANDLING**

#### Test 10.1: Network Offline
- [ ] Disconnect internet
- [ ] App should still work (100% offline)
- [ ] All features should function

#### Test 10.2: Browser Compatibility
Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

---

### **11. MOBILE RESPONSIVENESS**

#### Test 11.1: Mobile View
- [ ] Open on mobile device or use DevTools mobile emulator
- [ ] All buttons should be tappable
- [ ] Navigation should work
- [ ] Number pads should be usable
- [ ] Forms should be accessible

---

## 🎯 **Critical Issues to Watch For**

### ❌ **FAILURES** (Report immediately):
- [ ] Buttons not responding to clicks
- [ ] JavaScript console errors (F12 → Console)
- [ ] Blank pages or infinite loading
- [ ] Data not saving
- [ ] PIN not unlocking
- [ ] Version badge not showing v1.2.0

### ⚠️ **WARNINGS** (Note but not critical):
- [ ] Slow page load
- [ ] UI elements misaligned
- [ ] Console warnings (not errors)

---

## 📸 **Bug Reporting Template**

If you find an issue, report with:

1. **What you did:** (e.g., "Clicked I Understand button")
2. **What happened:** (e.g., "Nothing, button didn't respond")
3. **What should happen:** (e.g., "Should go to PIN entry screen")
4. **Browser:** (e.g., Chrome 120)
5. **Console errors:** (F12 → Screenshot of Console tab)
6. **URL:** (e.g., https://file-safe.vercel.app/onboarding)

---

## ✅ **All Tests Passed?**

If everything works:
- [ ] Mark this checklist as complete
- [ ] Note any minor issues
- [ ] Ready for production use!

---

**Last Updated:** v1.2.0  
**Test Date:** ___________  
**Tested By:** ___________  
**Result:** ☐ Pass  ☐ Fail (with notes)

