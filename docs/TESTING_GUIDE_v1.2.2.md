# 🧪 Testing Guide - FileSafe v1.2.2

**Created:** December 6, 2024  
**Version:** 1.2.2  
**Status:** Test suite implemented ✅

---

## 📋 OVERVIEW

FileSafe now includes a comprehensive testing suite using:
- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM environment for tests

---

## 🚀 QUICK START

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run tests in watch mode (default)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

---

## 📁 TEST STRUCTURE

```
src/
├── test/
│   ├── setup.ts              # Global test setup
│   ├── test-utils.tsx         # Custom render with providers
│   └── mocks/
│       └── vaultStorage.ts    # Mock storage functions
├── pages/
│   └── __tests__/
│       └── OnboardingPage.test.tsx  # Onboarding flow tests
└── utils/
    └── __tests__/
        └── recoveryKey.test.ts      # Recovery key utility tests
```

---

## 🎯 ONBOARDING FLOW TESTS

### Test Coverage

The `OnboardingPage.test.tsx` includes **comprehensive tests** for:

#### 1. Welcome Step
- ✅ Renders welcome screen with heading and description
- ✅ Shows privacy policy link
- ✅ Shows "Already have a vault?" button
- ✅ Moves to PIN entry when clicking "I Understand"
- ✅ Shows error when clicking login with no vault

#### 2. PIN Entry Step
- ✅ Shows PIN entry screen with instructions
- ✅ Displays PIN dots as user enters digits
- ✅ Only accepts numeric input
- ✅ Moves to confirm step after 6 digits
- ✅ Allows deleting last digit
- ✅ Shows back button

#### 3. PIN Confirmation Step
- ✅ Shows confirmation screen
- ✅ Shows error if PINs don't match
- ✅ Proceeds to recovery key if PINs match
- ✅ Allows going back to PIN entry

#### 4. Recovery Key Step
- ✅ Displays recovery key in correct format
- ✅ Has download button
- ✅ Has copy button
- ✅ Copies recovery key to clipboard
- ✅ Shows error when copy fails
- ✅ Downloads recovery key as text file
- ✅ Requires confirmation checkbox
- ✅ Initializes vault after confirmation
- ✅ Shows error if initialization fails
- ✅ Allows going back to PIN confirmation

#### 5. Integration Tests
- ✅ Completes full onboarding flow end-to-end
- ✅ Saves PIN and recovery key correctly
- ✅ Navigates to home after completion

#### 6. Accessibility Tests
- ✅ Has proper ARIA labels
- ✅ Announces PIN entry progress

### Running Onboarding Tests

```bash
# Run only onboarding tests
npm test OnboardingPage

# Run with coverage
npm run test:coverage -- OnboardingPage
```

---

## 🔧 RECOVERY KEY UTILITY TESTS

The `recoveryKey.test.ts` tests all recovery key utilities:

### generateRecoveryKey()
- ✅ Generates key in correct format (XXXX-XXXX-XXXX-XXXX)
- ✅ Generates unique keys
- ✅ Only uses non-ambiguous characters (excludes 0, O, 1, I, L)
- ✅ Has correct length (19 characters)

### validateRecoveryKeyFormat()
- ✅ Validates correct format
- ✅ Rejects incorrect formats
- ✅ Rejects keys with ambiguous characters

### formatRecoveryKeyInput()
- ✅ Formats input with dashes
- ✅ Converts to uppercase
- ✅ Removes and reformats existing dashes
- ✅ Handles partial input
- ✅ Truncates long input
- ✅ Removes non-alphanumeric characters

### compareRecoveryKeys()
- ✅ Matches identical keys
- ✅ Matches keys with different casing
- ✅ Matches keys with different dash placement
- ✅ Doesn't match different keys
- ✅ Handles keys with spaces

---

## 🛠️ WRITING NEW TESTS

### Example: Testing a Component

```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<YourComponent />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

### Example: Testing a Utility Function

```typescript
import { describe, it, expect } from 'vitest';
import { yourUtilityFunction } from '../yourUtility';

describe('yourUtilityFunction', () => {
  it('should return expected result', () => {
    const result = yourUtilityFunction('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(yourUtilityFunction('')).toBe('');
    expect(yourUtilityFunction(null)).toBe(null);
  });
});
```

---

## 🎨 CUSTOM RENDER

The `test-utils.tsx` provides a custom render function that includes all providers:

```typescript
import { render } from '../test/test-utils';
import YourComponent from './YourComponent';

// This automatically wraps your component with:
// - BrowserRouter
// - ThemeProvider
// - ToastProvider
// - VaultProvider

render(<YourComponent />);
```

---

## 🔍 MOCKING

### Mocking Storage Functions

```typescript
import { vi } from 'vitest';
import * as vaultStorage from '../../services/vaultStorage';
import { mockVaultStorage } from '../../test/mocks/vaultStorage';

vi.mock('../../services/vaultStorage', () => mockVaultStorage);

// In your test:
const updateSettingsMock = vi.mocked(vaultStorage.updateSettings);
updateSettingsMock.mockResolvedValueOnce(undefined);
```

### Mocking Navigation

```typescript
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// In your test:
expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
```

---

## 📊 COVERAGE REPORTS

### Running Coverage

```bash
npm run test:coverage
```

### Coverage Output

```
File                          | % Stmts | % Branch | % Funcs | % Lines
------------------------------|---------|----------|---------|--------
src/pages/OnboardingPage.tsx  |   95.2  |   88.3   |   100   |   95.2
src/utils/recoveryKey.ts       |   100   |   100    |   100   |   100
```

Coverage reports are generated in `coverage/` directory:
- `coverage/index.html` - Visual coverage report
- `coverage/coverage-final.json` - Raw coverage data

---

## 🐛 DEBUGGING TESTS

### Enable Debug Mode

```typescript
import { screen } from '@testing-library/react';

// Print current DOM
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));
```

### Run Single Test

```bash
# Run specific test file
npm test OnboardingPage

# Run specific test by name
npm test -- -t "should complete full onboarding flow"
```

### Watch Mode

```bash
# Automatically rerun tests on file changes
npm test
```

---

## ✅ BEST PRACTICES

### 1. Test User Behavior, Not Implementation

```typescript
// ✅ Good - tests what user sees and does
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: /submit/i }));

// ❌ Bad - tests implementation details
expect(component.state.isSubmitting).toBe(true);
```

### 2. Use `waitFor` for Async Updates

```typescript
// ✅ Good
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// ❌ Bad - may fail due to timing
expect(screen.getByText(/success/i)).toBeInTheDocument();
```

### 3. Clean Up After Tests

```typescript
import { afterEach, vi } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
```

### 4. Use Descriptive Test Names

```typescript
// ✅ Good
it('should show error when PINs do not match', () => {});

// ❌ Bad
it('test PIN error', () => {});
```

### 5. Test Accessibility

```typescript
// Check for ARIA labels
expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();

// Check for live regions
expect(screen.getByRole('status')).toBeInTheDocument();
```

---

## 📝 CI/CD INTEGRATION

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## 🎯 NEXT STEPS

### Tests to Add:

1. **HomePage Tests**
   - Search functionality
   - Document filtering
   - Profile switching

2. **DocumentFormPage Tests**
   - Form validation
   - Document creation
   - Document editing

3. **SettingsPage Tests**
   - PIN change flow
   - Factory reset flow
   - Theme toggle

4. **ForgotPinPage Tests**
   - Recovery key verification
   - PIN reset flow

5. **Integration Tests**
   - Full user journeys
   - E2E scenarios

---

## 📚 RESOURCES

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

## 🎉 CONCLUSION

FileSafe now has a solid testing foundation with:
- ✅ 30+ tests for onboarding flow
- ✅ 15+ tests for recovery key utilities
- ✅ Mock infrastructure for storage and APIs
- ✅ Custom render helpers
- ✅ Coverage reporting

**Test early, test often!** 🚀

---

*Last Updated: December 6, 2024*  
*Version: 1.2.2*

