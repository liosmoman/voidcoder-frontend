// src/Sidebar.js
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
    HomeIcon, 
    ClockIcon, 
    SparklesIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'History', href: '/history', icon: ClockIcon },
];

function Sidebar({ isOpen, toggleSidebar }) { 
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      <aside 
        className={`
          w-64 bg-nimbus-sidebar-gradient text-nimbus-sidebar-text flex flex-col 
          fixed top-0 left-0 h-screen shadow-2xl z-30 
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transition-transform duration-300 ease-in-out
        `}
      >
        {/* Header with Logo and Close button for mobile */}
        <div className="flex items-center justify-between h-20 border-b border-white/10 px-4 shrink-0">
          <Link 
            to="/dashboard" 
            className="text-xl font-bold text-white hover:opacity-80 transition-opacity flex items-center"
            onClick={() => { if(isOpen && window.innerWidth < 768) { toggleSidebar(); }}}
          >
            <SparklesIcon className="h-7 w-7 mr-2 text-nimbus-primary-accent" />
            VoidCoder
          </Link>
          <button onClick={toggleSidebar} className="md:hidden text-nimbus-sidebar-text hover:text-white p-1">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              onClick={() => { if(isOpen && window.innerWidth < 768) { toggleSidebar(); }}}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 rounded-lg transition-all duration-200 ease-in-out group
                 hover:bg-nimbus-sidebar-hover hover:text-white 
                 focus:outline-none focus:ring-2 focus:ring-nimbus-primary-accent focus:ring-opacity-50
                 ${isActive 
                   ? 'bg-nimbus-gradient-mid text-white shadow-md' 
                   : 'text-nimbus-sidebar-text'}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    className={`h-6 w-6 mr-3 transition-colors duration-200 group-hover:text-white ${
                      isActive ? 'text-white' : 'text-nimbus-sidebar-text/70'
                    }`}
                    aria-hidden="true" 
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Footer / Upgrade Section */}
        <div className="p-4 border-t border-slate-700 shrink-0">
          <div className="bg-white/5 p-4 rounded-lg text-center backdrop-blur-sm">
            <h4 className="font-semibold text-sm text-white mb-1">Upgrade to VoidCoder Pro</h4>
            <p className="text-xs text-slate-200 mb-3">Unlock advanced features & history.</p>
            <button 
              className="w-full bg-nimbus-primary-accent hover:opacity-90 text-white text-sm font-semibold py-2 px-3 rounded-md transition duration-200"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;