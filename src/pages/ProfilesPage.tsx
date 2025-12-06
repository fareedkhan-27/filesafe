import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, AlertCircle } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { createProfile } from '../services/vaultStorage';
import { Profile } from '../types/vault';
import { isExpiringSoon } from '../utils/dateHelpers';

const ProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { profiles, documents, refreshProfiles } = useVault();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileRelationship, setNewProfileRelationship] = useState('');
  const [newProfileAvatar, setNewProfileAvatar] = useState('👤');

  const avatarOptions = ['👤', '👨', '👩', '👦', '👧', '👴', '👵', '👶'];

  const getProfileDocCount = (profileId: string) => {
    return documents.filter(d => d.profileId === profileId).length;
  };

  const getProfileExpiringDocs = (profileId: string) => {
    return documents.filter(
      d => d.profileId === profileId && d.expiry_date && isExpiringSoon(d.expiry_date, 90)
    ).length;
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProfileName.trim()) {
      return;
    }

    try {
      const newProfile: Profile = {
        id: `profile-${Date.now()}`,
        name: newProfileName.trim(),
        relationship: newProfileRelationship || undefined,
        avatar: newProfileAvatar,
        createdAt: new Date().toISOString()
      };

      await createProfile(newProfile);
      await refreshProfiles();

      setShowAddModal(false);
      setNewProfileName('');
      setNewProfileRelationship('');
      setNewProfileAvatar('👤');
    } catch (error) {
      // Show error to user
      alert('Failed to create profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 flex-1">Family & Profiles</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Profile List */}
      <div className="px-4 py-6 space-y-3">
        {profiles.map(profile => {
          const docCount = getProfileDocCount(profile.id);
          const expiringCount = getProfileExpiringDocs(profile.id);

          return (
            <div key={profile.id} className="card">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{profile.avatar}</div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{profile.name}</h3>
                  {profile.relationship && (
                    <p className="text-sm text-gray-500 capitalize mb-2">
                      {profile.relationship}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FileText size={14} />
                      <span>{docCount} {docCount === 1 ? 'document' : 'documents'}</span>
                    </div>

                    {expiringCount > 0 && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <AlertCircle size={14} />
                        <span>{expiringCount} expiring</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {profiles.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500">No profiles yet</p>
          </div>
        )}
      </div>

      {/* Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Profile</h3>

            <form onSubmit={handleAddProfile} className="space-y-4">
              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {avatarOptions.map(avatar => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setNewProfileAvatar(avatar)}
                      className={`text-3xl p-2 rounded-lg border-2 transition-colors ${
                        newProfileAvatar === avatar
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={e => setNewProfileName(e.target.value)}
                  className="input"
                  placeholder="John Doe"
                  required
                  autoFocus
                />
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship (optional)
                </label>
                <select
                  value={newProfileRelationship}
                  onChange={e => setNewProfileRelationship(e.target.value)}
                  className="input"
                >
                  <option value="">Select...</option>
                  <option value="self">Self</option>
                  <option value="spouse">Spouse</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Add Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilesPage;
