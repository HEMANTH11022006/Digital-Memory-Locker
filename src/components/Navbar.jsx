import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { Lock, Unlock, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, locked, lock, logout } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/auth' || location.pathname === '/lock';

  if (isAuthPage) return null;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 glass border-b-0 border-t-0 border-x-0"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-100">
              Memory<span className="text-indigo-400">Locker</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {!locked && (
                  <button
                    onClick={lock}
                    className="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Lock</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors px-3 py-2 rounded-lg hover:bg-red-400/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-medium bg-white text-slate-900 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
