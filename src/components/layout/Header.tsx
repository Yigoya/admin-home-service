import { useState } from 'react';
import { BellIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="relative">
          <button
            className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <span className="mr-2">{user?.name || 'Admin'}</span>
            <UserCircleIcon className="h-8 w-8 text-gray-600" />
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a
                href="#profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </a>
              <a
                href="#settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <button
                onClick={() => logout()}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 