import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, AlertCircle } from 'lucide-react';
import { getSettings, updateSettings, db } from '../services/vaultStorage';
import { compareRecoveryKeys, formatRecoveryKeyInput } from '../utils/recoveryKey';
import { useToast } from '../context/ToastContext';

const ForgotPinPage: React.FC = () => {
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter-key' | 'new-pin' | 'confirm-pin'>('enter-key');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const handleRecoveryKeyInput = (value: string) => {
    const formatted = formatRecoveryKeyInput(value);
    setRecoveryKey(formatted);
    setError('');
  };

  const handleVerifyRecoveryKey = async () => {
    if (recoveryKey.length < 19) {
      setError('Please enter complete recovery key');
      return;
    }

    setIsVerifying(true);

    try {
      const settings = await getSettings();

      if (!settings || !settings.recoveryKey) {
        setError('No recovery key found. Vault may not be initialized.');
        setIsVerifying(false);
        return;
      }

      if (compareRecoveryKeys(recoveryKey, settings.recoveryKey)) {
        success('✓ Recovery key verified');
        setStep('new-pin');
        setError('');
      } else {
        setError('Invalid recovery key. Please check and try again.');
        showError('Invalid recovery key');
      }
    } catch (err) {
      setError('Failed to verify recovery key');
      showError('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePinInput = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      if (step === 'new-pin') {
        setNewPin(value);
        if (value.length === 6) {
          setTimeout(() => {
            setStep('confirm-pin');
            setError('');
          }, 300);
        }
      } else if (step === 'confirm-pin') {
        setConfirmPin(value);
        if (value.length === 6) {
          setTimeout(() => handleResetPin(value), 300);
        }
      }
    }
  };

  const handleResetPin = async (confirmValue?: string) => {
    const confirmPinValue = confirmValue || confirmPin;

    if (newPin !== confirmPinValue) {
      setError('PINs do not match. Please try again.');
      setStep('new-pin');
      setNewPin('');
      setConfirmPin('');
      showError('PINs do not match');
      return;
    }

    try {
      await updateSettings({ pin: newPin });
      success('✓ PIN reset successfully');

      // Navigate back to lock screen
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    } catch (err) {
      setError('Failed to reset PIN. Please try again.');
      showError('PIN reset failed');
    }
  };

  const handleBack = () => {
    if (step === 'confirm-pin') {
      setStep('new-pin');
      setConfirmPin('');
      setError('');
    } else if (step === 'new-pin') {
      setStep('enter-key');
      setNewPin('');
      setConfirmPin('');
      setError('');
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleFactoryReset = async () => {
    const userConfirm = window.confirm(
      '⚠️ FACTORY RESET WARNING ⚠️\n\n' +
      'This will permanently delete ALL your data:\n' +
      '• All profiles\n' +
      '• All documents\n' +
      '• All settings\n\n' +
      'This action CANNOT be undone!\n\n' +
      'Do you want to continue?'
    );

    if (!userConfirm) return;

    const typeConfirm = prompt('Type "DELETE" in capital letters to confirm factory reset:');

    if (typeConfirm === 'DELETE') {
      try {
        // Delete the entire database
        await db.delete();
        success('✓ All data deleted. Redirecting to setup...');
        
        // Small delay to show success message, then reload
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } catch (err) {
        showError('Failed to reset. Please try again.');
      }
    } else if (typeConfirm !== null) {
      // User typed something but not "DELETE"
      showError('Reset cancelled - incorrect confirmation text');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-lg mb-4">
            <Key className="text-primary-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Your PIN</h1>
          <p className="text-primary-100">
            {step === 'enter-key' && 'Enter your recovery key to continue'}
            {step === 'new-pin' && 'Create a new 6-digit PIN'}
            {step === 'confirm-pin' && 'Confirm your new PIN'}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {step === 'enter-key' ? (
            <>
              {/* Recovery Key Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recovery Key
                </label>
                <input
                  type="text"
                  value={recoveryKey}
                  onChange={(e) => handleRecoveryKeyInput(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 text-center text-lg font-mono tracking-wider rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all uppercase"
                  maxLength={19}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enter the recovery key you saved during setup
                </p>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyRecoveryKey}
                disabled={recoveryKey.length < 19 || isVerifying}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </>
          ) : (
            <>
              {/* PIN Display */}
              <div className="flex justify-center gap-3 mb-8">
                {[...Array(6)].map((_, i) => {
                  const currentPin = step === 'new-pin' ? newPin : confirmPin;
                  const isFilled = i < currentPin.length;

                  return (
                    <div
                      key={i}
                      className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                        isFilled
                          ? 'border-primary-500 bg-primary-50 text-primary-900'
                          : 'border-gray-200 bg-gray-50 text-gray-300'
                      }`}
                    >
                      {isFilled ? '•' : ''}
                    </div>
                  );
                })}
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => handlePinInput((step === 'new-pin' ? newPin : confirmPin) + num)}
                    className="h-16 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-2xl font-semibold text-gray-900 transition-colors"
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={handleBack}
                  className="h-16 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={() => handlePinInput((step === 'new-pin' ? newPin : confirmPin) + '0')}
                  className="h-16 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-2xl font-semibold text-gray-900 transition-colors"
                >
                  0
                </button>

                <button
                  onClick={() => {
                    if (step === 'new-pin') {
                      setNewPin(newPin.slice(0, -1));
                    } else {
                      setConfirmPin(confirmPin.slice(0, -1));
                    }
                  }}
                  className="h-16 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 animate-fadeIn">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Back to Login */}
        {step === 'enter-key' && (
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>
        )}

        {/* Help Text with Factory Reset */}
        {step === 'enter-key' && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-xs space-y-3">
            <div>
              <p className="font-semibold mb-1">❌ Don't have your recovery key?</p>
              <p className="opacity-90 mb-2 leading-relaxed">
                Your recovery key was shown once during setup. Without it, you cannot recover your PIN or access your data.
              </p>
            </div>
            
            <button
              onClick={handleFactoryReset}
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors shadow-lg"
            >
              🗑️ Factory Reset - Delete All Data & Start Over
            </button>
            
            <p className="text-xs opacity-75 text-center leading-relaxed">
              ⚠️ Warning: This permanently deletes all profiles, documents, and settings. This action cannot be undone.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPinPage;
