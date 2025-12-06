import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Users, Settings, LogOut, Moon, Sun, X } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useTheme } from '../context/ThemeContext';

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { lock } = useVault();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLock = () => {
    setIsOpen(false);
    lock();
    navigate('/', { replace: true });
  };

  const menuItems = [
    {
      icon: Users,
      label: 'Family Profiles',
      description: 'Manage family members',
      onClick: () => {
        setIsOpen(false);
        navigate('/profiles');
      },
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'App preferences & security',
      onClick: () => {
        setIsOpen(false);
        navigate('/settings');
      },
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-800'
    },
    {
      icon: theme === 'dark' ? Sun : Moon,
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      description: 'Change appearance',
      onClick: () => {
        toggleTheme();
      },
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20'
    },
    {
      icon: LogOut,
      label: 'Lock Vault',
      description: 'Require PIN to access',
      onClick: handleLock,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      divider: true
    }
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all active:scale-95"
        aria-label="Open menu"
      >
        <Menu size={28} strokeWidth={2} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white dark:bg-gray-900 shadow-2xl z-50 animate-slideIn overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5 safe-top">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h2>
                <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5">Quick actions</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-4 py-6 space-y-2">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.divider && <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />}
                <button
                  onClick={item.onClick}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group active:scale-98"
                >
                  <div className={`p-3 rounded-xl ${item.bgColor} ${item.color} transition-all group-hover:scale-110`}>
                    <item.icon size={24} strokeWidth={2} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Footer Info */}
          <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                FileSafe v1.2.1
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Personal Document Assistant
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
