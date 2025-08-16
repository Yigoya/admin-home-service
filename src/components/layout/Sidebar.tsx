import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  WrenchScrewdriverIcon, 
  CalendarDaysIcon, 
  ShieldExclamationIcon, 
  DocumentTextIcon, 
  BuildingStorefrontIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import classNames from 'classnames';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Users',
    path: '/users',
    icon: UsersIcon,
    children: [
      { name: 'Customers', path: '/users/customers', icon: UserGroupIcon },
      { name: 'Technicians', path: '/users/technicians', icon: UserIcon },
      { name: 'Register Technician', path: '/users/technicians/register', icon: UserIcon },
      { name: 'Operators', path: '/users/operators', icon: UserIcon },
      { name: 'Register Operator', path: '/users/operators/register', icon: UserIcon },
      { name: 'Pending Verifications', path: '/users/pending-verifications', icon: ShieldExclamationIcon }
    ]
  },
  {
    name: 'Services',
    path: '/services',
    icon: WrenchScrewdriverIcon
  },
  {
    name: 'Bookings',
    path: '/bookings',
    icon: CalendarDaysIcon
  },
  {
    name: 'Disputes',
    path: '/disputes',
    icon: ShieldExclamationIcon
  },
  {
    name: 'Tenders',
    path: '/tenders',
    icon: DocumentTextIcon
  },
  {
    name: 'Businesses',
    path: '/businesses',
    icon: BuildingStorefrontIcon
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Cog6ToothIcon
  }
];

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  const toggleItem = (itemName: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const renderSidebarItem = (item: SidebarItem) => {
    const active = isActive(item.path);
    const expanded = expandedItems[item.name];
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <div key={item.name} className="mb-1">
        <div
          className={classNames(
            'flex items-center justify-between px-4 py-2 rounded-md cursor-pointer',
            {
              'bg-blue-700 text-white': active && !hasChildren,
              'hover:bg-slate-700 text-slate-300 hover:text-white': !active || hasChildren
            }
          )}
          onClick={() => hasChildren ? toggleItem(item.name) : null}
        >
          <Link 
            to={hasChildren ? '#' : item.path} 
            className="flex items-center w-full"
            onClick={(e) => hasChildren && e.preventDefault()}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
          </Link>
          
          {hasChildren && (
            <button onClick={() => toggleItem(item.name)} className="p-1">
              {expanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        
        {hasChildren && expanded && (
          <div className="ml-6 mt-1 border-l-2 border-slate-700 pl-2">
            {item.children?.map(child => (
              <Link
                key={child.path}
                to={child.path}
                className={classNames(
                  'flex items-center px-4 py-2 mt-1 rounded-md text-sm',
                  {
                    'bg-blue-700 text-white': isActive(child.path),
                    'text-slate-300 hover:bg-slate-700 hover:text-white': !isActive(child.path)
                  }
                )}
              >
                <child.icon className="w-4 h-4 mr-2" />
                <span>{child.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="h-screen w-64 bg-slate-800 text-white py-4 flex flex-col">
      <div className="px-4 py-4 border-b border-slate-700 mb-4">
        <h1 className="text-xl font-bold">Home Service Admin</h1>
      </div>
      
      <div className="px-2 overflow-y-auto flex-grow">
        {sidebarItems.map(renderSidebarItem)}
      </div>
      
      <div className="mt-auto border-t border-slate-700 p-4">
        <button
          onClick={() => logout()}
          className="flex items-center text-slate-300 hover:text-white w-full px-4 py-2 rounded-md hover:bg-slate-700"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 