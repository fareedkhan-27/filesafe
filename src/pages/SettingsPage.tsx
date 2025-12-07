import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, AlertCircle, LogOut, Sun, Moon, Database, Shield, ExternalLink, Trash2 } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useTheme } from '../context/ThemeContext';
import { updateSettings, db } from '../services/vaultStorage';
import { useToast } from '../context/ToastContext';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, lock, refreshSettings } = useVault();
  const { theme, toggleTheme } = useTheme();
  const { success, error: showError } = useToast();

  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');

  const [autoLockSeconds, setAutoLockSeconds] = useState(settings?.autoLockSeconds || 300);
  const [error, setError] = useState<string>('');
  
  const [showFactoryResetModal, setShowFactoryResetModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handlePinInput = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      if (step === 'enter') {
        setNewPin(value);
        if (value.length === 6) {
          setTimeout(() => setStep('confirm'), 300);
        }
      } else {
        setConfirmNewPin(value);
        if (value.length === 6) {
          setTimeout(() => handleChangePinSubmit(value), 300);
        }
      }
    }
  };

  const handleChangePinSubmit = async (confirmValue?: string) => {
    const confirmPinValue = confirmValue || confirmNewPin;

    if (newPin !== confirmPinValue) {
      setError('PINs do not match. Please try again.');
      setTimeout(() => setError(''), 3000);
      setStep('enter');
      setNewPin('');
      setConfirmNewPin('');
      return;
    }

    try {
      await updateSettings({ pin: newPin });
      await refreshSettings();
      setShowChangePinModal(false);
      setNewPin('');
      setConfirmNewPin('');
      setStep('enter');
      setError('');
    } catch (error) {
      setError('Failed to change PIN. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSaveAutoLock = async () => {
    try {
      await updateSettings({ autoLockSeconds });
      await refreshSettings();
    } catch (error) {
      setError('Failed to save setting. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLock = () => {
    lock();
    navigate('/', { replace: true });
  };

  const handleFactoryReset = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type "DELETE" in capital letters to confirm');
      return;
    }

    try {
      // Delete the entire database
      await db.delete();
      success('✓ All data deleted. Redirecting...');
      
      // Close modal
      setShowFactoryResetModal(false);
      setDeleteConfirmText('');
      
      // Navigate to onboarding after small delay
      setTimeout(() => {
        // Force full page reload to reset all state
        window.location.href = '/onboarding';
      }, 1500);
    } catch (err) {
      showError('Failed to reset. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-20 safe-bottom">
      {/* Header - Clean iOS style */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 safe-top shadow-sm">
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all min-w-touch min-h-touch flex items-center justify-center"
              aria-label="Back to home"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          </div>
        </div>
      </div>

      {/* Error Message - Light theme */}
      {error && (
        <div className="mx-5 mt-5">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-base text-red-900 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-5 py-6 space-y-6">
        {/* Privacy & Storage Status - Light theme, iOS-inspired */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield size={22} className="text-primary-500" />
            Privacy & Storage
          </h2>

          <div className="space-y-3">
            {/* Local Storage Status - Green success card */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="text-emerald-600" size={20} />
                    <h3 className="font-bold text-emerald-900 text-lg">
                      100% Local Storage
                    </h3>
                  </div>
                  <p className="text-sm text-emerald-800 mb-3 leading-relaxed">
                    Your documents are stored only on this device. Never sent to any server.
                  </p>
                  <ul className="text-sm text-emerald-800 space-y-1.5 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Works completely offline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>No internet connection required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Your data stays private</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>You have full control</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Prototype Warning - Amber warning card */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-bold text-amber-900 text-base mb-2">
                    Prototype Version
                  </h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Data is NOT encrypted yet. Encryption will be added in the next update.
                    Use for testing and managing non-sensitive family documents.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy Link - Clean list item style */}
            <Link
              to="/privacy"
              className="block bg-white border border-slate-200 rounded-xl p-4 hover:bg-slate-50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="text-primary-500" size={22} />
                  <div>
                    <p className="font-semibold text-slate-900 text-base">
                      Privacy Policy
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Learn how we protect your data
                    </p>
                  </div>
                </div>
                <span className="text-slate-400 text-xl">→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Appearance Section - System Settings style */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Appearance</h2>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="mb-3">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={22} className="text-primary-500" /> : <Sun size={22} className="text-amber-500" />}
                <div>
                  <p className="text-base font-semibold text-slate-900">Theme</p>
                  <p className="text-sm text-slate-600">Choose light or dark mode</p>
                </div>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-all border border-slate-200"
            >
              <span className="text-base font-semibold text-slate-900">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              <div className="flex items-center gap-3">
                <Sun className={theme === 'light' ? 'text-amber-500' : 'text-slate-400'} size={20} />
                <div className={`w-14 h-8 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-slate-300'}`}>
                  <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <Moon className={theme === 'dark' ? 'text-primary-500' : 'text-slate-400'} size={20} />
              </div>
            </button>
          </div>
        </div>

        {/* Security Section - iOS Settings list style */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Security</h2>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
            {/* Change PIN */}
            <button
              onClick={() => setShowChangePinModal(true)}
              className="w-full flex items-center justify-between hover:bg-slate-50 p-4 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Lock className="text-primary-500" size={22} />
                <div>
                  <p className="text-base font-semibold text-slate-900">Change PIN</p>
                  <p className="text-sm text-slate-600">Update your vault PIN</p>
                </div>
              </div>
              <span className="text-slate-400 text-xl">→</span>
            </button>

            {/* Auto-lock */}
            <div className="p-4">
              <div className="mb-3">
                <p className="text-base font-semibold text-slate-900">Auto-lock</p>
                <p className="text-sm text-slate-600">Lock vault after inactivity</p>
              </div>

              <div className="flex gap-3 items-center">
                <select
                  value={autoLockSeconds}
                  onChange={e => setAutoLockSeconds(Number(e.target.value))}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 bg-white text-slate-900 text-base focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 transition-all"
                >
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                  <option value="1800">30 minutes</option>
                  <option value="3600">1 hour</option>
                </select>
                <button
                  onClick={handleSaveAutoLock}
                  className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 active:bg-primary-700 transition-all shadow-sm min-h-button"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Lock Vault */}
            <button
              onClick={handleLock}
              className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 p-4 transition-all text-left"
            >
              <LogOut size={22} />
              <div>
                <p className="text-base font-semibold">Lock Vault</p>
                <p className="text-sm text-slate-600">Require PIN to access</p>
              </div>
            </button>
          </div>
        </div>

        {/* Danger Zone - Clear, separated, highly visible warning */}
        <div>
          <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
            <AlertCircle size={22} />
            Danger Zone
          </h2>

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-base text-red-900 font-bold mb-1">
                  Destructive Actions
                </p>
                <p className="text-sm text-red-800 leading-relaxed">
                  These actions permanently delete your data and cannot be undone.
                </p>
              </div>
            </div>

            <div className="border-t border-red-200 pt-4">
              <button
                onClick={() => setShowFactoryResetModal(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-red-100 border-2 border-red-300 hover:border-red-400 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="text-red-600" size={22} />
                  <div className="text-left">
                    <p className="text-base font-bold text-red-600">Factory Reset</p>
                    <p className="text-sm text-red-700">Delete all data and start over</p>
                  </div>
                </div>
                <span className="text-red-400 text-xl">→</span>
              </button>

              <div className="mt-3 bg-white/60 rounded-lg p-3 border border-red-200">
                <p className="text-xs text-red-800 leading-relaxed">
                  ⚠️ This will permanently delete all profiles, documents, settings, your PIN, and recovery key.
                  You will need to set up FileSafe again from scratch.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About - Clean, readable information card */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">About</h2>
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <p className="text-lg font-bold text-slate-900 mb-2">
                FileSafe
              </p>
              <p className="text-base text-slate-700 mb-1">Version 1.1.1</p>
              <p className="text-sm text-slate-600">Build: {new Date().toISOString().split('T')[0]}</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                A personal document assistant with instant search
              </p>
              <div className="mt-4 bg-primary-50 border border-primary-200 rounded-lg p-3">
                <p className="font-semibold text-primary-900 text-sm mb-2">✨ What's New in v1.1.1:</p>
                <ul className="space-y-1 text-sm text-primary-800">
                  <li>• Complete UI redesign with light, iOS-inspired theme</li>
                  <li>• Optimized for users aged 35-75+ with larger text and touch targets</li>
                  <li>• Clean white backgrounds with subtle shadows</li>
                  <li>• Updated all forms, cards, and components</li>
                  <li>• Improved readability and accessibility</li>
                </ul>
              </div>
            </div>

            {/* Developer Credits */}
            <div className="border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600 mb-2">Developed by</p>
              <a
                href="https://www.linkedin.com/in/fareedkhankk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Fareed Khan
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Change PIN Modal - Light theme, iOS-inspired */}
      {showChangePinModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              {step === 'enter' ? 'Enter New PIN' : 'Confirm New PIN'}
            </h3>

            {/* PIN Display */}
            <div className="flex justify-center gap-3 mb-8">
              {[...Array(6)].map((_, i) => {
                const currentPin = step === 'enter' ? newPin : confirmNewPin;
                const isFilled = i < currentPin.length;

                return (
                  <div
                    key={i}
                    className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                      isFilled
                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                        : 'border-slate-300 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {isFilled ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {/* Number Pad - Light, tactile buttons */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handlePinInput((step === 'enter' ? newPin : confirmNewPin) + num)}
                  className="h-16 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200
                             text-2xl font-semibold text-slate-900 transition-all shadow-sm"
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => {
                  if (step === 'confirm') {
                    setStep('enter');
                    setConfirmNewPin('');
                  }
                }}
                disabled={step === 'enter'}
                className={`h-16 rounded-xl text-sm font-medium transition-all ${
                  step === 'enter'
                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                Back
              </button>

              <button
                onClick={() => handlePinInput((step === 'enter' ? newPin : confirmNewPin) + '0')}
                className="h-16 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200
                           text-2xl font-semibold text-slate-900 transition-all shadow-sm"
              >
                0
              </button>

              <button
                onClick={() => {
                  if (step === 'enter') {
                    setNewPin(newPin.slice(0, -1));
                  } else {
                    setConfirmNewPin(confirmNewPin.slice(0, -1));
                  }
                }}
                className="h-16 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200
                           text-sm font-medium text-slate-900 transition-all shadow-sm"
              >
                Delete
              </button>
            </div>

            <button
              onClick={() => {
                setShowChangePinModal(false);
                setNewPin('');
                setConfirmNewPin('');
                setStep('enter');
              }}
              className="w-full px-6 py-4 rounded-xl bg-white text-slate-700 font-semibold hover:bg-slate-50 border-2 border-slate-300 transition-all shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Factory Reset Modal - Light theme, highly visible warning */}
      {showFactoryResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fadeIn">
          <div className="bg-white border-2 border-red-300 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">Factory Reset</h3>
              <p className="text-sm text-slate-700 font-medium">This action cannot be undone!</p>
            </div>

            {/* Warning List - Clear, readable */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-red-900 mb-3">This will permanently delete:</p>
              <ul className="text-sm text-red-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>All profiles and documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Your PIN and recovery key</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>All settings and preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Everything in your vault</span>
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-red-300 rounded-xl">
                <p className="text-sm text-red-900 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Confirmation Input - Clear, prominent */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2 text-center">
                Type <span className="font-bold text-red-600 text-base">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => {
                  setDeleteConfirmText(e.target.value);
                  setError('');
                }}
                placeholder="Type DELETE here"
                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl
                           text-slate-900 placeholder-slate-400 text-center font-mono text-lg
                           focus:border-red-500 focus:ring-4 focus:ring-red-500/15 focus:outline-none transition-all"
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <p className="text-xs text-slate-600 mt-2 text-center font-medium">
                Must be typed exactly as shown (all caps)
              </p>
            </div>

            {/* Action Buttons - Clear visual hierarchy */}
            <div className="space-y-3">
              <button
                onClick={handleFactoryReset}
                disabled={deleteConfirmText !== 'DELETE'}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                  deleteConfirmText === 'DELETE'
                    ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md hover:shadow-lg active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {deleteConfirmText === 'DELETE' ? '🗑️ Delete Everything' : 'Type DELETE to enable'}
              </button>

              <button
                onClick={() => {
                  setShowFactoryResetModal(false);
                  setDeleteConfirmText('');
                  setError('');
                }}
                className="w-full py-4 rounded-xl font-semibold text-base
                           bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 transition-all shadow-sm"
              >
                Cancel
              </button>
            </div>

            {/* Additional Warning - Subtle info */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-600 text-center leading-relaxed">
                After deletion, you'll be redirected to the welcome screen to set up FileSafe again from scratch.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
