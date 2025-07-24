import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Heart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/watchlist', label: 'Watchlist', icon: <Heart size={18} /> },
    { path: '/profile', label: 'Profile', icon: <User size={18} /> },
    
  ];

  const baseLinkStyle =
    'flex items-center gap-2 px-4 py-2 rounded transition text-sm font-medium';
  const activeStyle = 'text-blue-400 bg-gray-800';
  const inactiveStyle = 'text-white hover:text-blue-400 hover:bg-gray-800';

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-blue-400 cursor-pointer select-none"
        >
          🎬 MovieApp
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {navItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `${baseLinkStyle} ${isActive ? activeStyle : inactiveStyle}`
              }
              onClick={() => setIsOpen(false)}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `${baseLinkStyle} block ${isActive ? activeStyle : inactiveStyle}`
              }
              onClick={() => setIsOpen(false)}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
