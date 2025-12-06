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
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10 safe-top shadow-lg">
        <div className="px-5 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all"
            >
              <ArrowLeft size={28} />
            </button>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-5 mt-5">
          <div className="card bg-red-500/10 border-red-500/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-400" size={24} />
              <p className="text-base text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-5 py-6 space-y-6">
        {/* Privacy & Storage Status */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Shield size={24} className="text-cyan-400" />
            Privacy & Storage
          </h2>
          
          <div className="space-y-4">
            {/* Local Storage Status */}
            <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="text-emerald-400" size={20} />
                    <h3 className="font-bold text-emerald-300 text-lg">
                      100% Local Storage
                    </h3>
                  </div>
                  <p className="text-sm text-emerald-200 mb-2">
                    Your documents are stored only on this device. Never sent to any server.
                  </p>
                  <ul className="text-sm text-emerald-200 space-y-1 ml-4">
                    <li className="flex items-start gap-2">
                      <span>✓</span>
                      <span>Works completely offline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✓</span>
                      <span>No internet connection required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✓</span>
                      <span>Your data stays private</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✓</span>
                      <span>You have full control</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Prototype Warning */}
            <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-bold text-amber-300 text-base mb-2">
                    Prototype Version
                  </h3>
                  <p className="text-sm text-amber-200 mb-2">
                    Data is NOT encrypted yet. Encryption will be added in the next update. 
                    Use for testing and managing non-sensitive family documents.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy Link */}
            <Link
              to="/privacy"
              className="block card hover:shadow-xl hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="text-cyan-400" size={24} />
                  <div>
                    <p className="font-semibold text-white text-lg">
                      Privacy Policy
                    </p>
                    <p className="text-sm text-slate-400">
                      Learn how we protect your data
                    </p>
                  </div>
                </div>
                <span className="text-slate-600 text-2xl">→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Appearance Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Appearance</h2>

          <div className="card space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  {theme === 'dark' ? <Moon size={24} className="text-cyan-400" /> : <Sun size={24} className="text-amber-400" />}
                  <div>
                    <p className="text-lg font-semibold text-white">Theme</p>
                    <p className="text-base text-slate-400">Choose light or dark mode</p>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="w-full px-6 py-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 flex items-center justify-between transition-all border border-slate-600/50"
              >
                <span className="text-lg font-semibold text-white">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                <div className="flex items-center gap-3">
                  <Sun className={theme === 'light' ? 'text-amber-400' : 'text-slate-500'} size={24} />
                  <div className={`w-16 h-8 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-cyan-500' : 'bg-slate-600'}`}>
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'}`}></div>
                  </div>
                  <Moon className={theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'} size={24} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Security</h2>

          <div className="card space-y-5">
            <button
              onClick={() => setShowChangePinModal(true)}
              className="w-full flex items-center justify-between hover:bg-slate-700/30 p-2 rounded-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <Lock className="text-cyan-400" size={24} />
                <div className="text-left">
                  <p className="text-lg font-medium text-white">Change PIN</p>
                  <p className="text-base text-slate-400">Update your vault PIN</p>
                </div>
              </div>
            </button>

            <div className="border-t border-slate-700/50 pt-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-lg font-medium text-white">Auto-lock</p>
                  <p className="text-base text-slate-400">Lock vault after inactivity</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <select
                  value={autoLockSeconds}
                  onChange={e => setAutoLockSeconds(Number(e.target.value))}
                  className="input flex-1 text-lg py-3"
                >
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                  <option value="1800">30 minutes</option>
                  <option value="3600">1 hour</option>
                </select>
                <button onClick={handleSaveAutoLock} className="btn-secondary text-lg px-6 py-3">
                  Save
                </button>
              </div>
            </div>

            <div className="border-t border-slate-700/50 pt-5">
              <button
                onClick={handleLock}
                className="w-full flex items-center gap-4 text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all"
              >
                <LogOut size={24} />
                <div className="text-left">
                  <p className="text-lg font-medium">Lock Vault</p>
                  <p className="text-base opacity-80">Require PIN to access</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h2 className="text-2xl font-semibold text-red-400 mb-4 flex items-center gap-2">
            <AlertCircle size={24} />
            Danger Zone
          </h2>
          
          <div className="card bg-red-500/5 border-red-500/30 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-base text-red-300 font-semibold mb-1">
                  Destructive Actions
                </p>
                <p className="text-sm text-slate-400">
                  These actions permanently delete your data and cannot be undone.
                </p>
              </div>
            </div>

            <div className="border-t border-red-500/20 pt-4">
              <button
                onClick={() => setShowFactoryResetModal(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 border-2 border-red-500/30 hover:border-red-500/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Trash2 className="text-red-400 group-hover:text-red-300" size={24} />
                  <div className="text-left">
                    <p className="text-lg font-semibold text-red-400 group-hover:text-red-300">Factory Reset</p>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300">Delete all data and start over</p>
                  </div>
                </div>
                <span className="text-red-500/50 group-hover:text-red-400 text-xl">→</span>
              </button>
              
              <div className="mt-3 bg-slate-800/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  ⚠️ This will permanently delete all profiles, documents, settings, your PIN, and recovery key. 
                  You will need to set up FileSafe again from scratch.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">About</h2>
          <div className="card space-y-4">
            <div>
              <p className="text-base text-slate-300 mb-2">
                <strong>FileSafe</strong>
              </p>
              <p className="text-base text-slate-400 mb-1">Version 1.2.1</p>
              <p className="text-xs text-slate-500">Build: {new Date().toISOString().split('T')[0]}</p>
              <p className="text-sm text-slate-500 mt-3">
                A personal document assistant with instant search
              </p>
              <div className="mt-3 text-xs text-cyan-400">
                <p className="font-semibold mb-1">✨ What's New in v1.2.1:</p>
                <ul className="space-y-1 text-slate-400">
                  <li>• Beautiful Factory Reset modal with type-to-confirm</li>
                  <li>• Auto-redirect to onboarding after reset</li>
                  <li>• Version number visible on all screens</li>
                  <li>• Complete VaultKey → FileSafe renaming</li>
                  <li>• Comprehensive documentation and cleanup</li>
                </ul>
              </div>
            </div>

            {/* Developer Credits */}
            <div className="border-t border-slate-700/50 pt-4">
              <p className="text-sm text-slate-400 mb-2">Developed by</p>
              <a 
                href="https://linkedin.com/in/fareedkhankk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Fareed Khan
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fadeIn">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">
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
                    className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                      isFilled
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                        : 'border-slate-600 bg-slate-900/50 text-slate-600'
                    }`}
                  >
                    {isFilled ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handlePinInput((step === 'enter' ? newPin : confirmNewPin) + num)}
                  className="h-16 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-600 border border-slate-600/50
                             text-2xl font-semibold text-white transition-all"
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
                className={`h-16 rounded-xl text-base font-medium transition-all ${
                  step === 'enter'
                    ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-700/30'
                    : 'bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-600 text-slate-300 border border-slate-600/50'
                }`}
              >
                Back
              </button>

              <button
                onClick={() => handlePinInput((step === 'enter' ? newPin : confirmNewPin) + '0')}
                className="h-16 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-600 border border-slate-600/50
                           text-2xl font-semibold text-white transition-all"
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
                className="h-16 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-600 border border-slate-600/50
                           text-base font-medium text-slate-300 transition-all"
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
              className="w-full btn-secondary text-lg py-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Factory Reset Modal */}
      {showFactoryResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fadeIn">
          <div className="bg-slate-800 border-2 border-red-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                <AlertCircle className="text-red-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-2">Factory Reset</h3>
              <p className="text-sm text-slate-300">This action cannot be undone!</p>
            </div>

            {/* Warning List */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-red-300 mb-3">This will permanently delete:</p>
              <ul className="text-sm text-slate-300 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>All profiles and documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Your PIN and recovery key</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>All settings and preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Everything in your vault</span>
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg">
                <p className="text-sm text-red-300 text-center">{error}</p>
              </div>
            )}

            {/* Confirmation Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Type <span className="font-bold text-red-400">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => {
                  setDeleteConfirmText(e.target.value);
                  setError(''); // Clear error when user types
                }}
                placeholder="Type DELETE here"
                className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-600 rounded-xl
                           text-white placeholder-slate-500 text-center font-mono text-lg
                           focus:border-red-500 focus:outline-none transition-colors"
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <p className="text-xs text-slate-400 mt-2 text-center">
                Must be typed exactly as shown (all caps)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleFactoryReset}
                disabled={deleteConfirmText !== 'DELETE'}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  deleteConfirmText === 'DELETE'
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 active:scale-98'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
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
                className="w-full py-4 rounded-xl font-semibold text-lg
                           bg-slate-700 hover:bg-slate-600 text-white transition-all"
              >
                Cancel
              </button>
            </div>

            {/* Additional Warning */}
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
              <p className="text-xs text-slate-400 text-center leading-relaxed">
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
