import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Database, Cloud, Eye } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 safe-top shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Last Updated: December 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="px-6 py-8 max-w-4xl mx-auto">
        {/* Privacy Commitment */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Shield className="text-primary-600 dark:text-primary-400" size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Our Privacy Commitment
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                FileSafe is built with your privacy as the top priority. We believe your personal documents should stay <strong>YOURS</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* What We DON'T Do */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <Eye className="text-red-600 dark:text-red-400" size={28} />
            What We DON'T Do
          </h2>
          <div className="card">
            <ul className="space-y-3">
              {[
                'We do NOT collect your data',
                'We do NOT send your data to any server',
                'We do NOT share your data with anyone',
                'We do NOT track you',
                'We do NOT use analytics',
                'We do NOT sell your information',
                'We do NOT have access to your documents'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-600 dark:text-red-400 text-xl font-bold">❌</span>
                  <span className="text-gray-700 dark:text-gray-300 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How Your Data is Stored */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <Database className="text-green-600 dark:text-green-400" size={28} />
            How Your Data is Stored
          </h2>
          <div className="space-y-4">
            <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-green-600 dark:text-green-400 text-xl font-bold">✅</span>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-green-200 text-lg">100% Local Storage</h3>
                  <p className="text-green-800 dark:text-green-300 mt-1">
                    All your documents are stored ONLY on YOUR device in your browser's local database (IndexedDB).
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-green-600 dark:text-green-400 text-xl font-bold">✅</span>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-green-200 text-lg">No Server</h3>
                  <p className="text-green-800 dark:text-green-300 mt-1">
                    FileSafe does not have servers to store your data. Everything stays on your device.
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-green-600 dark:text-green-400 text-xl font-bold">✅</span>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-green-200 text-lg">Offline-First</h3>
                  <p className="text-green-800 dark:text-green-300 mt-1">
                    The app works completely offline. Your data never needs to leave your device.
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-green-600 dark:text-green-400 text-xl font-bold">✅</span>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-green-200 text-lg">Your Control</h3>
                  <p className="text-green-800 dark:text-green-300 mt-1">
                    You can delete all data anytime from Settings → Data Management → Delete All Data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Data FileSafe Stores Locally */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <Lock className="text-primary-600 dark:text-primary-400" size={28} />
            What Data FileSafe Stores Locally
          </h2>
          <div className="card">
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
              The following is stored ONLY on YOUR device:
            </p>
            <ul className="space-y-2 ml-6">
              {[
                'Your PIN (currently not encrypted - prototype version)',
                'Your recovery key',
                'Your documents (titles, numbers, dates, etc.)',
                'Your family profiles',
                'Your app preferences (theme, settings)'
              ].map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Browser Data */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            When You Close Your Browser
          </h2>
          <div className="card">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Your data stays on your device in IndexedDB. It's available next time you open FileSafe.
            </p>
          </div>
        </section>

        {/* Clearing Data */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            When You Clear Browser Data
          </h2>
          <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-900 dark:text-yellow-200 mb-3 text-lg font-semibold">
              ⚠️ Important Warning
            </p>
            <p className="text-yellow-800 dark:text-yellow-300 mb-3">
              If you clear your browser's site data or IndexedDB, you will LOSE all your documents unless you have:
            </p>
            <ul className="space-y-2 ml-6">
              {[
                'Saved your recovery key (offline)',
                'Exported your data (Settings → Export)',
                'Backed up your browser profile'
              ].map((item, index) => (
                <li key={index} className="text-yellow-800 dark:text-yellow-300 list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Future Cloud Storage */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <Cloud className="text-blue-600 dark:text-blue-400" size={28} />
            Future Cloud Storage (Optional)
          </h2>
          <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
            <p className="text-blue-900 dark:text-blue-200 mb-3 text-lg font-semibold">
              Status: Not yet available (planned for future update)
            </p>
            <p className="text-blue-800 dark:text-blue-300 mb-4">
              When available, cloud storage will be:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✅</span>
                <span className="text-blue-800 dark:text-blue-300"><strong>Optional</strong> - You choose whether to use it</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✅</span>
                <span className="text-blue-800 dark:text-blue-300"><strong>Encrypted</strong> - End-to-end encryption before upload</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✅</span>
                <span className="text-blue-800 dark:text-blue-300"><strong>Your Key</strong> - Only you have the encryption key</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✅</span>
                <span className="text-blue-800 dark:text-blue-300"><strong>Zero-Knowledge</strong> - We cannot see your documents</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 font-bold">❌</span>
                <span className="text-blue-800 dark:text-blue-300"><strong>Not Default</strong> - Local storage remains the default</span>
              </div>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Third-Party Services
          </h2>
          <div className="card">
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
              <strong>Current:</strong> None. FileSafe uses zero third-party services.
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              <strong>Future:</strong> If cloud storage is added, we will clearly disclose:
            </p>
            <ul className="space-y-2 ml-6 mt-2">
              {[
                'Which service is used',
                'How your data is encrypted',
                'Your rights and controls'
              ].map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Children's Privacy
          </h2>
          <div className="card">
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-lg">
              FileSafe is designed for parents to manage family documents. We do not:
            </p>
            <ul className="space-y-2 ml-6">
              {[
                'Knowingly collect data from children under 13',
                'Require children to input data',
                'Share any data with third parties'
              ].map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 list-disc">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-3 text-lg">
              Parents control all data on their own device.
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your Rights
          </h2>
          <div className="card">
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-lg">
              You have the right to:
            </p>
            <ul className="space-y-2">
              {[
                { icon: '✅', text: 'Access all your data (it\'s on your device)' },
                { icon: '✅', text: 'Delete all your data (Settings → Delete All Data)' },
                { icon: '✅', text: 'Export your data (Settings → Export Vault)' },
                { icon: '✅', text: 'Stop using FileSafe anytime' }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 text-xl font-bold">{item.icon}</span>
                  <span className="text-gray-700 dark:text-gray-300 text-lg">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Security
          </h2>
          <div className="space-y-4">
            <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
              <h3 className="font-bold text-yellow-900 dark:text-yellow-200 text-lg mb-2">
                ⚠️ Current Version (Prototype)
              </h3>
              <p className="text-yellow-800 dark:text-yellow-300">
                Your PIN and documents are NOT encrypted yet. This is a prototype. Do not use for real sensitive documents.
              </p>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
              <h3 className="font-bold text-green-900 dark:text-green-200 text-lg mb-2">
                🔒 Future Version (Planned)
              </h3>
              <p className="text-green-800 dark:text-green-300">
                All data will be encrypted using AES-256-GCM encryption before storage.
              </p>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Compliance
          </h2>
          <div className="card">
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-lg">
              FileSafe is designed to comply with:
            </p>
            <ul className="space-y-2 ml-6">
              {[
                'GDPR (Europe)',
                'CCPA (California)',
                'COPPA (Children\'s Privacy)',
                'Other privacy regulations'
              ].map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 list-disc">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4 text-lg">
              Since all data is local, most regulations do not apply.
            </p>
          </div>
        </section>

        {/* Legal Basis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Legal Basis (GDPR)
          </h2>
          <div className="card">
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              We do not process personal data. All data processing happens locally on your device. You are the data controller of your own information.
            </p>
          </div>
        </section>

        {/* Changes to Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Changes to Privacy Policy
          </h2>
          <div className="card">
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-lg">
              If we change how we handle data, we will:
            </p>
            <ul className="space-y-2 ml-6">
              {[
                'Update this policy',
                'Show a notice in the app',
                'Require your consent for material changes'
              ].map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Summary Box */}
        <div className="bg-gradient-to-r from-green-50 to-primary-50 dark:from-green-900/20 dark:to-primary-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            📱 In Summary
          </h3>
          <div className="space-y-3 text-center">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              Your data is YOURS.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              It stays on your device. We never see it, access it, or share it.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              You have full control, always.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;

