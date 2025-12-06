import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { VaultProvider, useVault } from './context/VaultContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import DocumentFormPage from './pages/DocumentFormPage';
import ProfilesPage from './pages/ProfilesPage';
import SettingsPage from './pages/SettingsPage';
import ForgotPinPage from './pages/ForgotPinPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

// Error Handling
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLocked, isInitialized, isLoading } = useVault();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 dark:border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading FileSafe...</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isLocked) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Lock Screen Component
const LockScreen: React.FC = () => {
  const [pin, setPin] = React.useState('');
  const [error, setError] = React.useState('');
  const { unlock, isInitialized } = useVault();

  // Safety check: If somehow not initialized, redirect to onboarding
  // This shouldn't happen with SmartRoot, but acts as a fallback
  if (!isInitialized) {
    return <Navigate to="/onboarding" replace />;
  }

  const handlePinInput = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setPin(value);

      if (value.length === 6) {
        // Auto-submit when 6 digits entered
        setTimeout(() => handleUnlock(value), 300);
      }
    }
  };

  const handleUnlock = async (pinValue?: string) => {
    const pinToUse = pinValue || pin;
    const success = await unlock(pinToUse);

    if (!success) {
      setError('Incorrect PIN. Please try again.');
      setPin('');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-900 dark:to-primary-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-7xl mb-6" aria-hidden="true">🔐</div>
          <h1 className="text-4xl font-bold text-white mb-3">FileSafe</h1>
          <p className="text-xl text-primary-100 dark:text-primary-200" id="lock-screen-instructions">Enter your PIN to unlock</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8" role="main" aria-labelledby="lock-screen-instructions">
          {/* PIN Display */}
          <div className="flex justify-center gap-3 mb-10" role="status" aria-live="polite" aria-label={`PIN entered: ${pin.length} of 6 digits`}>
            {[...Array(6)].map((_, i) => {
              const isFilled = i < pin.length;
              return (
                <div
                  key={i}
                  className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-bold transition-all ${
                    isFilled
                      ? 'border-primary-500 bg-primary-50 text-primary-900 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-100'
                      : 'border-gray-200 bg-gray-50 text-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500'
                  }`}
                  aria-hidden="true"
                >
                  {isFilled ? '•' : ''}
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 text-center text-red-600 dark:text-red-400 text-lg font-medium animate-fadeIn" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3" role="group" aria-label="PIN number pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handlePinInput(pin + num)}
                className="h-20 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200
                           dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500
                           text-3xl font-semibold text-gray-900 dark:text-gray-100 transition-colors"
                aria-label={`Enter ${num}`}
              >
                {num}
              </button>
            ))}

            <div className="h-20" aria-hidden="true"></div>

            <button
              onClick={() => handlePinInput(pin + '0')}
              className="h-20 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200
                         dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500
                         text-3xl font-semibold text-gray-900 dark:text-gray-100 transition-colors"
              aria-label="Enter 0"
            >
              0
            </button>

            <button
              onClick={() => setPin(pin.slice(0, -1))}
              className="h-20 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200
                         dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500
                         text-base font-medium text-gray-700 dark:text-gray-300 transition-colors"
              aria-label="Delete last digit"
              disabled={pin.length === 0}
            >
              Delete
            </button>
          </div>

          {/* Forgot PIN Link - Made more prominent */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
            <Link
              to="/forgot-pin"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 
                         bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-900/30 dark:to-primary-900/30
                         hover:from-blue-100 hover:to-primary-100 dark:hover:from-blue-900/50 dark:hover:to-primary-900/50
                         border-2 border-blue-200 dark:border-blue-700
                         rounded-xl transition-all duration-200 
                         text-primary-700 dark:text-primary-300 font-semibold text-lg
                         shadow-sm hover:shadow-md active:scale-98"
            >
              <span className="text-2xl">🔑</span>
              <span>Forgot your PIN?</span>
            </Link>
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-3">
              Use your recovery key to reset your PIN
            </p>
          </div>
        </div>

        {/* Additional Help Text Outside Card */}
        <div className="mt-4 text-center space-y-2">
          <p className="text-primary-100 dark:text-primary-200 text-sm">
            Lost your recovery key? Contact support
          </p>
          <p className="text-primary-200 dark:text-primary-300 text-xs opacity-75">
            FileSafe v1.1.0
          </p>
        </div>
      </div>
    </div>
  );
};

// Smart Root Component that routes based on vault state
const SmartRoot: React.FC = () => {
  const { isInitialized, isLocked, isLoading } = useVault();

  // Show loading spinner while checking vault state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 dark:border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading FileSafe...</p>
        </div>
      </div>
    );
  }

  // NEW USER PATH: No vault exists yet → Show onboarding
  if (!isInitialized) {
    return <Navigate to="/onboarding" replace />;
  }

  // EXISTING USER PATH: Vault exists
  
  // If locked → Show login screen
  if (isLocked) {
    return <LockScreen />;
  }

  // If unlocked → Go to home
  return <Navigate to="/home" replace />;
};

// App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SmartRoot />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/forgot-pin" element={<ForgotPinPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/document/:id"
        element={
          <ProtectedRoute>
            <DocumentDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/:id"
        element={
          <ProtectedRoute>
            <DocumentFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles"
        element={
          <ProtectedRoute>
            <ProfilesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to root for smart routing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <VaultProvider>
              {/* Skip Navigation Link for Accessibility */}
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <AppRoutes />
            </VaultProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;