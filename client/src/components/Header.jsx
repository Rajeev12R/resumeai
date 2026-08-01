import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, LogOut, LayoutDashboard } from 'lucide-react';
import api from '../api';

const Header = () => {
  const navigate = useNavigate();
  
  let user = null;
  try {
    const userData = localStorage.getItem('user');
    if (userData) user = JSON.parse(userData);
  } catch (e) {
    user = null;
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      await api.post('/auth/logout');
      navigate('/auth');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-primary p-1">
            <BrainCircuit size={20} className="text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">ResumeAI</span>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
              Welcome back, <strong className="text-foreground">{user.name}</strong>
            </span>
            <Link 
              to="/dashboard" 
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <LayoutDashboard size={16} className="mr-2" /> Dashboard
            </Link>
            <button 
              onClick={handleLogout} 
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link 
              to="/auth" 
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
