import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/cartoon-studio', label: 'Cartoon Studio', icon: '🎨' },
    { path: '/ad-maker', label: 'Ad Maker AI', icon: '📢' },
    { path: '/time-travel', label: 'Time Travel Camera', icon: '📷' },
    { path: '/generate-image', label: 'Image Generator', icon: '🖼️' },
    { path: '/generate-animation', label: 'Animation Maker', icon: '🎬' }
  ];

  return (
    <>
      {/* Hamburger Menu Button - Hidden when sidebar is open */}
      <button 
        className={`fixed top-5 left-5 z-50 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-xl flex flex-col justify-center items-center gap-1 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${isOpen ? 'opacity-0 invisible scale-75' : 'opacity-100 visible scale-100'}`}
        onClick={toggleSidebar}
      >
        <span className="w-5 h-0.5 bg-white rounded"></span>
        <span className="w-5 h-0.5 bg-white rounded"></span>
        <span className="w-5 h-0.5 bg-white rounded"></span>
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar Navigation */}
      <nav className={`fixed top-0 left-0 w-80 h-full bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 z-40 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Close Button - X in top right corner of sidebar */}
        <button 
          className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md z-10"
          onClick={toggleSidebar}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sidebar Header */}
        <div className="p-6 pb-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <h2 className="text-xl font-semibold mb-1 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Nano Banana AI
          </h2>
          <p className="text-sm opacity-90 font-light">AI-Powered Creativity</p>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 p-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-1 my-1 rounded-full text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                location.pathname === item.path 
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:text-blue-600 hover:translate-x-1'
              }`}
              onClick={() => setIsOpen(false)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="text-lg mr-3 min-w-6 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              
              {/* Hover background effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full transition-all duration-300 -z-10 ${
                location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></div>
            </Link>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80">
          <div className="flex items-center p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center mr-3 text-white">
              👤
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-0.5">User</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};