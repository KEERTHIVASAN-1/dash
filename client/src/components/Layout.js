import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  MessageSquare, 
  Plus, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Users,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import Logo from './Logo';
import { getAvatarUrl } from '../utils/helpers';

const Layout = () => {
  const { user, logout, isAdmin, isTeacher } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Ask Question', href: '/ask', icon: Plus },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
    { name: 'User Management', href: '/admin/users', icon: Users },
  ];

  const teacherNavigation = [
    { name: 'Teacher Dashboard', href: '/teacher-dashboard', icon: GraduationCap },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex flex-shrink-0 items-center px-4 py-4">
            <Logo className="h-10 w-auto mr-2" alt="E-GROOTS Logo" />
            <h1 className="text-xl font-bold text-emerald-700">E-GROOTS</h1>
          </div>
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
              {isTeacher() && teacherNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
              {isAdmin() && adminNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Logo className="h-12 w-auto mr-2" alt="E-GROOTS Logo" />
              <h1 className="text-xl font-bold text-emerald-700">E-GROOTS</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
              {isTeacher() && (
                <div className="relative">
                  <button 
                    className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-emerald-700"
                    onClick={() => setTeacherDropdownOpen(prev => !prev)}
                  >
                    <GraduationCap className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left">Teacher</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {teacherDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-full bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      {teacherNavigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`group flex items-center px-4 py-2 text-sm font-medium ${
                              isActive(item.href)
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                            }`}
                            onClick={() => setTeacherDropdownOpen(false)}
                          >
                            <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {/* Dropdown Menu for Admin */}
              {isAdmin() && (
                <div className="relative">
                  <button 
                    className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-primary-700"
                    onClick={() => setAdminDropdownOpen(prev => !prev)}
                  >
                    <Shield className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left">Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {adminDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-full bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      {adminNavigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`group flex items-center px-4 py-2 text-sm font-medium ${
                              isActive(item.href)
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-primary-700'
                            }`}
                            onClick={() => setAdminDropdownOpen(false)}
                          >
                            <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      {!avatarError && getAvatarUrl(user?.avatar, user?.email) ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={getAvatarUrl(user?.avatar, user?.email)}
                          alt={user?.name}
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <span className="text-sm font-medium text-primary-600">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Quick Links below profile */}
              <Link
                to="/all-questions"
                className="mt-2 flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                <MessageSquare className="mr-3 h-4 w-4" />
                All Questions
              </Link>
              <button
                onClick={handleLogout}
                className="mt-2 flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200 lg:hidden">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <h1 className="text-lg font-semibold text-gray-900 self-center">ASSESMENT PORTAL E-GROOTS</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  {!avatarError && getAvatarUrl(user?.avatar, user?.email) ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={getAvatarUrl(user?.avatar, user?.email)}
                      alt={user?.name}
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="text-sm font-medium text-primary-600">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
