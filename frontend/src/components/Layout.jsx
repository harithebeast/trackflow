import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Leads', href: '/leads' },
  { name: 'Orders', href: '/orders' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-200 p-6 space-y-6 text-gray-800">
        <div className="text-gray-900 text-2xl font-bold">TrackFlow</div>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900">
            Dashboard
          </Link>
          <Link to="/leads" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900">
            Leads
          </Link>
          <Link to="/orders" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300 hover:text-gray-900">
            Orders
          </Link>
          {/* Add other navigation links here */}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Optional Header/Navbar could go here */}
        {/* <header className="flex items-center justify-between p-6 bg-gray-800">...</header> */}

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 