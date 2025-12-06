import React, { useState } from 'react';
import { Lock, AlertCircle, Key, Download, Copy, Check } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useNavigate } from 'react-router-dom';
import { generateRecoveryKey } from '../utils/recoveryKey';
import { copyToClipboard, triggerHapticFeedback } from '../utils/clipboard';

const OnboardingPage: React.FC = () => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'welcome' | 'enter' | 'confirm' | 'recovery-key'>('welcome');
  const [error, setError] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [savedConfirmed, setSavedConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { initializeVault, isInitialized } = useVault();
  const navigate = useNavigate();

  // If vault is already initialized, redirect to root (SmartRoot will handle routing)
  React.useEffect(() => {
    if (isInitialized) {
      navigate('/', { replace: true });
    }
  }, [isInitialized, navigate]);

  const handlePinInput = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      if (step === 'enter') {
        setPin(value);
        if (value.length === 6) {
          setTimeout(() => setStep('confirm'), 300);
        }
      } else if (step === 'confirm') {
        setConfirmPin(value);
        if (value.length === 6) {
          setTimeout(() => handlePinConfirm(value), 300);
        }
      }
    }
  };

  const handlePinConfirm = (confirmValue?: string) => {
    const confirmPinValue = confirmValue || confirmPin;

    if (pin !== confirmPinValue) {
      setError('PINs do not match. Please try again.');
      setStep('enter');
      setPin('');
      setConfirmPin('');
      return;
    }

    // Generate recovery key and show it
    const generatedKey = generateRecoveryKey();
    setRecoveryKey(generatedKey);
    setStep('recovery-key');
    setError('');
  };

  const handleContinue = async () => {
    if (!savedConfirmed) {
      setError('Please confirm you have saved your recovery key');
      return;
    }

    try {
      await initializeVault(pin, recoveryKey);
      navigate('/home', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to initialize vault: ${errorMessage}. Please try again.`);
    }
  };

  const handleDownloadRecoveryKey = () => {
    try {
      const blob = new Blob(
        [
          `FileSafe Recovery Key\n\n`,
          `Recovery Key: ${recoveryKey}\n\n`,
          `IMPORTANT: Keep this key safe and secret.\n`,
          `You will need this key if you forget your PIN.\n`,
          `Without this key, you cannot recover your vault.\n\n`,
          `Generated: ${new Date().toLocaleString()}\n`
        ],
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `filesafe-recovery-key-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Download failed. Please try copying the key manually.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleCopyRecoveryKey = async () => {
    const success = await copyToClipboard(recoveryKey);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      triggerHapticFeedback();
    } else {
      setError('Copy not supported. Please write down the key manually or use the Download button.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('enter');
      setConfirmPin('');
      setError('');
    } else if (step === 'recovery-key') {
      setStep('confirm');
      setSavedConfirmed(false);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Icon */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl mb-4" aria-hidden="true">
            {step === 'welcome' ? (
              <div className="text-5xl">🔒</div>
            ) : step === 'recovery-key' ? (
              <Key className="text-cyan-400" size={40} />
            ) : (
              <Lock className="text-cyan-400" size={40} />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" id="onboarding-title">
            {step === 'welcome' && 'Welcome to FileSafe'}
            {step === 'enter' && 'Create Your PIN'}
            {step === 'confirm' && 'Confirm Your PIN'}
            {step === 'recovery-key' && 'Save Your Recovery Key'}
          </h1>
          <p className="text-slate-300 text-lg" id="onboarding-instructions">
            {step === 'welcome' && 'Your family documents, secure and private'}
            {step === 'enter' && 'Create a 6-digit PIN to secure your vault'}
            {step === 'confirm' && 'Confirm your PIN'}
            {step === 'recovery-key' && 'This key allows you to reset your PIN if forgotten'}
          </p>
        </header>

        {/* Content Card */}
        <main className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 mb-6" role="main" aria-labelledby="onboarding-title" aria-describedby="onboarding-instructions">
          {step === 'welcome' ? (
            <>
              {/* Privacy Disclaimer */}
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-5">
                  <h3 className="font-bold text-emerald-300 mb-3 flex items-center gap-2 text-lg">
                    <span className="text-2xl">✅</span>
                    <span>What We Do</span>
                  </h3>
                  <ul className="text-sm text-emerald-200 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Store ALL data on YOUR device only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Work completely offline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Give you full control of your family documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Keep your information 100% private</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl p-5">
                  <h3 className="font-bold text-cyan-300 mb-3 flex items-center gap-2 text-lg">
                    <span className="text-2xl">❌</span>
                    <span>What We DON'T Do</span>
                  </h3>
                  <ul className="text-sm text-cyan-200 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Send your data to any server</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Share with anyone (ever)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Track or monitor you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Collect any personal information</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-5">
                  <h3 className="font-bold text-amber-300 mb-3 flex items-center gap-2 text-lg">
                    <span className="text-2xl">⚠️</span>
                    <span>Important Notes</span>
                  </h3>
                  <ul className="text-sm text-amber-200 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>This is a PROTOTYPE version for testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Data is NOT encrypted yet (encryption coming in next update)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Perfect for managing your family's documents locally</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Keep your recovery key safe (you'll need it to reset PIN)</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setStep('enter')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 active:scale-95 transition-all"
                  aria-label="Accept privacy notice and continue to PIN setup"
                >
                  I Understand - Let's Get Started →
                </button>

                <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-3">
                  <button
                    onClick={() => {
                      if (isInitialized) {
                        // Vault exists, go to lock screen
                        navigate('/', { replace: true });
                      } else {
                        // No vault yet
                        setError('No vault found. Please create a new vault first by clicking "I Understand" above.');
                        setTimeout(() => setError(''), 4000);
                      }
                    }}
                    className="w-full px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium text-base border border-slate-600 active:scale-95 transition-all"
                  >
                    Already have a vault? Login here
                  </button>
                  
                  <a
                    href="/reset.html"
                    target="_blank"
                    className="block w-full px-6 py-2 text-center bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl font-medium text-sm border border-red-500/30 active:scale-95 transition-all"
                  >
                    🗑️ Reset & Clear All Data
                  </a>
                </div>

                <p className="text-center text-sm text-slate-400 mt-4">
                  <a href="/privacy" className="underline hover:text-cyan-400 transition-colors">
                    Read Full Privacy Policy
                  </a>
                </p>
              </div>
            </>
          ) : step === 'recovery-key' ? (
            <>
                {/* Recovery Key Display */}
                <div className="mb-6">
                  <label htmlFor="recovery-key-display" className="block text-sm font-semibold text-slate-300 mb-3 text-center">
                    Your Recovery Key
                  </label>
                  <div className="relative bg-slate-900/70 border-2 border-cyan-500/50 rounded-xl p-5">
                    <p 
                      id="recovery-key-display"
                      className="text-2xl font-mono font-bold text-cyan-400 tracking-wider text-center break-all"
                      role="status"
                      aria-label={`Your recovery key is: ${recoveryKey}`}
                    >
                      {recoveryKey}
                    </p>
                    <button
                      onClick={handleCopyRecoveryKey}
                      className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${
                        copied
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                      aria-label={copied ? 'Recovery key copied to clipboard' : 'Copy recovery key to clipboard'}
                      title={copied ? 'Copied!' : 'Copy to clipboard'}
                    >
                      {copied ? <Check size={20} aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6" role="group" aria-label="Recovery key actions">
                  <button
                    onClick={handleDownloadRecoveryKey}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all text-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 active:scale-95"
                    aria-label="Download recovery key as a text file"
                  >
                    <Download size={20} aria-hidden="true" />
                    Download as Text File
                  </button>
                  
                  <button
                    onClick={handleCopyRecoveryKey}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all text-lg border border-slate-600/50 active:scale-95"
                    aria-label={copied ? 'Recovery key copied to clipboard' : 'Copy recovery key to clipboard'}
                  >
                    {copied ? <Check size={20} aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>

              {/* Warning Box */}
              <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4 mb-6">
                <p className="text-sm font-bold text-amber-300 mb-2">
                  ⚠️ Critical Instructions
                </p>
                <ul className="text-sm text-amber-200 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Save this key in a safe place (not in FileSafe)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Write it down on paper or print it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>Never share this key with anyone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>Without it, you cannot recover your vault</span>
                  </li>
                </ul>
        </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-3 p-4 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl cursor-pointer hover:bg-cyan-500/15 transition-all">
                <input
                  type="checkbox"
                  checked={savedConfirmed}
                  onChange={(e) => setSavedConfirmed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-cyan-500 rounded focus:ring-2 focus:ring-cyan-500"
                />
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1">
                    I have saved my recovery key
                  </p>
                  <p className="text-sm text-slate-400">
                    I understand that without this key, I cannot recover my vault if I forget my PIN.
                  </p>
                </div>
              </label>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!savedConfirmed}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 active:scale-95"
              >
                {savedConfirmed ? 'Continue to FileSafe →' : 'Please confirm you saved the key'}
              </button>
            </>
          ) : (
            <>
                {/* PIN Display */}
                <div className="flex justify-center gap-3 mb-8" role="status" aria-live="polite" aria-label={`PIN ${step === 'enter' ? 'entered' : 'confirmed'}: ${(step === 'enter' ? pin : confirmPin).length} of 6 digits`}>
            {[...Array(6)].map((_, i) => {
              const currentPin = step === 'enter' ? pin : confirmPin;
              const isFilled = i < currentPin.length;

              return (
                <div
                  key={i}
                  className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                    isFilled
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                            : 'border-slate-600 bg-slate-900/50 text-slate-600'
                  }`}
                        aria-hidden="true"
                >
                  {isFilled ? '•' : ''}
                </div>
              );
            })}
          </div>

          {/* Number Pad */}
                <div className="grid grid-cols-3 gap-3" role="group" aria-label="PIN number pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handlePinInput((step === 'enter' ? pin : confirmPin) + num)}
                className="h-16 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-600
                                 border border-slate-600/50
                                 text-2xl font-semibold text-white transition-colors"
                      aria-label={`Enter ${num}`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={handleBack}
              disabled={step === 'enter'}
              className={`h-16 rounded-xl text-sm font-medium transition-colors ${
                step === 'enter'
                      ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-700/30'
                      : 'bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-600 text-slate-300 border border-slate-600/50'
              }`}
            >
              Back
            </button>

            <button
              onClick={() => handlePinInput((step === 'enter' ? pin : confirmPin) + '0')}
              className="h-16 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-600
                             border border-slate-600/50
                             text-2xl font-semibold text-white transition-colors"
            >
              0
            </button>

            <button
              onClick={() => {
                if (step === 'enter') {
                  setPin(pin.slice(0, -1));
                } else {
                  setConfirmPin(confirmPin.slice(0, -1));
                }
              }}
              className="h-16 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-600
                             border border-slate-600/50
                             text-sm font-medium text-slate-300 transition-colors"
            >
              Delete
            </button>
          </div>
            </>
          )}
        </main>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/90 backdrop-blur-sm text-white rounded-xl p-4 flex items-start gap-3 animate-fadeIn mb-4 border border-red-400/30">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Security Warning - Show only on PIN entry steps */}
        {step !== 'recovery-key' && step !== 'welcome' && (
        <div className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 rounded-xl p-4 text-amber-200 text-xs text-center">
          <AlertCircle size={16} className="inline mb-1" /> <strong>Prototype Notice:</strong> This
          PIN is not yet encrypted. Do not use real document data.
        </div>
        )}

        {/* Additional Recovery Key Warning */}
        {step === 'recovery-key' && (
          <p className="text-center text-slate-300 text-sm font-medium">
            Losing this key means permanent lockout if you forget your PIN
          </p>
        )}

        {/* Version Number */}
        <p className="text-center text-slate-400 text-xs mt-4 opacity-60">
          FileSafe v1.1.0
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;
