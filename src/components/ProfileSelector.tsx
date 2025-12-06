import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Profile } from '../types/vault';

interface ProfileSelectorProps {
  profiles: Profile[];
  currentProfileId: string;
  onChange: (profileId: string) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  currentProfileId,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentProfile = profiles.find(p => p.id === currentProfileId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (profileId: string) => {
    onChange(profileId);
    setIsOpen(false);
  };

  if (!currentProfile) return null;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700
                   hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md active:scale-98 transition-all"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current profile: ${currentProfile.name}. Click to switch profiles.`}
      >
        <span className="text-2xl" aria-hidden="true">{currentProfile.avatar}</span>
        <span className="font-semibold text-gray-900 dark:text-white text-base">{currentProfile.name}</span>
        <ChevronDown
          size={20}
          strokeWidth={2.5}
          className={`text-gray-400 dark:text-gray-500 transition-transform ml-auto ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700
                        shadow-xl z-50 animate-fadeIn overflow-hidden"
          role="listbox"
          aria-label="Available profiles"
        >
          <div className="py-2">
            {profiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => handleSelect(profile.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 text-left
                           hover:bg-gray-50 dark:hover:bg-gray-700/50 active:scale-98 transition-all ${
                  profile.id === currentProfileId ? 'bg-primary-50 dark:bg-primary-900/30' : ''
                }`}
                role="option"
                aria-selected={profile.id === currentProfileId}
                aria-label={`Switch to ${profile.name}${profile.relationship ? `, ${profile.relationship}` : ''}`}
              >
                <span className="text-2xl" aria-hidden="true">{profile.avatar}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-base">{profile.name}</p>
                  {profile.relationship && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">{profile.relationship}</p>
                  )}
                </div>
                {profile.id === currentProfileId && (
                  <span className="sr-only">(currently selected)</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
