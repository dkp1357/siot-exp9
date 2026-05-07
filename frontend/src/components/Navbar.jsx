import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, Camera } from 'lucide-react';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();

  return (
    <nav>
      <div className="logo">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Camera size={28} color="#6366f1" />
          <span>FaceAuth<span style={{ color: '#6366f1' }}>.</span></span>
        </Link>
      </div>
      <div className="nav-links">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
            <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
            <button 
              onClick={onLogout} 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-muted)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: 500
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
