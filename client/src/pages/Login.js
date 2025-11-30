import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login, user, loading } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error === 'auth_failed') {
      console.error('Authentication failed');
    }
  }, []);

  // Redirect if logged in
  if (user) {
    window.location.href = '/';
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mx-auto mb-4 rounded-full bg-white border border-gray-200 shadow-sm p-3">
            <Logo className="h-12 w-12 object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-wide">ASSESSMENT PORTAL</h2>
          <h2 className="text-3xl font-bold text-primary-600 tracking-wide">E-GROOTS</h2>

          <p className="mt-2 text-sm text-gray-600">Connect with your peers and teachers</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-gray-200 py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sign in to your account</h3>
              <p className="text-sm text-gray-600 mb-6">Use your college email to access the platform</p>
            </div>

            <button
              onClick={login}
              className="w-full flex justify-center items-center px-4 py-3 rounded-xl shadow-sm bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600">Features</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <svg className="w-8 h-8 text-primary-600 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
                  <h4 className="text-sm font-medium text-gray-900">Ask Questions</h4>
                  <p className="text-xs text-gray-600">Get help from peers and teachers</p>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 text-primary-600 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" /></svg>
                  <h4 className="text-sm font-medium text-gray-900">Share Knowledge</h4>
                  <p className="text-xs text-gray-600">Answer questions and help others</p>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 text-primary-600 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4z" /></svg>
                  <h4 className="text-sm font-medium text-gray-900">Discuss</h4>
                  <p className="text-xs text-gray-600">Engage in meaningful discussions</p>
                </div>
                <div className="text-center">
                  <svg className="w-8 h-8 text-primary-600 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,22 2,22" /></svg>
                  <h4 className="text-sm font-medium text-gray-900">Secure</h4>
                  <p className="text-xs text-gray-600">Safe and moderated environment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/teacher-login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Teacher Login
          </Link>
        </p>
        <p className="text-xs text-gray-500 mt-2">By signing in, you agree to our Terms of Service and Privacy Policy</p>
      </div>

      {/* FIXED GOOGLE LOGIN BUTTON */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <a
          href={`${import.meta.env.VITE_API_URL}/auth/google`}
          className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
        >
          <svg className="h-5 w-5 mr-2" />
          Continue with Google
        </a>

        <Link
          to="/register"
          className="inline-flex w-full justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
        >
          Create account
        </Link>
      </div>
    </div>
  );
};

export default Login;
